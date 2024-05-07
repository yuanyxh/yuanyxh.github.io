import { getStorage, setStorage } from '@/utils';

import { create } from 'zustand';

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
}

const useAppStore = create<UserState & UserActions>((set) => ({
  ...getStorage<UserState>('user', {
    webdavs: []
  }),
  addWebdav(webdav) {
    set((prev) => {
      const webdavs = { webdavs: [...prev.webdavs, webdav] };

      setStorage('user', webdavs);

      return webdavs;
    });
  }
}));

export default useAppStore;
