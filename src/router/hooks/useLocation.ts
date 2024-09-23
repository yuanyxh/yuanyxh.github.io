import { useContext, useEffect, useState } from 'react';

import { parse } from 'qs';

import { RouterContext } from '../shared/context';

/**
 *
 * @description current route location hook
 * @returns
 */
export function useLocation() {
  const routerContext = useContext(RouterContext);

  const [state, setState] = useState(routerContext?.getState());

  useEffect(() => {
    return routerContext?.subscribe((state) => {
      setState(state);
    });
  }, [routerContext]);

  return (
    state || {
      path: window.location.pathname as string,
      query: parse(window.location.search.slice(1)),
      hash: window.location.hash,
      state: window.history.state
    }
  );
}
