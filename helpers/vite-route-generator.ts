import { generateRouteJSON, replacePlaceRoute, resolve, routesPath } from './utils';

import type { PluginOption } from 'vite';
import { createFilter } from 'vite';

export interface ArticleMeta {
  title: string;
  date: string;
  author: string;
  description: string;
  imageUrl: string;
  book?: boolean;
}

function viteRouteGenerator(): PluginOption {
  const filter = createFilter([/\.mdx$/]);

  return {
    name: 'vite-plugin-route-generator',
    enforce: 'pre',
    configureServer(server) {
      const listener = (id: string) => {
        if (!filter(id)) return;
        server.restart();
      };

      server.watcher.add('**/*.{mdx}');
      server.watcher.on('add', listener);
      server.watcher.on('unlink', listener);

      server.watcher.add(resolve('./src/coder/Wrapper.tsx'));
      server.watcher.on('change', (id) => {
        if (resolve(id) === resolve('./src/coder/Wrapper.tsx')) {
          server.restart();
        }
      });
    },
    async transform(code, id) {
      if (id.includes('node_modules')) return;

      if (resolve(routesPath) === resolve(id.split('?')[0])) {
        const json = await generateRouteJSON();
        const result = replacePlaceRoute(code, json);

        return result;
      }
    }
  };
}

export default viteRouteGenerator;
