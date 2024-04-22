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
            path: 'about_me',
            element: () => import('@/viewer/AboutMe')
          },
          {
            path: 'about_site',
            element: () => import('@/viewer/AboutSite')
          }
        ]
      },
      {
        path: 'examples',
        element: () => import('@/viewer/Examples')
      }
    ]
  },
  {
    path: '/coder',
    element: () => import('@/coder/Layout'),
    children: [
      /** placeholder for coder */
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
