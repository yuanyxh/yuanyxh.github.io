import { generateRouteJSON, getEnv, replacePlaceRoute, resolve, resolveFullRoutes } from './utils';

import { readFileSync, writeFileSync } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import type { PluginOption } from 'vite';

interface GenerateSitemapOptions {
  routeConfig: string;
}

const reg = /(?<=export const routes: RouteObject\[\] = \[)([\s\S]*)(?=\];)/;

function viteGenerateSitemap(options: GenerateSitemapOptions): PluginOption {
  const { routeConfig } = options;

  const text = readFileSync(routeConfig, 'utf-8');

  const match = text.match(reg);

  async function generateSitemap() {
    if (!match) {
      throw Error('no match routes.');
    }

    const routeJSON = await generateRouteJSON();
    const getRoutes = new Function(`return ${replacePlaceRoute(`[${match[0]}]`, routeJSON)}`);

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
