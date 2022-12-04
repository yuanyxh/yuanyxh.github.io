import { navbar } from 'vuepress-theme-hope';
import book from './config/book';

export const zhNavbar = navbar([
  '/',
  {
    text: '博文',
    icon: 'article',
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
    text: '书籍',
    icon: 'blog',
    prefix: '/书籍/',
    children: book,
  },
  {
    text: '关于',
    icon: 'info',
    link: '/intro',
  },
]);
