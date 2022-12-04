import { SidebarItem } from 'vuepress-theme-hope';

export default {
  text: '文章',
  icon: 'note',
  prefix: 'posts/',
  children: [
    {
      text: 'JavaScript',
      prefix: 'javascript/',
      collapsible: true,
      children: [
        {
          text: '概念',
          prefix: '概念/',
          collapsible: true,
          children: 'structure',
        },
        {
          text: 'ES6',
          prefix: 'es6/',
          collapsible: true,
          children: 'structure',
        },
      ],
    },
    {
      text: 'WebSite',
      prefix: 'website/',
      collapsible: true,
      children: 'structure',
    },
  ],
} as SidebarItem;
