import { generateRouteJSON, parseRouteName, replacePlaceRoute, resolve } from './utils';

import frontmatter from 'front-matter';
import { readFileSync } from 'fs';
import type { PluginOption } from 'vite';

export interface ArticleMeta {
  title: string;
  date: string;
  author: string;
  description: string;
  imageUrl: string;
  book?: boolean;
}

interface ParserOptions {
  name: string;
  paths: string[];
  importAlias(path: string): string;
}

interface RouteGeneratorOptions {
  /** route config path */
  routeConfig: string;
  routes: ParserOptions[];
}

function parseRoute(route: ParserOptions) {
  let routeStr = ',';

  route.paths
    .map((path) => resolve(path))
    .forEach((path) => {
      const routeName = parseRouteName(path);
      const { attributes } = frontmatter<ArticleMeta>(readFileSync(path, 'utf-8'));

      const aliasPath = route.importAlias(path);

      const str = `
        {
          path: "${routeName + '.html'}",
          element: () => import("${aliasPath}"),
          meta: ${JSON.stringify(attributes)}
        },
      `;

      routeStr += str;
    });

  return routeStr;
}

function parseRoutes(routes: ParserOptions[]) {
  return routes.map((route) => ({ name: route.name, value: parseRoute(route) }));
}

/**
 *
 * @description Generate routes from local directory
 */
function viteRouteGenerator(options: RouteGeneratorOptions): PluginOption {
  const { routeConfig, routes = [] } = options;

  return {
    name: 'vite-plugin-route-generator',
    enforce: 'pre',

    // configureServer(server) {
    //   server.watcher.add(resolve('./src/coder/Wrapper.tsx'));
    //   server.watcher.on('change', (id) => {
    //     if (resolve(id) === resolve('./src/coder/Wrapper.tsx')) {
    //       server.restart();
    //     }
    //   });
    // },

    async transform(code, id) {
      if (id.includes('node_modules')) return;

      if (routeConfig === resolve(id.split('?')[0])) {
        // const result = parseRoutes(routes).reduce(
        //   (prev, route) => replacePlaceRoute(prev, route.name),
        //   code
        // );

        // return replacePlaceRoute(result, 'coder');

        parseRoutes(routes);

        const json = await generateRouteJSON();
        const result = replacePlaceRoute(code, json);

        return result;
      }
    }
  };
}

export default viteRouteGenerator;
