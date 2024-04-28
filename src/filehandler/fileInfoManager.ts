import { generateFileInfo } from './utils/generateFileInfo';

import localforage from 'localforage';

export const FILE_SYSTEM_DATA_BASE_KEY = 'FILE_SYSTEM_DATA_BASE_KEY';
export const FILE_SYSTEM_STORE_KEY = 'FILE_SYSTEM_STORE_KEY';

/** file */
type FileType = 0;
/** directory */
type DirectoryType = 1;

export interface FileInfo {
  /** file name */
  name: string;
  /** update timestamp */
  updateAt: number;
  /** file version number, after several modifications since the creation */
  version: number;
  /** file md5 fingerprint */
  sign: string;
  /** relative path */
  path: string;
  type: FileType | DirectoryType;
  /** file size, byte */
  size?: number;
  /** default file processing program, when the file is the directory, this attribute is invalid */
  defaultProcessor?: string;
  /** extension name */
  ext?: string;
  children?: FileInfo[];
}

localforage.config({
  driver: localforage.INDEXEDDB,
  name: FILE_SYSTEM_DATA_BASE_KEY,
  storeName: FILE_SYSTEM_STORE_KEY,
  description: 'file system info store'
});

const initBaseFileInfo = async (key: string) => {
  let result = await localforage.getItem<FileInfo>(key);

  if (result) return result;

  result = await generateFileInfo({
    name: key,
    path: key,
    type: 1
  });
  await localforage.setItem(key, result);

  return result;
};

export const OriginalDirectory = {
  TEMP: 'temp',
  CONFIG: 'config',
  HOME: 'home',
  RECYCLE: 'recycle'
};

class FileInfoManager {
  private _temp: FileInfo | null = null;
  private _config: FileInfo | null = null;
  private _home: FileInfo | null = null;
  private _recycle: FileInfo | null = null;

  private _current: FileInfo | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    initBaseFileInfo(OriginalDirectory.TEMP).then((temp) => {
      this._temp = temp;
    });
    initBaseFileInfo(OriginalDirectory.CONFIG).then((config) => {
      this._config = config;
    });
    initBaseFileInfo(OriginalDirectory.HOME).then((home) => {
      this._home = home;
    });
    initBaseFileInfo(OriginalDirectory.RECYCLE).then((recycle) => {
      this._recycle = recycle;
    });
  }

  get temp() {
    return this._temp;
  }

  get config() {
    return this._config;
  }
  get home() {
    return this._home;
  }
  get recycle() {
    return this._recycle;
  }

  get current() {
    return this._current;
  }

  setCurrent(key: 'temp' | 'config' | 'home' | 'recycle') {
    this._current = this[key];
    // TODO: notify
  }
}

export default FileInfoManager;
