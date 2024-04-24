import { getStorage, setStorage } from '@/utils';

import { create } from 'zustand';

export interface State {
  settings: {
    language: string;
    colorScheme: 'light' | 'dark';
    enableServiceWorkerCache: boolean;
  };
}

export interface Actions {
  setLanguage(language: string): void;
  setColorScheme(colorScheme: State['settings']['colorScheme']): void;
  setEnableServiceWorkerCache(
    colorScheme: State['settings']['enableServiceWorkerCache']
  ): void;
}

const useAppStore = create<State & Actions>((set) => ({
  ...getStorage<State>('app', {
    settings: {
      language: 'zh-CN',
      colorScheme: 'light',
      enableServiceWorkerCache: true
    }
  }),
  setLanguage(language) {
    set((state) => {
      const app = { settings: { ...state.settings, language: language } };

      setStorage('app', app);

      return app;
    });

    document.documentElement.setAttribute('lang', language);
  },
  setColorScheme(colorScheme) {
    set((state) => {
      const app = { settings: { ...state.settings, colorScheme: colorScheme } };

      setStorage('app', app);

      return app;
    });

    document.documentElement.setAttribute('mode', colorScheme);
  },
  setEnableServiceWorkerCache(enableServiceWorkerCache) {
    set((state) => {
      const app = { settings: { ...state.settings, enableServiceWorkerCache } };

      setStorage('app', app);

      return app;
    });
  }
}));

export default useAppStore;
