import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'normalize.css';
import 'nprogress/nprogress.css';
import 'virtual:svg-icons-register';

import { RouterProvider } from '@/router';

import App from './App.tsx';
import router from './routes.tsx';

/** Home To Do List */
export const SLOGAN = '读 《Webpack 实战：入门、进阶与调优》';

const node = (
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>
);

const root = createRoot(document.getElementById('root')!);
root.render(node);
