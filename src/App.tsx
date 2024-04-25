import { createContext, useCallback, useEffect, useRef } from 'react';

import { Button, ConfigProvider, message, notification, theme } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { NotificationInstance } from 'antd/es/notification/interface';

import { State, useAppStore } from '@/store';

import { getStorage, hasLocalStorage, ServiceWorkerManager } from '@/utils';

import { resetProgressBar } from './routes';
import './App.less';

interface IAppProps extends Required<ChildrenComponent> {}

interface AppProvider {
  notification: NotificationInstance;
  message: MessageInstance;
}

/** app context, provider global tools */
export const AppContext = createContext({} as AppProvider);

const App: React.FC<IAppProps> = (props) => {
  const [notificationApi, notificationContextHolder] =
    notification.useNotification({
      maxCount: 1
    });
  const [messageApi, messageContextHolder] = message.useMessage();

  const appProvider = useRef<AppProvider>({
    notification: notificationApi,
    message: messageApi
  });

  const serviceWorkerRef = useRef<ServiceWorkerManager>();

  const {
    settings: { colorScheme, enableServiceWorkerCache },
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
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (hasLocalStorage('app')) {
      setLanguage(getStorage<State>('app')?.settings?.language || 'zh-CN');
      setColorScheme(
        getStorage<State>('app')?.settings?.colorScheme || 'light'
      );
    } else {
      setLanguage(language);
      if (darkModeQuery.matches) {
        setColorScheme('dark');
      }
    }

    serviceWorkerRef.current = new ServiceWorkerManager({ update });
    if (import.meta.env.PROD && enableServiceWorkerCache) {
      serviceWorkerRef.current.registerServiceWorker();
    } else {
      serviceWorkerRef.current.unregisterServiceWorker();
    }

    function update() {
      function handleReEnter() {
        serviceWorkerRef.current?.skipWaiting();
        notificationApi.destroy();
      }

      const btn = (
        <Button type="primary" onClick={handleReEnter}>
          确认
        </Button>
      );

      notificationApi.info({
        message: '有新内容',
        description: '网站有更新，请点击确认以获取最新内容。',
        placement: 'bottomRight',
        style: { padding: '14px 16px', width: 300 },
        btn,
        duration: null
      });
    }

    darkModeQuery.addEventListener('change', listenerColorSchemeChange);
    return () =>
      darkModeQuery.removeEventListener('change', listenerColorSchemeChange);
  }, []);

  return (
    <>
      {notificationContextHolder}
      {messageContextHolder}

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
        <AppContext.Provider value={appProvider.current}>
          {props.children}
        </AppContext.Provider>
      </ConfigProvider>
    </>
  );
};

export default App;
