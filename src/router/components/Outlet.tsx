import React, {
  memo,
  startTransition,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { forwardRef } from 'react';

import ErrorBoundary from './ErrorBoundary';
import { NOT_FOUND_PATH, RouteObject } from '../router';
import { RouterContext } from '../shared/context';

interface IOutletProps extends ChildrenComponent {}

export interface IOutletRef {
  onMounted(cb: () => any): void;
}

function Loading() {
  return <h1>loading</h1>;
}

function Error() {
  return <h1>some error</h1>;
}

function NotFound() {
  return <h1>not found</h1>;
}

const Outlet = memo(
  forwardRef<IOutletRef, Readonly<IOutletProps>>(function Outlet(_props, ref) {
    const routerContext = useContext(RouterContext);

    const initialedRef = useRef(false);
    const [route, setRoute] = useState<RouteObject>();

    const mountedRef = useRef<() => any>();

    useImperativeHandle(
      ref,
      () => ({
        onMounted(cb) {
          mountedRef.current = cb;
        }
      }),
      []
    );

    useEffect(() => {
      routerContext?.initialize();

      return routerContext?.onMatchRoute((getMatch) => {
        const match = getMatch && getMatch();

        startTransition(() => {
          const mutationFun = () => {
            setRoute((prev) => {
              if (!prev || !match) {
                return match;
              }

              if (
                match.fullPath === prev.fullPath &&
                match.module?.status === prev.module?.status
              ) {
                return prev;
              }

              if (match.module?.status === 'pending') return prev;

              return match;
            });
          };

          if (!document.startViewTransition) {
            return mutationFun();
          }

          document.startViewTransition(mutationFun);
        });
      });
    }, [routerContext]);

    useLayoutEffect(() => {
      mountedRef.current?.();

      // use prerender to complete, how do I remove it after pre-rendering?
      //don't delete this, mark it to delete after the construction
      try {
        if (!route) return void 0;

        const currentPaths = [
          window.location.pathname,
          window.location.pathname + 'index',
          window.location.pathname + '/index'
        ];

        if (currentPaths.includes(route.fullPath!)) {
          window.document.dispatchEvent(new Event('pageReadyed'));
        }
      } catch (err) {
        window.document.dispatchEvent(new Event('pageReadyed'));
      }
      //don't delete this, mark it to delete after the construction
    }, [route]);

    if (route?.module === void 0) return null;

    let Element: () => JSX.Element | React.ReactNode = () => null;

    if (route.path === NOT_FOUND_PATH) {
      return <NotFound />;
    }

    switch (route.module.status) {
      case 'pending':
        if (!initialedRef.current) {
          Element = Loading;
        }
        break;
      case 'fulfilled':
        initialedRef.current = true;
        Element = route.module.module!.default;
        break;
      case 'rejected':
        initialedRef.current = false;
        Element = Error;
        break;
      default:
        break;
    }

    return (
      <ErrorBoundary>
        <Element />
      </ErrorBoundary>
    );
  })
);

export default Outlet;
