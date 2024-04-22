import {
  generateRouteJSON,
  replacePlaceRoute,
  resolve,
  routesPath
} from './utils';

import { writeFileSync } from 'fs';
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
  const filter = createFilter([/\.[md|ts]x$/]);

  return {
    name: 'vite-plugin-route-generator',
    enforce: 'pre',
    configureServer(server) {
      const listener = (id: string) => {
        if (!filter(id)) return;
        server.restart();
      };

      server.watcher.add('**/*.{mdx}');
      server.watcher.add('/src/examples/*');
      // server.watcher.on('change', listener);
      server.watcher.on('add', listener);
      server.watcher.on('unlink', listener);
    },
    async transform(code, id) {
      if (id.includes('node_modules')) return;

      if (resolve(routesPath) === resolve(id.split('?')[0])) {
        const result = replacePlaceRoute(code, await generateRouteJSON());

        writeFileSync(resolve('./route.tsx'), result, 'utf-8');

        return result;
      }
    }
  };
}

export default viteRouteGenerator;
