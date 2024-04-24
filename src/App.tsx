import { useCallback, useEffect, useRef } from 'react';

import { Button, ConfigProvider, notification, theme } from 'antd';

import ServiceWorkerManager, { clearCache } from '@/utils/serviceWorker';

import { resetProgressBar } from './routes';
import { useAppStore } from './store';
import './App.less';

interface IAppProps extends Required<ChildrenComponent> {}
const App: React.FC<IAppProps> = (props) => {
  const [api, contextHolder] = notification.useNotification({ maxCount: 1 });
  const serviceWorkerRef = useRef<ServiceWorkerManager>();

  const {
    settings: { colorScheme },
    setLanguage,
    setColorScheme
  } = useAppStore();

  const listenerColorSchemeChange = useCallback((e: MediaQueryListEvent) => {
    setColorScheme(e.matches ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    resetProgressBar();

    let language = 'en';
    if (['zh-CN', 'en'].includes(window.navigator.language)) {
      language = window.navigator.language;
    }
    setLanguage(language);

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkModeQuery.matches) {
      setColorScheme('dark');
    }

    function update() {
      function handleReEnter() {
        serviceWorkerRef.current?.skipWaiting();
        api.destroy();
      }

      const btn = (
        <Button type="primary" onClick={handleReEnter}>
          确认
        </Button>
      );

      api.info({
        message: '有新内容',
        description: '网站有更新，请点击确认以获取最新内容。',
        placement: 'bottomRight',
        style: { padding: '14px 16px', width: 300 },
        btn,
        duration: null
      });
    }

    if (import.meta.env.PROD) {
      serviceWorkerRef.current = new ServiceWorkerManager({ update });
      serviceWorkerRef.current.registerServiceWorker();
    }

    darkModeQuery.addEventListener('change', listenerColorSchemeChange);
    return () =>
      darkModeQuery.removeEventListener('change', listenerColorSchemeChange);
  }, []);

  return (
    <>
      {contextHolder}

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#ff6000'
          },
          algorithm:
            colorScheme === 'dark'
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm
        }}
      >
        <Button onClick={() => clearCache()}>清理缓存</Button>
        {props.children}
      </ConfigProvider>
    </>
  );
};

export default App;
