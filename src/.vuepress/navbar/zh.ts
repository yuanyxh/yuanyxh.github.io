import { navbar } from 'vuepress-theme-hope';
import book from './config/book';

export const zhNavbar = navbar([
  '/',
  {
    text: '博文',
    icon: 'article',
    link: '/note'
  },
  {
    text: '书籍',
    icon: 'blog',
    prefix: '/books/',
    children: book
  },
  {
    text: '关于',
    icon: 'info',
    link: '/intro'
  }
]);
