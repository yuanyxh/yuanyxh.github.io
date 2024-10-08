import { submit } from './submit';
import type { ResolveRouteObject, RouteOptions } from './utils';
import type { Meta } from './utils';
import { resolve, resolveFullRoutes } from './utils';

import dayjs from 'dayjs';
import selfVitePrerender from 'vite-plugin-prerender';

export interface PostProcessParam {
  originalRoute: string;
  route: string;
  html: string;
  outputPath?: string;
}

const Renderer = selfVitePrerender.PuppeteerRenderer;

function getMetaTag(
  meta: Meta | undefined,
  route: ResolveRouteObject,
  siteConfig: RouteOptions['siteConfig']
) {
  let image = siteConfig.logo;
  let description = siteConfig.description;
  let title = siteConfig.title;
  let keywords = siteConfig.keywords;

  const domain = siteConfig.domain;
  const appName = siteConfig.appName;
  const authorPage = siteConfig.authorPage;
  const date = dayjs().toISOString();

  const url = `${domain}${route.fullPath.slice(1)}`;

  let html = `
    <link rel="canonical" href="${url}" />
    <link rel="author" href="${authorPage}" />
    <meta property="og:url" content="${url}">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="${domain}">
    <meta property="twitter:url" content="${url}">
  `;

  if (meta) {
    html += `<meta property="og:type" content="article" />
      <meta property="article" content="${url}" />
      <meta property="article:published_time" content="${meta.date}" />
      <meta property="article:author" content="${authorPage}" />
    `;

    meta.imageUrl && (image = meta.imageUrl);
    description = meta.description;
    title = `${meta.title} - ${appName}`;
    keywords = meta.keywords;
  } else {
    html += `<meta property="og:type" content="website" />`;
  }

  html += `
      <meta property="og:image" content="${image}">
      <meta property="og:description" content="${description}">
      <meta property="og:title" content="${title}">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${image}">
      <meta name="description" content="${description}">
      <meta name="keywords" content="${keywords}">

      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "${title}",
          "image": [
            "${image}"
          ],
          "datePublished": "${date}",
          "author": [{
              "@type": "Person",
              "name": "yuanyxh",
              "url": "${authorPage}"
            }]
        }
      </script>

      <title>${title}</title>
    `;

  return html;
}

async function vitePrerender(options: RouteOptions) {
  const {
    mode,
    siteConfig,
    getRoutes,
    prerenderConfig = {
      prerenderOutput: resolve('./build'),
      excludeOutPathRewrite: []
    }
  } = options;

  const { prerenderOutput, excludeOutPathRewrite } = prerenderConfig;

  if (mode !== 'prod') return void 0;

  const routes = await getRoutes.call(options);

  const detailsRoutes = resolveFullRoutes(routes, '', []);
  const allRoutes = detailsRoutes
    .filter((route) => (typeof route.meta !== 'undefined' ? !route.meta.draft : true))
    .map((route) => route.fullPath);

  try {
    await submit(allRoutes);
  } catch (err) {
    console.log('submit error: ', err);
  }

  // prerender route：https://www.npmjs.com/package/vite-plugin-prerender
  return selfVitePrerender({
    routes: allRoutes,
    staticDir: prerenderOutput,

    // compression
    minify: {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      decodeEntities: true,
      keepClosingSlash: true,
      sortAttributes: true
    },

    renderer: new Renderer({
      headless: true,
      renderAfterDocumentEvent: 'pageReadyed'
    }),

    postProcess(renderedRoute: PostProcessParam) {
      if (!excludeOutPathRewrite.includes(renderedRoute.originalRoute)) {
        renderedRoute.outputPath = 'build' + renderedRoute.originalRoute;
      }

      renderedRoute.html = renderedRoute.html.replace('<html lang="en"', '<html lang="zh-CN"');
      renderedRoute.html = renderedRoute.html.replace(/alignItems/g, 'align-items');

      const route = detailsRoutes.find((route) => route.fullPath === renderedRoute.originalRoute);
      if (route) {
        renderedRoute.html = renderedRoute.html.replace(
          '<!-- meta_place -->',
          getMetaTag(route.meta, route, siteConfig)
        );
      }

      return renderedRoute;
    }
  });
}

export default vitePrerender;
