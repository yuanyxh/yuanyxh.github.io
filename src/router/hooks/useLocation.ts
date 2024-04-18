import { useContext, useEffect, useState } from 'react';

import { RouterContext } from '../shared/context';

export function useLocation() {
  const routerContext = useContext(RouterContext);

  const [state, setState] = useState(routerContext?.getState());

  useEffect(() => {
    return routerContext?.subscribe((state) => {
      setState(state);
    });
  }, [routerContext]);

  return state;
}
