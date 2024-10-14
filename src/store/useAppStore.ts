import { create } from 'zustand';

import { getStorage, setStorage } from '@/utils';

import { SMALL_SCREEN_WIDTH } from '@/enum';

export interface AppState {
  settings: {
    language: string;
    colorScheme: 'light' | 'dark';
    enableServiceWorkerCache: boolean;
    enableNotification: boolean;
  };
  status: {
    /** web app is in frontdesk */
    frontDesk: boolean;
    isSmallScreen: boolean;
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
  setIsSmallScreen(isSmallScreen: AppState['status']['isSmallScreen']): void;
}

/**
 *
 * @description App global store data
 */
const useAppStore = create<AppState & AppActions>((set) => ({
  ...getStorage<AppState>('app', {
    settings: {
      language: 'zh-CN',
      colorScheme: 'light',
      enableServiceWorkerCache: true,
      enableNotification: false
    },
    status: {
      frontDesk: true,
      isSmallScreen: window.innerWidth <= SMALL_SCREEN_WIDTH
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
    set((state) => ({ ...state, status: { ...state.status, frontDesk: frontDesk } }));
  },
  setIsSmallScreen(isSmallScreen) {
    set((state) => ({ ...state, status: { ...state.status, isSmallScreen: isSmallScreen } }));
  }
}));

export default useAppStore;
