import NProgress from 'nprogress';

import type { RouteObject } from '@/router';
import { createRouter } from '@/router';

import { sleep } from '@/utils';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: () => import('@/viewer/Layout'),
    children: [
      {
        path: 'index',
        element: () => import('@/viewer/Index')
      },
      {
        id: 'Articles',
        path: 'articles',
        children: [
          {
            path: 'index',
            element: () => import('@/viewer/Articles')
          }
          /** placeholder for articles */
        ]
      },
      {
        id: 'Books',
        path: 'books',
        children: [
          {
            path: 'index',
            element: () => import('@/viewer/Books')
          }
          /** placeholder for books */
        ]
      },
      {
        path: 'profile',
        element: () => import('@/viewer/ProfileLayout'),
        children: [
          {
            path: 'index',
            element: () => import('@/viewer/Settings')
          },
          {
            path: 'about_me.html',
            element: () => import('@/viewer/AboutMe')
          },
          {
            path: 'about_site.html',
            element: () => import('@/viewer/AboutSite')
          }
        ]
      },
      {
        path: '404.html',
        element: '不存在的页面'
      }
    ]
  }
];

const router = createRouter(routes);

let clear: (() => void) | null = null;
router.beforeEnter(() => {
  clear = sleep(200, () => NProgress.start());
});

const appTitle = import.meta.env.VITE_APP_TITLE;
router.afterEnter((_from, to) => {
  resetProgressBar();
  window.document.title = to.meta?.title ? `${to.meta.title} - ${appTitle}` : appTitle;
});

export const resetProgressBar = () => {
  NProgress.done();

  clear && clear();
  clear = null;
};

export default router;
