import { createContext, useEffect, useRef } from 'react';

import {
  Button,
  ConfigProvider,
  message,
  Modal,
  notification,
  theme
} from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { HookAPI } from 'antd/es/modal/useModal';
import type { NotificationInstance } from 'antd/es/notification/interface';

import type { State } from '@/store';
import { useAppStore } from '@/store';

import {
  addGlobalListener,
  getStorage,
  hasLocalStorage,
  notify,
  ServiceWorkerManager
} from '@/utils';

import { resetProgressBar } from './routes';
import './App.less';

interface IAppProps extends Required<ChildrenComponent> {}

interface AppProvider {
  notification: NotificationInstance;
  message: MessageInstance;
  modal: HookAPI;
}

const APP_PROVIDER = {} as AppProvider;

/** app context, provider global tools */
export const AppContext = createContext(APP_PROVIDER);

const { useNotification } = notification;
const { useMessage } = message;
const { useModal } = Modal;

const App: React.FC<IAppProps> = (props) => {
  const [notificationApi, notificationContextHolder] = useNotification({
    maxCount: 1
  });
  const [messageApi, messageContextHolder] = useMessage();
  const [modalApi, modelContextHolder] = useModal();

  APP_PROVIDER.notification = notificationApi;
  APP_PROVIDER.message = messageApi;
  APP_PROVIDER.modal = modalApi;

  const appProvider = useRef<AppProvider>(APP_PROVIDER);

  const serviceWorkerRef = useRef<ServiceWorkerManager>();

  const {
    settings: { colorScheme, enableServiceWorkerCache, enableNotification },
    status: { frontDesk },
    setLanguage,
    setColorScheme,
    setFrontDesk
  } = useAppStore();

  const listenerColorSchemeChange = (e: MediaQueryListEvent) => {
    setColorScheme(e.matches ? 'dark' : 'light');
  };

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

      if (!frontDesk && enableNotification) {
        notify({
          icon: '/favicon.ico',
          title: '有新内容',
          data: '网站内容有更新，您可以前往查看更新。'
        });
      }
    }
    serviceWorkerRef.current = new ServiceWorkerManager({ update });
    if (import.meta.env.PROD && enableServiceWorkerCache) {
      serviceWorkerRef.current.registerServiceWorker();
    } else {
      serviceWorkerRef.current.unregisterServiceWorker();
    }

    const removePageShowListener = addGlobalListener('pageshow', () => {
      setFrontDesk(true);
    });
    const removePageHideListener = addGlobalListener('pagehide', () => {
      setFrontDesk(false);
    });
    darkModeQuery.addEventListener('change', listenerColorSchemeChange);

    return () => {
      removePageShowListener();
      removePageHideListener();
      darkModeQuery.removeEventListener('change', listenerColorSchemeChange);
    };
  }, []);

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
