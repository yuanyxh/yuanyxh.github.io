import {
  generateRouteJSON,
  replacePlaceRoute,
  resolveFullRoutes,
  routesPath
} from './utils';

import { readFileSync } from 'fs';
import viteSitemap from 'vite-plugin-sitemap';

const text = readFileSync(routesPath, 'utf-8');

const reg = /(?<=export const routes: RouteObject\[\] = \[)([\s\S]*)(?=\];)/;

const match = text.match(reg);

async function viteGenerateSitemap() {
  if (!match) {
    throw Error('no match routes.');
  }

  const routeJSON = await generateRouteJSON();
  const getRoutes = new Function(
    `return ${replacePlaceRoute(`[${match[0]}]`, routeJSON)}`
  );

  const detailsRoutes = resolveFullRoutes(getRoutes(), '', []);
  const routes = detailsRoutes.map((route) => route.fullPath);

  return viteSitemap({
    hostname: 'https://yuanyxh.com/',
    dynamicRoutes: routes,
    outDir: 'build',
    extensions: ['html', 'xml'],
    generateRobotsTxt: false
  });
}

export default viteGenerateSitemap;
