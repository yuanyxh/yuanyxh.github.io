import { useContext } from 'react';

import { RouterContext } from '../shared/context';

/**
 *
 * @description get all route
 * @returns
 */
export function useRoutes() {
  const routerContext = useContext(RouterContext);

  return routerContext?.getRoutes();
}
