import { SidebarItem } from 'vuepress-theme-hope';

export default {
  text: '书籍',
  icon: 'blog',
  prefix: '/books',
  children: [
    {
      text: '前端',
      prefix: 'web/',
      collapsible: true,
      children: [
        {
          text: 'JavaScript 高级程序设计',
          link: 'JavaScript 高级程序设计'
        }
      ]
    }
  ]
} as SidebarItem;
