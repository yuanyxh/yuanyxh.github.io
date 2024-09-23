import {
  getEnv,
  parseRoutes,
  replacePlaceRoute,
  resolve,
  resolveFullRoutes,
  RouteOptions
} from './utils';

import { readFileSync, writeFileSync } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import type { PluginOption } from 'vite';

const reg = /(?<=export const routes: RouteObject\[\] = \[)([\s\S]*)(?=\];)/;

function viteGenerateSitemap(options: RouteOptions): PluginOption {
  const { routeConfig, routes = [] } = options;

  const routesString = readFileSync(routeConfig, 'utf-8');

  async function generateSitemap() {
    const resolveRoutesString = (await parseRoutes(routes)).reduce(
      (prev, route) => replacePlaceRoute(prev, route.name, route.value),
      routesString
    );

    const match = resolveRoutesString.match(reg);

    if (!match) {
      throw Error('no match routes.');
    }

    const getRoutes = new Function(`return [${match[0]}]`);

    const detailsRoutes = resolveFullRoutes(getRoutes(), '', []);

    const links = detailsRoutes.map((route) => {
      if (route.meta) {
        return {
          url: route.fullPath,
          changefreq: 'daily',
          lastmod: route.meta.date.split(' ')[0],
          priority: 1.0
        };
      }

      return {
        url: route.fullPath,
        changefreq: 'daily',
        priority: 1.0
      };
    });

    const smStream = new SitemapStream({ hostname: getEnv().VITE_DOMAIN_PATH });

    return streamToPromise(Readable.from(links).pipe(smStream)).then((data) =>
      writeFileSync(resolve('./build/sitemap.xml'), data.toString(), 'utf-8')
    );
  }

  return {
    name: 'vite-plugin-sitemap',
    apply: 'build',
    enforce: 'post',
    closeBundle: {
      sequential: true,
      async handler() {
        return generateSitemap();
      }
    },
    transformIndexHtml() {
      return [
        {
          tag: 'link',
          injectTo: 'head',
          attrs: {
            rel: 'sitemap',
            type: 'application/xml',
            title: 'Sitemap',
            href: '/sitemap.xml'
          }
        }
      ];
    }
  };
}

export default viteGenerateSitemap;
