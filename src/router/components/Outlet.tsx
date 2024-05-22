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

import { Loading } from '@/components';

import ErrorCom from './Error';
import ErrorBoundary, { ErrorBoundaryContext } from './ErrorBoundary';
import NotFound from './NotFound';
import { NOT_FOUND_PATH, ResolveRouteObject } from '../router';
import { RouterContext } from '../shared/context';

interface IOutletProps extends ChildrenComponent {}

export interface IOutletRef {
  onMounted(cb: () => any): void;
}

interface IErrorBoundaryConsumeProps extends ChildrenComponent {}

const ErrorBoundaryConsume: React.FC<Readonly<IErrorBoundaryConsumeProps>> = memo(
  function ErrorBoundaryConsume(props) {
    const { children } = props;

    const errorboundaryContext = useContext(ErrorBoundaryContext);
    const routerContext = useContext(RouterContext);

    const resetErrorRef = useRef(false);

    useEffect(() => {
      return routerContext?.afterEnter(() => {
        if (errorboundaryContext.hasError && !resetErrorRef.current) {
          resetErrorRef.current = true;
        }
      });
    }, []);

    useEffect(() => {
      if (resetErrorRef.current) {
        errorboundaryContext.reset?.();
        resetErrorRef.current = false;
      }
    }, [children]);

    return (
      <>
        {errorboundaryContext.hasError ? <ErrorCom errorInfo={errorboundaryContext} /> : children}
      </>
    );
  }
);

const Outlet = memo(
  forwardRef<IOutletRef, Readonly<IOutletProps>>(function Outlet(_props, ref) {
    const routerContext = useContext(RouterContext);

    const initialedRef = useRef(false);
    const [route, setRoute] = useState<ResolveRouteObject>();

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

    useLayoutEffect(() => {
      mountedRef.current?.();

      // let fullPath = route?.fullPath || 'no_path';
      // fullPath = fullPath.endsWith('/index') ? fullPath.slice(0, -6) : fullPath;

      // if ([fullPath, `${fullPath}/`].includes(window.location.pathname)) {
      //   window.document.dispatchEvent(new Event('pageReadyed'));
      // }
    }, [route]);

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

    if (route?.module === void 0) return null;

    let Element: React.FC = () => null;

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
        Element = ErrorCom;
        break;
      default:
        break;
    }

    return (
      <ErrorBoundary>
        <ErrorBoundaryConsume>
          <Element />
        </ErrorBoundaryConsume>
      </ErrorBoundary>
    );
  })
);

export default Outlet;
