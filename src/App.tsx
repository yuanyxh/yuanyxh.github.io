import { createContext, useEffect, useRef } from 'react';

import { Button, ConfigProvider, message, Modal, notification, theme } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { HookAPI } from 'antd/es/modal/useModal';
import type { NotificationInstance } from 'antd/es/notification/interface';

import { isEmpty } from 'lodash-es';

import type { AppState } from '@/store';
import { useAppStore } from '@/store';

import {
  addGlobalListener,
  assetsLoadHandler,
  getStorage,
  globalEvent,
  hasLocalStorage,
  notify,
  ServiceWorkerManager
} from '@/utils';

import { SMALL_SCREEN_WIDTH } from './enum';
import { resetProgressBar } from './routes';
import './App.less';

interface AppProvider {
  notification: NotificationInstance;
  message: MessageInstance;
  modal: HookAPI;
}

const APP_PROVIDER = {} as AppProvider;

/** App context, provider global tools */
export const AppContext = createContext(APP_PROVIDER);

const { useNotification } = notification;
const { useMessage } = message;
const { useModal } = Modal;

const App: React.FC<Required<ChildrenComponent>> = (props) => {
  const [notificationApi, notificationContextHolder] = useNotification({
    maxCount: 1
  });
  const [messageApi, messageContextHolder] = useMessage();
  const [modalApi, modelContextHolder] = useModal();

  if (isEmpty(APP_PROVIDER)) {
    APP_PROVIDER.notification = notificationApi;
    APP_PROVIDER.message = messageApi;
    APP_PROVIDER.modal = modalApi;
  }

  const appProvider = useRef<AppProvider>(APP_PROVIDER);

  const serviceWorkerRef = useRef<ServiceWorkerManager>();

  const {
    settings: { colorScheme, enableServiceWorkerCache },
    setIsSmallScreen,
    setLanguage,
    setColorScheme,
    setFrontDesk
  } = useAppStore();

  useEffect(() => {
    resetProgressBar();

    let language = 'en';
    if (['zh-CN', 'en'].includes(window.navigator.language)) {
      language = window.navigator.language;
    }
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (hasLocalStorage('app')) {
      setLanguage(getStorage<AppState>('app')?.settings?.language || 'zh-CN');
      setColorScheme(getStorage<AppState>('app')?.settings?.colorScheme || 'light');
    } else {
      setLanguage(language);

      if (darkModeQuery.matches) {
        setColorScheme('dark');
      }
    }

    {
      serviceWorkerRef.current = new ServiceWorkerManager({ update });
      if (import.meta.env.PROD && enableServiceWorkerCache) {
        serviceWorkerRef.current.registerServiceWorker();
      } else {
        serviceWorkerRef.current.unregisterServiceWorker();
      }
    }

    const abortController = new AbortController();

    {
      darkModeQuery.addEventListener(
        'change',
        (e) => setColorScheme(e.matches ? 'dark' : 'light'),
        {
          signal: abortController.signal
        }
      );
    }

    {
      window.document.addEventListener(
        'visibilitychange',
        () => setFrontDesk(!window.document.hidden),
        {
          signal: abortController.signal
        }
      );
    }

    {
      const onResize = () => setIsSmallScreen(window.innerWidth <= SMALL_SCREEN_WIDTH);
      addGlobalListener('resize', onResize, { signal: abortController.signal });
      onResize();
    }

    {
      globalEvent.on('user_tips', ({ type, message: _message }) => messageApi[type](_message), {
        signal: abortController.signal
      });
      globalEvent.on('user_alert', ({ type, ...props }) => modalApi[type](props), {
        signal: abortController.signal
      });
    }

    {
      assetsLoadHandler.reLoadByOnline(() => !enableServiceWorkerCache, {
        signal: abortController.signal
      });
    }

    return () => abortController.abort();
  }, []);

  const update = () => {
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

    if (window.document.hidden && getStorage<AppState>('app')?.settings?.enableNotification) {
      notify({
        icon: '/favicon.ico',
        title: '有新内容',
        body: '网站内容有更新，您可以前往查看更新。'
      });
    }
  };

  return (
    <>
      {notificationContextHolder}
      {messageContextHolder}
      {modelContextHolder}

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#ff6000'
          },
          algorithm: colorScheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}
      >
        <AppContext.Provider value={appProvider.current}>{props.children}</AppContext.Provider>
      </ConfigProvider>
    </>
  );
};

export default App;
