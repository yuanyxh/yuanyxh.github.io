import { generateSW } from 'workbox-build';

generateSW({
  swDest: './build/sw.js',
  globDirectory: './build',
  globPatterns: ['**/*.{js,css,html,json}', 'articles/**', 'books/**', 'profile/**'],
  directoryIndex: 'index.html',
  navigateFallbackDenylist: [/illustrate|sitemap.xml|robots.txt/],
  /**
   * TIPS:
   *  For the /articles route, our file path is /articles/index.html,
   *  which causes the workbox to fail to match, and we fall back to /index.html
   * */
  navigateFallback: '/index.html',
  /**
   * TIPS:
   *  Do not specify a list of allowed fallbacks to be able to reach a custom 404
   * */
  // navigateFallbackAllowlist: [
  //   /\/articles$/,
  //   /\/books$/,
  //   /\/profile$/
  // ],
  babelPresetEnvTargets: [
    'Chrome >= 87',
    'Firefox >= 78',
    'Safari >= 14',
    'Edge >= 88',
    'Opera >= 80',
    'defaults and fully supports es6-module'
  ],
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  mode: 'production',
  runtimeCaching: [
    {
      handler: 'NetworkOnly',
      urlPattern: (option) =>
        ['/illustrate', '/sitemap.xml'].some((item) => option.url.pathname.includes(item)),
      options: {}
    },
    {
      handler: 'CacheFirst',
      urlPattern: (options) => options.request.destination === 'font',
      options: {
        cacheName: 'fontCache',
        expiration: {
          /** maximum cache 3 months */
          maxAgeSeconds: 3 * 30 * 24 * 60 * 60
        }
      }
    },
    {
      handler: 'CacheFirst',
      urlPattern: (options) => options.request.destination === 'image',
      options: {
        cacheName: 'imageCache',
        expiration: {
          /** maximum cache 3 months */
          // maxAgeSeconds: 3 * 30 * 24 * 60 * 60
          maxAgeSeconds: 7 * 24 * 60 * 60
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ],
  sourcemap: false
});
