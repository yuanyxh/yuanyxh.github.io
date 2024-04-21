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
      }
    ]
  },
  {
    path: '/coder',
    element: () => import('@/coder/Layout'),
    children: [
      {
        path: 'index',
        element: () => import('@/coder/Cases')
      },
      {
        path: 'base64_coder',
        element: () => import('@/examples/base64_coder/Index'),
        meta: {
          title: 'base64 编解码',
          date: '2024-4-21 16:54:00',
          author: 'yuanyxh',
          description: 'js 实现的 base64 示例，帮助理解 base64 是如何工作的',
          imageUrl: ''
        },
        children: [
          {
            path: 'utils-base64.ts',
            element: () => import('@/examples/base64_coder/code/base64')
          },
          {
            path: 'Index.module.tsx',
            element: () => import('@/examples/base64_coder/code/Index.module')
          },
          {
            path: 'index',
            element: () => import('@/examples/base64_coder/code/Index')
          }
        ]
      }
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
