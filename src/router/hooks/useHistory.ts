import { useContext, useMemo } from 'react';

import { RouterContext } from '../shared/context';

import type { NavigateOptions } from '..';

type HistoryOptions = Pick<NavigateOptions, 'query' | 'state' | 'hash'>;

export function useHistory() {
  const routerContext = useContext(RouterContext);

  const history = useMemo(() => {
    function push(to: string, options?: HistoryOptions) {
      routerContext?.navigate(to, options);
    }

    function replace(to: string, options?: HistoryOptions) {
      routerContext?.navigate(
        to,
        options ? { ...options, replace: true } : { replace: true }
      );
    }

    function back() {
      routerContext?.navigate(-1);
    }

    function forward() {
      routerContext?.navigate(1);
    }

    function go(to: number) {
      routerContext?.navigate(to);
    }

    return {
      push,
      replace,
      go,
      back,
      forward
    };
  }, [routerContext]);

  return history;
}
