import {
  generateRouteJSON,
  replacePlaceRoute,
  resolve,
  resolveFullRoutes,
  ResolveRouteObject,
  root,
  routesPath
} from './utils';
import { ArticleMeta } from './vite-route-generator';

import { readdirSync, readFileSync } from 'node:fs';
import { loadEnv } from 'vite';
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

const excludeOutPathRewrite = [
  '/',
  '/articles',
  '/books',
  '/coder',
  '/profile'
];

function getMetaTag(meta: ArticleMeta | undefined, route: ResolveRouteObject) {
  const env = loadEnv('prod', root);

  let html = `
    <link rel="canonical" href="https://yuanyxh.com/" />
    <link rel="author" href="https://yuanyxh.com/profile/about_me" />
    <link rel="manifest" href="/manifest.json">
    <meta property="og:url" content="https://yuanyxh.com${route.fullPath}">
  `;

  if (meta) {
    html += `
      <meta property="og:type" content="article" />
      <meta property="article" content="https://yuanyxh.com${route.fullPath}" />
      <meta property="article:published_time" content="${meta.date}" />
      <meta property="article:author" content="https://yuanyxh.com/profile/about_me" />
      <meta property="og:image" content="${meta.imageUrl}">
      <meta property="og:description" content="${meta.description}">
      <meta property="og:title" content="${env.VITE_APP_TITLE}: ${meta.title}">
      <meta name="description" content="${meta.description}">
      <title>${env.VITE_APP_TITLE}: ${meta.title}</title>
    `;
  } else {
    html += `
      <meta property="og:type" content="website" />
      <meta property="og:description" content="技术博客，演示站，工具站；做一个有用的网站，拥有优秀的用户体验。">
      <meta property="og:title" content="${env.VITE_APP_TITLE}">
      <meta name="description" content="技术博客，演示站，工具站；做一个有用的网站，拥有优秀的用户体验。">
      <title>${env.VITE_APP_TITLE}</title>
    `;
  }

  return html;
}

async function vitePrerender() {
  if (!match) {
    throw Error('no match routes.');
  }

  const dirs = readdirSync(resolve('./src/examples'));

  for (let i = 0; i < dirs.length; i++) {
    excludeOutPathRewrite.push('/coder/' + dirs[i]);
  }

  const routeJSON = await generateRouteJSON();
  const getRoutes = new Function(
    `return ${replacePlaceRoute(`[${match[0]}]`, routeJSON)}`
  );

  const detailsRoutes = resolveFullRoutes(getRoutes(), '', []);
  const routes = detailsRoutes.map((route) => route.fullPath);

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

      renderedRoute.html = renderedRoute.html.replace(
        /alignItems/g,
        'align-items'
      );

      const route = detailsRoutes.find(
        (route) => route.fullPath === renderedRoute.originalRoute
      );
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
