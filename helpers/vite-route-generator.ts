import { generateRouteJSON, replacePlaceRoute, resolve } from './utils';

import type { PluginOption } from 'vite';

export interface ArticleMeta {
  title: string;
  date: string;
  author: string;
  description: string;
  imageUrl: string;
  book?: boolean;
}

interface RouteGeneratorOptions {
  /** route config path */
  routeConfig: string;
}

/**
 *
 * @description Generate routes from local directory
 */
function viteRouteGenerator(options: RouteGeneratorOptions): PluginOption {
  const { routeConfig } = options;

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
        const json = await generateRouteJSON();
        const result = replacePlaceRoute(code, json);

        return result;
      }
    }
  };
}

export default viteRouteGenerator;
