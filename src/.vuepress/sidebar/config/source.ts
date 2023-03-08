import type { SidebarItem } from 'vuepress-theme-hope';

export default {
  text: '源码',
  prefix: 'source/',
  icon: 'code',
  children: [
    {
      text: 'axios',
      prefix: 'axios/',
      collapsible: true,
      children: 'structure'
    }
  ]
} as SidebarItem;
