import { defineUserConfig } from 'vuepress';
import { searchPlugin } from '@vuepress/plugin-search';
import theme from './theme.js';

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

  shouldPrefetch: false,

  plugins: [searchPlugin({})]
});
