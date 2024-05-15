import { useContext } from 'react';

import { RouterContext } from '../shared/context';

export function useRoutes() {
  const routerContext = useContext(RouterContext);

  return routerContext?.getRoutes();
}
