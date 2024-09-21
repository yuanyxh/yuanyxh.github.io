import NProgress from 'nprogress';

import type { RouteObject } from '@/router';
import { createRouter } from '@/router';

import { sleep } from '@/utils';

import { Articles_ID } from './viewer/hooks/useArticles';
import { Books_ID } from './viewer/hooks/useBooks';
import { Examples_ID } from './viewer/hooks/useExamples';

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
        id: Articles_ID,
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
        id: Books_ID,
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
        path: 'examples',
        element: () => import('@/viewer/Examples')
      },
      {
        id: Examples_ID,
        path: 'coder',
        element: () => import('@/coder/Layout'),
        children: [
          /** placeholder for coder */
        ]
      },
      {
        path: 'tools',
        element: () => import('@/viewer/Tools'),
        children: [
          /** placeholder for tools */
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

router.afterEnter(() => {
  resetProgressBar();
});

export const resetProgressBar = () => {
  NProgress.done();

  clear && clear();
  clear = null;
};

export default router;
