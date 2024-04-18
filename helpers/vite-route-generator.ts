import { resolve } from './utils';

import fast from 'fast-glob';
import frontmatter from 'front-matter';
import { readFileSync } from 'node:fs';
import { sep } from 'node:path';
import type { PluginOption } from 'vite';
import { createFilter } from 'vite';

interface ArticleMeta {
  title: string;
  date: string;
  author: string;
  description: string;
  imageUrl: string;
  book?: boolean;
}

const routesPath = resolve('src/routes.tsx');

const parseRoute = (path: string) => {
  return path.split(sep).pop()!.slice(0, -4);
};

function ViteRouteGenerator(): PluginOption {
  const filter = createFilter([/\.mdx$/]);

  const generateRouteJSON = async () => {
    const paths = await fast.glob(['src/markdowns/**/*.mdx']);
    let articles = ',';
    let books = ',';

    paths.map(resolve).forEach((path) => {
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

  return {
    name: 'vite-plugin-route-generator',
    enforce: 'pre',
    configureServer(server) {
      const listener = (id: string) => {
        if (!filter(id)) return;
        server.restart();
      };

      server.watcher.add('**/*.{mdx}');
      // server.watcher.on('change', listener);
      server.watcher.on('add', listener);
      server.watcher.on('unlink', listener);
    },
    async transform(code, id) {
      if (id.includes('node_modules')) return;

      if (resolve(routesPath) === resolve(id.split('?')[0])) {
        const { articles, books } = await generateRouteJSON();

        return code
          .replace('/** placeholder for articles */', articles)
          .replace('/** placeholder for books */', books);
      }
    }
  };
}

export default ViteRouteGenerator;
