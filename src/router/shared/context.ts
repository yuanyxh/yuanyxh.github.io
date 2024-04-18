import { createContext } from 'react';

import type Router from '../router';

/** router context */
export const RouterContext = createContext<Router | undefined>(void 0);
