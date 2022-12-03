import { navbar } from 'vuepress-theme-hope';

export const zhNavbar = navbar([
  '/',
  {
    text: '博文',
    prefix: '/category/',
    children: [
      {
        text: 'JavaScript',
        link: 'javascript',
      },
      {
        text: '站点建设',
        link: '站点建设',
      },
    ],
  },
  {
    text: '关于',
    icon: 'info',
    link: '/intro',
  },
]);
