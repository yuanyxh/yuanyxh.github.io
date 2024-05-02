import {
  generateRouteJSON,
  replacePlaceRoute,
  resolve,
  resolveFullRoutes,
  routesPath
} from './utils';

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import type { PluginOption } from 'vite';

const text = readFileSync(routesPath, 'utf-8');

const reg = /(?<=export const routes: RouteObject\[\] = \[)([\s\S]*)(?=\];)/;

const match = text.match(reg);

function viteGenerateSitemap(): PluginOption {
  async function generateSitemap() {
    if (!match) {
      throw Error('no match routes.');
    }

    console.error(readdirSync(resolve()));

    const routeJSON = await generateRouteJSON();
    const getRoutes = new Function(
      `return ${replacePlaceRoute(`[${match[0]}]`, routeJSON)}`
    );

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
        priority: route.fullPath === '/' ? 1.0 : 0.8
      };
    });

    const smStream = new SitemapStream({ hostname: 'https://yuanyxh.com/' });

    return streamToPromise(Readable.from(links).pipe(smStream)).then((data) =>
      writeFileSync(resolve('./build/sitemap.xml'), data.toString(), 'utf-8')
    );
  }

  return {
    name: 'vite-plugin-sitemap',
    apply: 'build',
    enforce: 'post',
    async closeBundle() {
      return generateSitemap();
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
