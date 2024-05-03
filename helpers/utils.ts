import type { ArticleMeta } from './vite-route-generator';

import fast from 'fast-glob';
import frontmatter from 'front-matter';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { relative, sep } from 'node:path';
import path from 'path';
import { codeToHtml } from 'shiki';

interface RouteObject {
  path: string;
  children?: RouteObject[];
  meta?: ArticleMeta;
}

export interface ResolveRouteObject extends RouteObject {
  fullPath: string;
  children?: ResolveRouteObject[];
}

export interface RoutePlace {
  books: string;
  articles: string;
  examples: string;
}

export const root = process.cwd();

export const resolve = (...paths: string[]) => path.resolve(root, ...paths);

export const routesPath = resolve('src/routes.tsx');

export const parseRoute = (path: string) => path.split(sep).pop()!.slice(0, -4);

export const replaceFileExtension = (name: string) =>
  name.slice(0, name.lastIndexOf('.')) + '.tsx';

export const generateRouteJSONWithArticle = async () => {
  const paths = await fast.glob(['./src/markdowns/**/*.mdx']);
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
        .replace('./src/markdowns', '@/markdowns')
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

export const getExampleMeta = (path: string) => {
  const text = readFileSync(path, 'utf-8');

  const match = text
    .match(/(?<=\/\/--meta:)([\s\S]*)(?=\/\/--endmeta)/)?.[0]
    .trim();

  const arr = match!.replace(/\/\/\s/g, '').split(/[\n\r]/);

  const obj: { [key: string]: any } = {};
  for (let i = 0; i < arr.length; i++) {
    const j = arr[i].indexOf(':');
    obj[arr[i].slice(0, j).trim()] = arr[i].slice(j + 1).trim();
  }

  return { imageUrl: '', ...obj };
};

const template = readFileSync(resolve('./src/coder/Wrapper.tsx'), 'utf-8');
export const generateRouteJSONWithExample = async () => {
  let result = '';

  async function transform(
    dirs: string[],
    parent: string,
    hierarchy: number,
    root: string
  ) {
    if (hierarchy === 0) {
      const directory = resolve(parent, `code`);
      const value = template.replace('base64_coder/Index', `${root}/Index`);

      if (!existsSync(resolve(directory))) {
        mkdirSync(directory, { recursive: true });
      }

      writeFileSync(resolve(directory, '__.tsx'), value, 'utf-8');

      result += `{
        path: "${root}",
        element: () => import("@/examples/${root}/code/__.tsx"),
        meta: ${JSON.stringify(getExampleMeta(resolve(parent, 'Index.tsx')))},
        children: [
      `;
    }

    for (let i = 0; i < dirs.length; i++) {
      const name = dirs[i];
      const fullname = resolve(parent, name);

      if (hierarchy === 0 && name === 'code') {
        continue;
      }

      const isDirectory = lstatSync(fullname).isDirectory();

      if (isDirectory) {
        await transform(readdirSync(fullname), fullname, hierarchy + 1, root);
        continue;
      }

      const code = readFileSync(fullname, 'utf-8');

      // if (hierarchy === 0 && name === 'Index.tsx') {
      //   continue;
      // }

      const html = await codeToHtml(code, {
        lang: dirs[i].split('.').pop()!,
        theme: 'one-dark-pro'
      });

      const data = `export default function Default() {
        return <div dangerouslySetInnerHTML={{ __html: \`${html}\` }}></div>
      }`;

      const newName = replaceFileExtension(name);

      const paths = relative(resolve(examples, root), parent)
        .split(sep)
        .filter(Boolean);
      const folder = resolve(examples, root, 'code', ...paths);

      if (!existsSync(folder)) {
        mkdirSync(folder, { recursive: true });
      }

      writeFileSync(resolve(folder, newName), data, 'utf-8');

      const route =
        newName === 'Index.tsx'
          ? 'index'
          : paths.length
            ? paths.join('-') + '-' + newName
            : newName;

      result += `{
        path: '${route}',
        element: () => import('@/examples/${root}/code/${paths.length === 0 ? '' : paths.length > 1 ? paths.join('/') : paths[0] + '/'}${newName}')
      },
      `;
    }
  }

  const examples = resolve('./src/examples');
  const dirs = readdirSync(examples);

  for (let i = 0; i < dirs.length; i++) {
    await transform(
      readdirSync(resolve(examples, dirs[i])),
      resolve(examples, dirs[i]),
      0,
      dirs[i]
    );

    result += `]
    },`;
  }

  return { examples: result };
};

export const generateRouteJSON = async () => {
  return {
    ...(await generateRouteJSONWithArticle()),
    ...(await generateRouteJSONWithExample())
  };
};

export const replacePlaceRoute = (
  code: string,
  { books, articles, examples }: RoutePlace
) =>
  code
    .replace('/** placeholder for articles */', articles)
    .replace('/** placeholder for books */', books)
    .replace('/** placeholder for coder */', examples);

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
