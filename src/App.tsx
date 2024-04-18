import { useCallback, useEffect } from 'react';

import { ConfigProvider, theme } from 'antd';

import { useAppStore } from './store';
import './App.less';

interface IAppProps extends Required<ChildrenComponent> {}
const App: React.FC<IAppProps> = (props) => {
  const {
    settings: { colorScheme },
    setLanguage,
    setColorScheme
  } = useAppStore();

  const listenerColorSchemeChange = useCallback((e: MediaQueryListEvent) => {
    setColorScheme(e.matches ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    let language = 'en';
    if (['zh-CN', 'en'].includes(window.navigator.language)) {
      language = window.navigator.language;
    }
    setLanguage(language);

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkModeQuery.matches) {
      setColorScheme('dark');
    }

    darkModeQuery.addEventListener('change', listenerColorSchemeChange);
    return () =>
      darkModeQuery.removeEventListener('change', listenerColorSchemeChange);
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ff6000'
        },
        algorithm:
          colorScheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      {props.children}
    </ConfigProvider>
  );
};

export default App;
