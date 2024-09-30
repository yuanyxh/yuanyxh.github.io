import type { RefObject } from 'react';
import { useContext, useLayoutEffect, useRef } from 'react';

import { assign } from 'lodash-es';

import { addGlobalListener } from '@/utils';

import { RouterContext } from '../shared/context';

interface SavedScolllPosition {
  y: number;
  timestamp: number;
}

const map: { [key: string]: SavedScolllPosition } = {};

/**
 *
 * @description page scroll position manager
 * @param eleRef
 * @returns
 */
export function useScrollStore(eleRef: RefObject<HTMLElement | null>) {
  const routerContext = useContext(RouterContext);
  const elementRef = useRef<Element>();
  const formLocation = useRef<string>();
  const toLocation = useRef<string>();

  useLayoutEffect(() => {
    const abortController = new AbortController();

    elementRef.current = eleRef.current || void 0;

    const cancelBeforeEnter = routerContext?.beforeEnter((from, to, { type, changeHistory }) => {
      formLocation.current = from.path;
      toLocation.current = to.path;

      // we save the scroll position of the current page when pushing
      if (changeHistory && type === 'push') {
        const now = Date.now();
        const y = elementRef.current?.scrollTop || 0;

        map[formLocation.current || ''] = {
          y: y,
          timestamp: now
        };

        window.history.replaceState(
          assign({}, routerContext.getState()?.state, {
            y: y,
            timestamp: now
          }),
          ''
        );
      }
    });

    addGlobalListener(
      'popstate',
      () => {
        // we save the scroll position of the previous page when popping
        // in popstate, formLocation is the page we are about to leave, and we need to save its scroll position
        map[formLocation.current || ''] = {
          y: elementRef.current?.scrollTop || 0,
          timestamp: Date.now()
        };
      },
      { signal: abortController.signal }
    );

    addGlobalListener(
      'beforeunload',
      () => {
        window.history.replaceState(
          assign({}, routerContext?.getState()?.state, {
            y: elementRef.current?.scrollTop || 0,
            timestamp: Date.now()
          }),
          ''
        );
      },
      { signal: abortController.signal }
    );

    return () => {
      elementRef.current = void 0;

      abortController.abort();
      cancelBeforeEnter && cancelBeforeEnter();
    };
  }, [eleRef.current]);

  return () => {
    const state = window.history.state as SavedScolllPosition | null;
    const savedScrollPosition = map[toLocation.current || ''];

    if (state && savedScrollPosition) {
      return state.timestamp > savedScrollPosition.timestamp ? state : savedScrollPosition;
    }

    console.log('2', toLocation.current);

    // we take the scroll position from history.state, if it doesn't exist, from the map, otherwise the scroll position is 0
    return state || savedScrollPosition || { y: 0 };
  };
}
