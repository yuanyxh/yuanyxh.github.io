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
      headless: false,
      renderAfterTime: 5000
    }),

    postProcess(renderedRoute: PostProcessParam) {
      if (!excludeOutPathRewrite.includes(renderedRoute.originalRoute)) {
        renderedRoute.outputPath = 'build' + renderedRoute.originalRoute;
      }

      return renderedRoute;
    }
  });
}

export default vitePrerender;
