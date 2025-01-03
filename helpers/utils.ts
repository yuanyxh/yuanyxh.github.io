import frontmatter from 'front-matter';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import path from 'node:path';
import { loadEnv } from 'vite';

export interface Meta {
  title: string;
  date: string;
  author: string;
  description: string;
  imageUrl: string;
  keywords: string;
  book?: boolean;
  draft?: boolean;
}

export interface RouteObject {
  path: string;
  children?: RouteObject[];
  meta?: Meta;
}

export interface ResolveRouteObject extends RouteObject {
  fullPath: string;
  children?: ResolveRouteObject[];
}

export interface ParserOptions {
  name: string;
  paths: string[];
  parser?(path: string): Promise<string> | string;
  importAlias?(path: string): string;
  transform?(code: string): string;
}

export interface RouteOptions {
  mode: string;
  getRoutes(): ResolveRouteObject[] | Promise<ResolveRouteObject[]>;
  siteConfig: {
    appName: string;
    domain: string;
    title: string;
    description: string;
    logo: string;
    authorPage: string;
    keywords: string;
  };
  buildRouteConfig: {
    /** route config path */
    routeConfig: string;
    routes: ParserOptions[];
  };
  prerenderConfig: {
    prerenderOutput: string;
    excludeOutPathRewrite: string[];
  };
  sitemapConfig: {
    output: string;
  };
}

/** process runing localtion */
export const root = process.cwd();

/** get env from prod config */
export const getEnv = () => {
  return loadEnv('prod', root) as unknown as ImportMetaEnv;
};

/** Start parsing path from cwd */
export const resolve = (...paths: string[]) => path.resolve(root, ...paths);

/** Parse filename as route name */
export const parseRouteName = (path: string) => basename(path).slice(0, -4);

/** Replace file extension with tsx */
export const replaceFileExtension = (name: string) => name.slice(0, name.lastIndexOf('.')) + '.tsx';

/** parse sigle route from local file system */
export async function parseRoute(route: ParserOptions) {
  let routeStr = '';

  for await (const path of route.paths) {
    const fullPath = resolve(path);

    if (route.parser) {
      routeStr = await route.parser(path);

      continue;
    }

    const routeName = parseRouteName(path);
    const { attributes } = frontmatter<Meta>(readFileSync(fullPath, 'utf-8'));

    const aliasPath = route.importAlias?.(path) || path;

    const str = `
      {
        path: "${routeName + '.html'}",
        element: () => import("${aliasPath}"),
        meta: ${JSON.stringify(attributes)}
      },
    `;

    routeStr += str;
  }

  if (route.transform) {
    return route.transform(routeStr);
  }

  return routeStr;
}

/** parse all route from local file system */
export async function parseRoutes(routes: ParserOptions[]) {
  const result: { name: string; value: string }[] = [];

  for await (const route of routes) {
    result.push({ name: route.name, value: await parseRoute(route) });
  }

  return result;
}

/** Replace route placeholders with route data */
export const replacePlaceRoute = (code: string, key: string, value: string) =>
  code.replace(`/** placeholder for ${key} */`, value);

/** resolve all route fullpath */
export function resolveFullRoutes(
  routes: ResolveRouteObject[],
  parent: string,
  result: ResolveRouteObject[]
) {
  routes.map(function map(route) {
    const seps = parent.split('/');
    seps.shift();

    if (route.path === 'index') {
      if (route.children?.length) {
        resolveFullRoutes(route.children, parent, result);
      }

      return route;
    }

    let fullPath = [...seps, route.path].join('/');
    !fullPath.startsWith('/') && (fullPath = '/' + fullPath);

    result.push({ ...route, fullPath });

    if (route.children?.length) {
      resolveFullRoutes(route.children, fullPath, result);
    }

    return route;
  });

  return result;
}
