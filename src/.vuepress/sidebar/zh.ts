import { sidebar } from 'vuepress-theme-hope';
import note from './config/note';
import book from './config/book';

export const zhSidebar = sidebar({
  '/': ['', note, book, 'intro'],
});
