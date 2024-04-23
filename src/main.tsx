import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'normalize.css';
import 'nprogress/nprogress.css';
import 'virtual:svg-icons-register';

import { RouterProvider } from '@/router';

import App from './App.tsx';
import router from './routes.tsx';

const node = (
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>
);

createRoot(document.getElementById('root')!).render(node);

function registerServiceWorker() {
  if ('serviceWorker' in window.navigator) {
    window.navigator.serviceWorker.register('./sw.js');
  }
}

if (import.meta.env.PROD) {
  registerServiceWorker();
}
