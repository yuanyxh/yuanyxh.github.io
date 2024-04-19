import {
  generateRouteJSON,
  replacePlaceRoute,
  resolve,
  resolveFullPath,
  routesPath
} from './utils';

import { readFileSync } from 'node:fs';
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

const excludeOutPathRewrite = [
  '/',
  '/articles',
  '/books',
  '/coder',
  '/profile'
];

const match = text.match(reg);

async function vitePrerender() {
  if (!match) {
    throw Error('no match routes.');
  }

  const getRoutes = new Function(
    `return ${replacePlaceRoute(`[${match[0]}]`, await generateRouteJSON())}`
  );

  const routes = resolveFullPath(getRoutes(), '', []);

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
    }),

    postProcess(renderedRoute: PostProcessParam) {
      if (!excludeOutPathRewrite.includes(renderedRoute.originalRoute)) {
        renderedRoute.outputPath = 'build' + renderedRoute.originalRoute;
      }

      renderedRoute.html = renderedRoute.html.replace(
        /alignItems/g,
        'align-items'
      );

      // <link rel="alternate" hreflang="en" href="https://developer.chrome.com/docs">
      // <meta property="og:title" content="文档 &nbsp;|&nbsp; Docs &nbsp;|&nbsp; Chrome for Developers">, see https://ogp.me/
      // <meta name="description" content="构建任何应用所需的代码示例、指南和 API 参考文档。">
      // <meta property="og:description" content="构建任何应用所需的代码示例、指南和 API 参考文档。">
      // <meta property="og:url" content="https://developer.chrome.com/docs?hl=zh-cn">
      // rel="tag"
      // rel="pingback"
      // rel=”noopener”
      // rel="manifest"
      // rel="external"
      // rel="bookmar"
      // <link rel="author" />, see https://www.zhangxinxu.com/wordpress/2019/06/html-a-link-rel/#alternateRel
      // <meta name="robots" content="noindex" />, see https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag?hl=zh-cn
      // <link rel="canonical" href="https://developer.chrome.com/docs?hl=zh-cn" />, see https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=zh-cn
      // <title>title: subtitle</title>

      return renderedRoute;
    }
  });
}

export default vitePrerender;
