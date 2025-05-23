import type { RouteOptions } from './helpers/utils';
import { getEnv, parseRoutes, replacePlaceRoute, resolve, root } from './helpers/utils';
import viteGenerateSitemap from './helpers/vite-generate-sitemap';
import vitePrerender from './helpers/vite-prerender';
import viteRouteGenerator from './helpers/vite-route-generator';

import rehypePrism from '@mapbox/rehype-prism';
import mdx from '@mdx-js/rollup';
import ESLintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react';
import AutoPrefixer from 'autoprefixer';
import fast from 'fast-glob';
import { readFileSync } from 'fs';
import PresetEnv from 'postcss-preset-env';
import remarkBraks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import remarkFrontMatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { remarkMdxToc } from 'remark-mdx-toc';
import { visualizer } from 'rollup-plugin-visualizer';
import type { ConfigEnv, PluginOption, UserConfig } from 'vite';
import { createFilter, defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import progress from 'vite-plugin-progress';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

const routesPath = resolve('src/routes.tsx');

function mergeUserPlugin(options: RouteOptions): PluginOption[] {
  return [viteRouteGenerator(options), vitePrerender(options), viteGenerateSitemap(options)];
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const env = getEnv();

  const isBuild = command === 'build';

  const filterMDX = createFilter([/\.mdx$/]);

  return defineConfig({
    root: root,
    base: env.VITE_BASE_PATH,
    plugins: [
      mergeUserPlugin({
        mode: mode,
        siteConfig: {
          appName: env.VITE_APP_TITLE,
          domain: 'https://yuanyxh.com',
          title: env.VITE_APP_TITLE,
          description:
            '技术博客，演示站，工具站；做一个有用的网站，拥有优秀的用户体验。站在巨人的肩膀上/If I have seen further than others, it is by standing upon the shoulders of giants.',
          logo: env.VITE_DOMAIN_PATH + 'logo.webp',
          authorPage: `${env.VITE_DOMAIN_PATH}profile/about_me.html`,
          keywords: 'yuanyxh, 个人博客, 个人网站, 首页, web 前端, JavaScript, css, html'
        },
        async getRoutes() {
          const routeConfigCode = (await parseRoutes(this.buildRouteConfig.routes)).reduce(
            (prev, route) => replacePlaceRoute(prev, route.name, route.value),
            readFileSync(routesPath, 'utf-8')
          );

          const reg = /(?<=export const routes: RouteObject\[\] = \[)([\s\S]*)(?=\];)/;

          const match = routeConfigCode.match(reg);

          const getRoutes = new Function(`return [${match![0]}]`);

          return getRoutes();
        },
        sitemapConfig: {
          output: resolve('./build/sitemap.xml')
        },
        prerenderConfig: {
          excludeOutPathRewrite: ['/', '/articles', '/books', '/profile'],
          prerenderOutput: resolve('./build')
        },
        buildRouteConfig: {
          routeConfig: routesPath,
          routes: [
            {
              name: 'articles',
              paths: fast.globSync([
                './src/markdowns/articles/**/*.mdx',
                './src/markdowns/source/**/*.mdx'
              ]),
              transform(code) {
                return ',' + code;
              },
              importAlias(path) {
                return path.replace('./src/markdowns', '@/markdowns').replace(/\\/g, '/');
              }
            },
            {
              name: 'books',
              paths: fast.globSync(['./src/markdowns/books/**/*.mdx']),
              transform(code) {
                return ',' + code;
              },
              importAlias(path) {
                return path.replace('./src/markdowns', '@/markdowns').replace(/\\/g, '/');
              }
            }
          ]
        }
      }),

      {
        name: 'vite-plugin-mdx-insert',
        enforce: 'pre',
        transform(code, id, _options) {
          if (id.includes('node_modules')) return;

          // insert toc component
          if (filterMDX(id)) {
            const matchs = code.match(/(?<=---)[\w\W]*?(?=---)/);

            if (matchs) {
              const match = matchs[0];

              const metaLength = 6 + match.length;

              const result = `${code.slice(0, metaLength)}\n\n<Header frontmatter={frontmatter} />\n<Toc toc={toc} />${code.slice(metaLength)}`;

              return result;
            }
          }
        }
      },

      // @ts-expect-error this is normal, it's just a mismatch in the type definitions
      {
        enforce: 'pre',
        ...mdx({
          remarkPlugins: [
            [remarkFrontMatter, 'yaml'],
            remarkBraks,
            remarkEmoji,
            remarkMdxFrontmatter,
            remarkGfm,
            // @ts-expect-error this is normal, it's just a mismatch in the type definitions
            remarkMdxToc
          ],
          rehypePlugins: [
            // @ts-expect-error this is normal, it's just a mismatch in the type definitions
            [rehypePrism, { ignoreMissing: true, alias: { shell: 'sh' } }]
          ],
          providerImportSource: '@/viewer/Provider.tsx'
        })
      },

      react(),

      progress(),

      ESLintPlugin(),

      ViteEjsPlugin({
        title: env.VITE_APP_TITLE
      }),

      createSvgIconsPlugin({
        iconDirs: [resolve('./src/assets/svgs')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: true
      })
    ],
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: `${resolve('src')}/`
        },
        {
          find: /@\/assets\//,
          replacement: `${resolve('src/assets')}/`
        },
        {
          find: /@\/router\//,
          replacement: `${resolve('src/router')}/`
        },
        {
          find: /@\/store\//,
          replacement: `${resolve('src/store')}/`
        },
        {
          find: /@\/hooks\//,
          replacement: `${resolve('src/hooks')}/`
        },
        {
          find: /@\/utils\//,
          replacement: `${resolve('src/utils')}/`
        },
        {
          find: /@\/markdowns\//,
          replacement: `${resolve('src/markdowns')}/`
        },
        {
          find: /@\/tools\//,
          replacement: `${resolve('src/tools')}/`
        },
        {
          find: /@\/components\//,
          replacement: `${resolve('src/components')}/`
        },
        {
          find: /@\/filehandle\//,
          replacement: `${resolve('src/filehandle')}/`
        },
        {
          find: /@\/enum\//,
          replacement: `${resolve('src/enum')}/`
        }
      ]
    },
    css: {
      postcss: {
        plugins: [AutoPrefixer(), PresetEnv()]
      },
      preprocessorOptions: {
        less: {
          additionalData: '@plugin "./helpers/less-plugin";',
          javascriptEnabled: true
        }
      }
    },
    esbuild: {
      pure: isBuild ? ['console.log'] : [],
      drop: isBuild ? ['debugger'] : []
    },
    build: {
      target: 'es2015',
      outDir: 'build',
      sourcemap: isBuild === false,
      rollupOptions: {
        // @ts-expect-error this is normal, it's just a mismatch in the type definitions
        plugins: isBuild ? [visualizer({ filename: '.analyze.html', open: false })] : [],
        output: {}
      },
      cssCodeSplit: true
    },
    server: {
      host: 'localhost',
      port: 3000,
      strictPort: true,
      cors: true,
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/\/api/, 'issues')
        }
      }
    },
    preview: {
      host: 'localhost',
      port: 8080,
      strictPort: true,
      open: true
    },
    optimizeDeps: {
      include: [],
      exclude: []
    }
  });
};
