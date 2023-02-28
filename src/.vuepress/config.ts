import { defineUserConfig } from 'vuepress';
import { getDirname, path } from '@vuepress/utils';
import { searchPlugin } from '@vuepress/plugin-search';
import theme from './theme.js';

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: '/',

  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'yuanyxh - 学习与沉淀',
      description: 'yuanyxh の blog'
    }
    // "/zh/": {
    //   lang: "zh-CN",
    //   title: "博客演示",
    //   description: "vuepress-theme-hope 的博客演示",
    // },
  },

  theme,

  alias: {
    '@Recommended': path.resolve(__dirname, 'components/recommended.vue'),
    '@Image': path.resolve(__dirname, 'components/Image.vue')
  },

  shouldPrefetch: false,

  plugins: [searchPlugin({})]
});
