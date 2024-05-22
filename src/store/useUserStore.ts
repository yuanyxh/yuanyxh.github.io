import { create } from 'zustand';

import { getStorage, setStorage } from '@/utils';

export interface WebdavInfo {
  url: string;
  name: string;
  username: string;
  password: string;
}

export interface UserState {
  webdavs: WebdavInfo[];
}

export interface UserActions {
  addWebdav(webdav: WebdavInfo): void;
  setWebdavs(webdavs: WebdavInfo[]): void;
}

const useAppStore = create<UserState & UserActions>((set) => ({
  ...getStorage<UserState>('user', {
    webdavs: []
  }),
  addWebdav(webdav) {
    set((prev) => {
      const store = { ...prev, webdavs: [...prev.webdavs, webdav] };

      setStorage('user', { ...prev, ...store });

      return store;
    });
  },
  setWebdavs(webdavs) {
    set((prev) => {
      const store = { ...prev, webdavs: webdavs };

      setStorage('user', { ...prev, ...store });

      return store;
    });
  }
}));

export default useAppStore;
