import React from 'react';
import ReactDOM from 'react-dom/client';

import 'normalize.css';
import 'nprogress/nprogress.css';
import 'virtual:svg-icons-register';

import { RouterProvider } from '@/router';

import App from './App.tsx';
import router from './routes.tsx';

// use hydrateRoot instead of createRoot because the page is pre-rendered
ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>
);
