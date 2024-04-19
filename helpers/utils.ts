import type { ArticleMeta } from './vite-route-generator';

import fast from 'fast-glob';
import frontmatter from 'front-matter';
import { readFileSync } from 'node:fs';
import { sep } from 'node:path';
import path from 'path';

export interface RoutePlace {
  books: string;
  articles: string;
}

export interface PathRoute {
  path: string;
  children?: PathRoute[];
}

export const root = process.cwd();

export const resolve = (...paths: string[]) => path.resolve(root, ...paths);

export const routesPath = resolve('src/routes.tsx');

export const parseRoute = (path: string) => path.split(sep).pop()!.slice(0, -4);

export const generateRouteJSON = async () => {
  const paths = await fast.glob(['src/markdowns/**/*.mdx']);
  let articles = ',';
  let books = ',';

  paths
    .map((path) => resolve(path))
    .forEach((path) => {
      const route = parseRoute(path);
      const { attributes } = frontmatter<ArticleMeta>(
        readFileSync(path, 'utf-8')
      );

      const aliasPath = path
        .replace('src/markdowns', '@/markdowns')
        .replace(/\\/g, '/');

      const str = `
        {
          path: "${route}",
          element: () => import("${aliasPath}"),
          meta: ${JSON.stringify(attributes)}
        },
      `;

      if (attributes.book) {
        books += str;
      } else {
        articles += str;
      }
    });

  return { articles, books };
};

export const replacePlaceRoute = (
  code: string,
  { books, articles }: RoutePlace
) =>
  code
    .replace('/** placeholder for articles */', articles)
    .replace('/** placeholder for books */', books);

export function resolveFullPath(
  routes: PathRoute[],
  parent: string,
  result: string[]
) {
  routes.map(function map(route) {
    const seps = parent.split('/');
    seps.shift();

    if (route.path === 'index') {
      if (route.children?.length) {
        resolveFullPath(route.children, parent, result);
      }

      return route;
    }

    let fullPath = [...seps, route.path].join('/');
    !fullPath.startsWith('/') && (fullPath = '/' + fullPath);

    result.push(fullPath);

    if (route.children?.length) {
      resolveFullPath(route.children, fullPath, result);
    }

    return route;
  });

  return result;
}
