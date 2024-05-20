import { getStorage, setStorage } from '@/utils';

import { create } from 'zustand';

export interface AppState {
  settings: {
    language: string;
    colorScheme: 'light' | 'dark';
    enableServiceWorkerCache: boolean;
    enableNotification: boolean;
  };
  status: {
    frontDesk: boolean;
  };
}

export interface AppActions {
  setLanguage(language: string): void;
  setColorScheme(colorScheme: AppState['settings']['colorScheme']): void;
  setColorSchemeNonPersistent(colorScheme: AppState['settings']['colorScheme']): void;
  setEnableServiceWorkerCache(
    enableServiceWorkerCache: AppState['settings']['enableServiceWorkerCache']
  ): void;
  setEnableNotification(enableNotification: AppState['settings']['enableNotification']): void;
  setFrontDesk(frontDesk: AppState['status']['frontDesk']): void;
}

const useAppStore = create<AppState & AppActions>((set) => ({
  ...getStorage<AppState>('app', {
    settings: {
      language: 'zh-CN',
      colorScheme: 'light',
      enableServiceWorkerCache: true,
      enableNotification: false
    },
    status: {
      frontDesk: true
    }
  }),
  setLanguage(language) {
    set((state) => {
      const app = {
        ...state,
        settings: { ...state.settings, language: language }
      };

      setStorage('app', app);

      return app;
    });

    document.documentElement.setAttribute('lang', language);
  },
  setColorScheme(colorScheme) {
    set((state) => {
      const app = {
        ...state,
        settings: { ...state.settings, colorScheme: colorScheme }
      };

      setStorage('app', app);

      return app;
    });

    document.documentElement.setAttribute('mode', colorScheme);
  },
  setColorSchemeNonPersistent(colorScheme) {
    set((state) => {
      const app = {
        ...state,
        settings: { ...state.settings, colorScheme: colorScheme }
      };
      return app;
    });

    document.documentElement.setAttribute('mode', colorScheme);
  },
  setEnableServiceWorkerCache(enableServiceWorkerCache) {
    set((state) => {
      const app = {
        ...state,
        settings: { ...state.settings, enableServiceWorkerCache }
      };

      setStorage('app', app);

      return app;
    });
  },
  setEnableNotification(enableNotification) {
    set((state) => {
      const app = {
        ...state,
        settings: { ...state.settings, enableNotification }
      };

      setStorage('app', app);

      return app;
    });
  },
  setFrontDesk(frontDesk) {
    set((state) => ({ ...state, status: { frontDesk: frontDesk } }));
  }
}));

export default useAppStore;
