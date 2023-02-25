import { sidebar } from 'vuepress-theme-hope';
import note from './config/note';
import book from './config/book';
import skill from './config/skill';

export const zhSidebar = sidebar({
  '/': ['', note, book, skill, 'intro']
});
