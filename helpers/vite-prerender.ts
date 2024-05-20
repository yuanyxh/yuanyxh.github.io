import { submit } from './submit';
import type { ResolveRouteObject } from './utils';
import {
  generateRouteJSON,
  getEnv,
  replacePlaceRoute,
  resolve,
  resolveFullRoutes,
  routesPath
} from './utils';
import type { ArticleMeta } from './vite-route-generator';

import dayjs from 'dayjs';
import { readdirSync, readFileSync } from 'node:fs';
import selfVitePrerender from 'vite-plugin-prerender';

export interface PostProcessParam {
  originalRoute: string;
  route: string;
  html: string;
  outputPath?: string;
}

const Renderer = selfVitePrerender.PuppeteerRenderer;

const text = readFileSync(routesPath, 'utf-8');

const reg = /(?<=export const routes: RouteObject\[\] = \[)([\s\S]*)(?=\];)/;

const match = text.match(reg);

const excludeOutPathRewrite = ['/', '/articles', '/examples', '/books', '/coder', '/profile'];

function getMetaTag(meta: ArticleMeta | undefined, route: ResolveRouteObject) {
  const env = getEnv();

  let html = `
    <link rel="canonical" href="${env.VITE_DOMAIN_PATH}${route.fullPath.slice(1)}" />
    <link rel="author" href="${env.VITE_DOMAIN_PATH}profile/about_me.html" />
    <meta property="og:url" content="${env.VITE_DOMAIN_PATH}${route.fullPath.slice(1)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="yuanyxh.com">
    <meta property="twitter:url" content="${env.VITE_DOMAIN_PATH}">
  `;

  if (meta) {
    // TODO: route add keywords list?
    html += `
      <meta property="og:type" content="article" />
      <meta property="article" content="${env.VITE_DOMAIN_PATH}${route.fullPath.slice(1)}" />
      <meta property="article:published_time" content="${meta.date}" />
      <meta property="article:author" content="${env.VITE_DOMAIN_PATH}profile/about_me.html" />
      <meta property="og:image" content="${meta.imageUrl || env.VITE_DOMAIN_PATH + 'logo.webp'}">
      <meta property="og:description" content="${meta.description}">
      <meta property="og:title" content="${env.VITE_APP_TITLE}: ${meta.title}">
      <meta name="twitter:title" content="${env.VITE_APP_TITLE}: ${meta.title}">
      <meta name="twitter:description" content="${meta.description}">
      <meta name="twitter:image" content="${meta.imageUrl || env.VITE_DOMAIN_PATH + 'logo.webp'}">
      <meta name="description" content="${meta.description}">
      <meta name="keywords" content="yuanyxh, 文章, 代码示例, 在线操作">

      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "${meta.title}",
          "image": [
            "${meta.imageUrl || env.VITE_DOMAIN_PATH + 'logo.webp'}"
          ],
          "datePublished": "${dayjs(meta.date).toISOString()}",
          "author": [{
              "@type": "Person",
              "name": "yuanyxh",
              "url": "${env.VITE_DOMAIN_PATH}profile/about_me.html"
            }]
        }
      </script>

      <title>${env.VITE_APP_TITLE}: ${meta.title}</title>
    `;
  } else {
    html += `
      <meta property="og:type" content="website" />
      <meta property="og:description" content="技术博客，演示站，工具站；做一个有用的网站，拥有优秀的用户体验。站在巨人的肩膀上/If I have seen further than others, it is by standing upon the shoulders of giants.">
      <meta property="og:title" content="${env.VITE_APP_TITLE}">
      <meta name="description" content="技术博客，演示站，工具站；做一个有用的网站，拥有优秀的用户体验。站在巨人的肩膀上/If I have seen further than others, it is by standing upon the shoulders of giants.">
      <meta name="twitter:title" content="${env.VITE_APP_TITLE}">
      <meta name="twitter:description" content="技术博客，演示站，工具站；做一个有用的网站，拥有优秀的用户体验。站在巨人的肩膀上/If I have seen further than others, it is by standing upon the shoulders of giants.">
      <meta property="og:image" content="${env.VITE_DOMAIN_PATH}logo.webp">
      <meta name="twitter:image" content="${env.VITE_DOMAIN_PATH}logo.webp">
      <meta name="keywords" content="yuanyxh, 个人博客, 个人网站, 首页, web 前端, JavaScript, css, html">

      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "${env.VITE_APP_TITLE}",
          "image": [
            "${env.VITE_DOMAIN_PATH}logo.webp"
          ],
          "dateModified": "${dayjs().toISOString()}",
          "author": [{
              "@type": "Person",
              "name": "yuanyxh",
              "url": "${env.VITE_DOMAIN_PATH}profile/about_me.html"
            }]
        }
      </script>

      <title>${env.VITE_APP_TITLE}</title>
    `;
  }

  return html;
}

async function vitePrerender(mode: string) {
  if (mode !== 'prod') return void 0;

  if (!match) {
    throw Error('no match routes.');
  }

  const dirs = readdirSync(resolve('./src/examples'));

  for (let i = 0; i < dirs.length; i++) {
    excludeOutPathRewrite.push('/coder/' + dirs[i]);
  }

  const routeJSON = await generateRouteJSON();
  const getRoutes = new Function(`return ${replacePlaceRoute(`[${match[0]}]`, routeJSON)}`);

  const detailsRoutes = resolveFullRoutes(getRoutes(), '', []);
  const routes = detailsRoutes.map((route) => route.fullPath);

  try {
    submit(routes);
  } catch (err) {
    console.log('submit error', err);
  }

  // prerender route：https://www.npmjs.com/package/vite-plugin-prerender
  return selfVitePrerender({
    // 要渲染的路由
    routes: routes,
    staticDir: resolve('./build'),

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
      // renderAfterTime: 20000
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
          getMetaTag(route.meta, route)
        );
      }

      // <link rel="alternate" hreflang="en" href="https://developer.chrome.com/docs">
      // //<meta property="og:title" content="文档 &nbsp;|&nbsp; Docs &nbsp;|&nbsp; Chrome for Developers">, see https://ogp.me/
      // //<meta name="description" content="构建任何应用所需的代码示例、指南和 API 参考文档。">
      // //<meta property="og:description" content="构建任何应用所需的代码示例、指南和 API 参考文档。">
      // //<meta property="og:url" content="https://developer.chrome.com/docs?hl=zh-cn">
      // rel="tag"
      // rel="pingback"
      // //rel=”noopener”
      // //rel="manifest"
      // //rel="external"
      // //rel="bookmark"
      // //<link rel="author" />, see https://www.zhangxinxu.com/wordpress/2019/06/html-a-link-rel/#alternateRel
      // //<meta name="robots" content="noindex" />, see https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag?hl=zh-cn
      // //<link rel="canonical" href="https://developer.chrome.com/docs?hl=zh-cn" />, see https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=zh-cn
      // //<title>title: subtitle</title>

      return renderedRoute;
    }
  });
}

export default vitePrerender;
