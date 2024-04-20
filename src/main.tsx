import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'normalize.css';
import 'nprogress/nprogress.css';
import 'virtual:svg-icons-register';

import { RouterProvider } from '@/router';

import App from './App.tsx';
import router from './routes.tsx';

window.document.dispatchEvent(new Event('pageReadyed'));

const node = (
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>
);

createRoot(document.getElementById('root')!).render(node);
