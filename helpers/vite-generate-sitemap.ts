import { getEnv, resolve, resolveFullRoutes, RouteOptions } from './utils';

import { writeFileSync } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import type { PluginOption } from 'vite';

function viteGenerateSitemap(options: RouteOptions): PluginOption {
  const { getRoutes, sitemapConfig = { output: resolve('./build/sitemap.xml') } } = options;

  const { output } = sitemapConfig;

  async function generateSitemap() {
    const routes = await getRoutes.call(options);

    const detailsRoutes = resolveFullRoutes(routes, '', []);

    const links = detailsRoutes.map((route) => {
      const link: { url: string; changefreq: string; priority: number; lastmod?: string } = {
        url: route.fullPath,
        changefreq: 'daily',
        priority: 1.0
      };

      if (route.meta?.date) {
        link.lastmod = route.meta.date.split(' ')[0];
      }

      return link;
    });

    const smStream = new SitemapStream({ hostname: getEnv().VITE_DOMAIN_PATH });

    return streamToPromise(Readable.from(links).pipe(smStream)).then((data) =>
      writeFileSync(output, data.toString(), 'utf-8')
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
