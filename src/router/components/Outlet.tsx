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

import { Button, Typography } from 'antd';

import { Icon, Loading } from '@/components';

import ErrorBoundary from './ErrorBoundary';
import styles from './styles/Outlet.module.less';
import { useHistory } from '../hooks/useHistory';
import { NOT_FOUND_PATH, ResolveRouteObject } from '../router';
import { RouterContext } from '../shared/context';

interface IOutletProps extends ChildrenComponent {}

export interface IOutletRef {
  onMounted(cb: () => any): void;
}

function Error() {
  return <h1>some error</h1>;
}

function NotFound() {
  const history = useHistory();

  const handleBack = () => {
    history.replace('/');
  };

  return (
    <div className={styles.notFound}>
      <div>
        <Icon icon="page-not-found" size={'25vw'} />

        <Typography.Paragraph type="secondary">
          Free Page Not Found Illustration By&nbsp;
          <Typography.Link
            type="danger"
            rel="external nofollow noopener"
            href="https://iconscout.com/contributors/iconscout"
          >
            IconScout Store
          </Typography.Link>
        </Typography.Paragraph>
      </div>

      <div>
        <Typography.Paragraph
          type="secondary"
          style={{ marginBottom: 5, fontSize: 15 }}
        >
          您访问了一个不存在的页面，
        </Typography.Paragraph>
        <Typography.Paragraph
          type="secondary"
          style={{ marginBottom: 5, fontSize: 15 }}
        >
          如果这是一个错误请前往{' '}
          <Typography.Link
            type="danger"
            target="_blank"
            href="https://github.com/yuanyxh/yuanyxh.github.io"
          >
            Github
          </Typography.Link>
          &nbsp;反馈。
        </Typography.Paragraph>

        <Typography.Paragraph style={{ marginTop: 20 }}>
          <Button type="primary" onClick={handleBack}>
            返回首页
          </Button>
        </Typography.Paragraph>
      </div>
    </div>
  );
}

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
