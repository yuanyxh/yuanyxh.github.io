import { create } from 'zustand';

interface State {
  settings: {
    language: string;
    colorScheme: 'light' | 'dark';
  };
}

interface Actions {
  setLanguage(language: string): void;
  setColorScheme(colorScheme: State['settings']['colorScheme']): void;
}

const useAppStore = create<State & Actions>((set) => ({
  settings: {
    language: 'zh-CN',
    colorScheme: 'light'
  },
  setLanguage(language) {
    set((state) => ({ settings: { ...state.settings, language: language } }));

    document.documentElement.setAttribute('lang', language);
  },
  setColorScheme(colorScheme) {
    set((state) => ({
      settings: { ...state.settings, colorScheme: colorScheme }
    }));

    document.documentElement.setAttribute('mode', colorScheme);
  }
}));

export default useAppStore;
