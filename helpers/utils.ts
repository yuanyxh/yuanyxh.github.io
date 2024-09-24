import frontmatter from 'front-matter';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { basename, relative, sep } from 'node:path';
import path from 'path';
import { codeToHtml } from 'shiki';
import { loadEnv } from 'vite';

export interface Meta {
  title: string;
  date: string;
  author: string;
  description: string;
  imageUrl: string;
  keywords: string;
  book?: boolean;
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

export type ITemplateType = 'prerender' | 'sitemap';

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

/** parse and build local file transform to route */
export async function buildFiles(
  dirs: string[],
  parent: string,
  root: string,
  meta: Record<string, string>
) {
  let result = '';

  for await (const name of dirs) {
    const fullname = resolve(parent, name);

    const isDirectory = lstatSync(fullname).isDirectory();

    if (isDirectory) {
      result += await buildFiles(readdirSync(fullname), fullname, root, meta);
      continue;
    }

    const code = readFileSync(fullname, 'utf-8');

    const html = await codeToHtml(code, {
      lang: path.extname(fullname).slice(1),
      theme: 'one-dark-pro'
    });

    const data = `export default function Default() {
        return <div dangerouslySetInnerHTML={{ __html: \`${html}\` }}></div>
      }`;

    const newName = replaceFileExtension(name);

    const paths = relative(root, parent).split(sep).filter(Boolean);
    const folder = resolve(root, 'code', ...paths);

    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
    }

    writeFileSync(resolve(folder, newName), data, 'utf-8');

    let route = '';

    if (newName === 'Index.tsx') {
      route = 'index';
    } else if (paths.length) {
      route = paths.join('-') + '-' + newName + '.html';
    } else {
      route = newName + '.html';
    }

    result += `{
        path: '${route}',
        element: () => import('@/examples/${basename(root)}/code/${paths.length === 0 ? '' : paths.length > 1 ? paths.join('/') : paths[0] + '/'}${newName}'),
        meta: ${JSON.stringify(meta)}
      },
      `;
  }

  return result;
}

/** build example transform to route page */
export async function buildExample(path: string) {
  const template = readFileSync(resolve('./src/coder/Wrapper.tsx'), 'utf-8');

  const rootDirectory = resolve(path);
  let result = '';

  const codeDirectory = resolve(rootDirectory, `code`);
  const value = template.replace('base64_coder/Index', `${basename(rootDirectory)}/Index`);

  if (!existsSync(resolve(codeDirectory))) {
    mkdirSync(codeDirectory, { recursive: true });
  }

  writeFileSync(resolve(codeDirectory, '__.tsx'), value, 'utf-8');

  const indexContent = readFileSync(resolve(rootDirectory, 'Index.tsx'), 'utf-8');

  let meta = {};
  const match = indexContent.match(/(?<=export const meta = {)[\w\W]*?(?=};)/);

  if (match) {
    meta = new Function(`return {${match[0]}}`)();
  }

  result += `{
        path: "${basename(rootDirectory)}",
        element: () => import("@/examples/${basename(rootDirectory)}/code/__.tsx"),
        meta: ${JSON.stringify(meta)},
        children: [
      `;

  const children = readdirSync(rootDirectory).filter((p) => p !== 'code');

  result += await buildFiles(children, rootDirectory, rootDirectory, meta);

  result += ']},';

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
