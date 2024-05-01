import { useContext, useLayoutEffect, useRef } from 'react';

import { assign } from 'lodash-es';

import { addGlobalListener } from '@/utils';

import { RouterContext } from '../shared/context';

interface SavedScolllPosition {
  y: number;
  timestamp: number;
}

const map: { [key: string]: SavedScolllPosition } = {};

export function useScrollStore(selector: string) {
  const routerContext = useContext(RouterContext);
  const elementRef = useRef<Element>();
  const formLocation = useRef<string>();
  const toLocation = useRef<string>();

  useLayoutEffect(() => {
    elementRef.current = window.document.querySelector(selector) || void 0;

    const cancelBeforeEnter = routerContext?.beforeEnter(
      (from, to, { type, changeHistory }) => {
        formLocation.current = from.path;
        toLocation.current = to.path;

        // we save the scroll position of the current page when pushing
        if (changeHistory && type === 'push') {
          window.history.replaceState(
            assign({}, routerContext.getState()?.state, {
              y: elementRef.current?.scrollTop || 0,
              timestamp: Date.now()
            }),
            ''
          );
        }
      }
    );

    const cancelPopState = addGlobalListener('popstate', () => {
      // we save the scroll position of the previous page when popping
      // in popstate, formLocation is the page we are about to leave, and we need to save its scroll position
      map[formLocation.current || ''] = {
        y: elementRef.current?.scrollTop || 0,
        timestamp: Date.now()
      };
    });

    const cancelBeforeUnload = addGlobalListener('beforeunload', () => {
      window.history.replaceState(
        assign({}, routerContext?.getState()?.state, {
          y: elementRef.current?.scrollTop || 0,
          timestamp: Date.now()
        }),
        ''
      );
    });

    return () => {
      elementRef.current = void 0;
      cancelPopState();
      cancelBeforeUnload();
      cancelBeforeEnter && cancelBeforeEnter();
    };
  }, [selector]);

  return () => {
    const state = window.history.state as SavedScolllPosition | null;
    const savedScrollPosition = map[toLocation.current || ''];

    if (state && savedScrollPosition) {
      return state.timestamp > savedScrollPosition.timestamp
        ? state
        : savedScrollPosition;
    }

    // we take the scroll position from history.state, if it doesn't exist, from the map, otherwise the scroll position is 0
    return state || savedScrollPosition || { y: 0 };
  };
}
