import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import progress from 'vite-plugin-progress';
import ESLintPlugin from '@nabla/vite-plugin-eslint';
import PresetEnv from 'postcss-preset-env';
import AutoPrefixer from 'autoprefixer';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve, root } from './helpers/utils';
import mdx from '@mdx-js/rollup';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import remarkFrontMatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkBraks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import { remarkMdxToc } from 'remark-mdx-toc';
import rehypePrism from '@mapbox/rehype-prism';
import viteRouteGenerator from './helpers/vite-route-generator';
import vitePrerender from './helpers/vite-prerender';
import viteGenerateSitemap from './helpers/vite-generate-sitemap';
// import basicSsl from '@vitejs/plugin-basic-ssl';

import type { ConfigEnv, UserConfig } from 'vite';

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, root) as unknown as ImportMetaEnv;

  const isBuild = command === 'build';

  return defineConfig({
    root: root,
    base: env.VITE_BASE_PATH,
    plugins: [
      viteRouteGenerator(),
      vitePrerender(mode),
      viteGenerateSitemap(),

      /**
       * format
       * baseUrl
       * development
       * elementAttributeNameCase
       * jsx
       * jsxImportSource
       * jsxRuntime
       * mdExtensions
       * mdxExtensions
       * outputFormat
       * pragma
       * exclude
       * include
       * pragmaFrag
       * pragmaImportSource
       * providerImportSource
       * recmaPlugins
       * rehypePlugins
       * remarkPlugins
       * remarkRehypeOptions
       * stylePropertyNameCase
       * tableCellAlignToStyle
       */
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
      // basicSsl()
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
          find: /@\/examples\//,
          replacement: `${resolve('src/examples')}/`
        },
        {
          find: /@\/components\//,
          replacement: `${resolve('src/components')}/`
        },
        {
          find: /@\/filehandle\//,
          replacement: `${resolve('src/filehandle')}/`
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
      // https: {}
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
