import { useContext } from 'react';

import { RouterContext } from '../shared/context';

export function useRoute() {
  const routerContext = useContext(RouterContext);

  return routerContext?.getRoutes();
}
