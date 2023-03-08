import { sidebar } from 'vuepress-theme-hope';
import note from './config/note';
import book from './config/book';
import skill from './config/skill';
import source from './config/source';

export const zhSidebar = sidebar({
  '/': ['', note, book, source, skill, 'intro']
});
