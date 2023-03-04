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
          children: 'structure'
        },
        {
          text: 'ES6',
          prefix: 'es6/',
          children: 'structure'
        }
      ]
    },
    {
      text: 'WebSite',
      prefix: 'website/',
      collapsible: true,
      children: 'structure'
    },
    {
      text: '开发',
      prefix: 'produce/',
      collapsible: true,
      children: 'structure'
    }
  ]
} as SidebarItem;
