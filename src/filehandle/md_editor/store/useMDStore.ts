import { getStorage, setStorage } from '@/utils';

import { create } from 'zustand';

export interface UploadInfo {
  url: string;
  field: string;
  navigation: string;
  body: string;
}

export interface MDState {
  uploadInfo: UploadInfo;
}

export interface MDActions {
  setUploadInfo(uploadInfo: UploadInfo): void;
}

export const useMDStore = create<MDState & MDActions>((set) => ({
  ...getStorage<MDState>('filesystem/md', {
    uploadInfo: {
      url: '',
      field: '',
      navigation: '',
      body: ''
    }
  }),
  setUploadInfo(uploadInfo) {
    set(() => {
      const store = { uploadInfo };

      setStorage('filesystem/md', store);

      return store;
    });
  }
}));
