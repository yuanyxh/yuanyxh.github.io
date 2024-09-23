import { parseRoutes, replacePlaceRoute, resolve, RouteOptions } from './utils';

import { writeFileSync } from 'node:fs';
import type { PluginOption } from 'vite';

/**
 *
 * @description Generate routes from local directory
 */
function viteRouteGenerator(options: RouteOptions): PluginOption {
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
        const result = (await parseRoutes(routes)).reduce(
          (prev, route) => replacePlaceRoute(prev, route.name, route.value),
          code
        );

        return result;
      }
    }
  };
}

export default viteRouteGenerator;
