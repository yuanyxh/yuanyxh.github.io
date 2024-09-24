import { parseRoutes, replacePlaceRoute, resolve, RouteOptions } from './utils';

import type { PluginOption } from 'vite';

/**
 *
 * @description Generate routes from local directory
 */
function viteRouteGenerator(options: RouteOptions): PluginOption {
  const { buildRouteConfig = { routeConfig: '', routes: [] } } = options;

  const { routeConfig, routes } = buildRouteConfig;

  return {
    name: 'vite-plugin-route-generator',
    enforce: 'pre',

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
