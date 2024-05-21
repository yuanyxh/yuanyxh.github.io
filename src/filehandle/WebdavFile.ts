import { createElement } from 'react';

import { isEqual } from 'lodash-es';
import type { FileStat, WebDAVClient } from 'webdav';
import { AuthType, createClient } from 'webdav';

import type { WebdavInfo } from '@/store';

import { Icon } from '@/components';

import { FilePathNotExistsError, FileTypeError } from './utils/error';
import { FileType } from './utils/fileManager';

function createWebdavFileSystemHandle(
  file: FileStat,
  webdav: WebDAVClient,
  parentPath: string,
  webdavInfo: WebdavInfo
) {
  if (file.type == 'directory') {
    return new WebdavFileSystemDirectoryHandle(webdav, parentPath + '/', file.basename, webdavInfo);
  } else {
    return new WebdavFileSystemFileHandle(webdav, parentPath, file.basename, webdavInfo);
  }
}

class WebdavFileSystemWritableFileStream implements FileSystemWritableFileStream {
  locked: boolean = false;

  private webdav: WebDAVClient;
  private fullPath: string;

  private setFile: (buffer: ArrayBuffer) => void;

  constructor(webdav: WebDAVClient, fullPath: string, setFile: (buffer: ArrayBuffer) => void) {
    this.webdav = webdav;
    this.fullPath = fullPath;

    this.setFile = setFile;
  }

  seek(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  truncate(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  abort(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getWriter(): WritableStreamDefaultWriter<any> {
    throw new Error('Method not implemented.');
  }

  async write(data: FileSystemWriteChunkType): Promise<void> {
    if (data instanceof Blob) {
      data = await data.arrayBuffer();
    }

    await this.webdav.putFileContents(this.fullPath, data as string);

    this.setFile(data as ArrayBuffer);
  }

  async close(): Promise<void> {
    return void 0;
  }
}

class WebdavFileSystemHandle implements FileSystemHandle {
  kind: FileSystemHandleKind;
  name: string;

  private _fullPath: string;

  private _webdav: WebDAVClient;

  private _webdavInfo: WebdavInfo;

  constructor(
    kind: FileSystemHandleKind,
    name: string,
    fullPath: string,
    webdavClient: WebDAVClient,
    webdavInfo: WebdavInfo
  ) {
    this.kind = kind;
    this.name = name;

    this._fullPath = fullPath;
    this._webdav = webdavClient;

    this._webdavInfo = webdavInfo;
  }

  get fullPath() {
    return this._fullPath;
  }

  get webdav() {
    return this._webdav;
  }

  get webdavInfo() {
    return this._webdavInfo;
  }

  isSameEntry(other: WebdavFileSystemHandle): Promise<boolean>;
  isSameEntry(arg: WebdavFileSystemHandle): boolean;
  isSameEntry(handle: WebdavFileSystemHandle): boolean | Promise<boolean> {
    try {
      if (
        handle instanceof WebdavFileSystemHandle &&
        isEqual(this.webdavInfo, handle.webdavInfo) &&
        this._fullPath === handle._fullPath
      ) {
        return Promise.resolve(true);
      }
    } catch (err) {
      return Promise.resolve(false);
    }

    return Promise.resolve(false);
  }

  queryPermission = (): Promise<PermissionStatus> => {
    throw new Error('Method not implemented.');
  };

  requestPermission = (): Promise<PermissionStatus> => {
    throw new Error('Method not implemented.');
  };

  remove = (): Promise<undefined> => {
    throw new Error('Method not implemented.');
  };
}

class WebdavFileSystemFileHandle extends WebdavFileSystemHandle implements FileSystemFileHandle {
  readonly kind = 'file';

  private file: File | null = null;

  constructor(webdav: WebDAVClient, fullPath: string, name: string, webdavInfo: WebdavInfo) {
    super('file', name, fullPath, webdav, webdavInfo);
  }

  createSyncAccessHandle = (): Promise<FileSystemSyncAccessHandle> => {
    throw new Error('Method not implemented.');
  };

  getFile = async () => {
    if (this.file) {
      return this.file;
    }

    const data = (await this.webdav.getFileContents(this.fullPath, {
      format: 'binary'
    })) as ArrayBuffer;

    this.file = new File([data], this.name);

    return this.file;
  };

  createWritable = async (
    options?: FileSystemCreateWritableOptions | undefined
  ): Promise<FileSystemWritableFileStream> => {
    options;

    const { webdav, fullPath } = this;

    return new WebdavFileSystemWritableFileStream(
      webdav,
      fullPath,
      (buffer) => (this.file = new File([buffer], this.name))
    );
  };
}

class WebdavFileSystemDirectoryHandle
  extends WebdavFileSystemHandle
  implements FileSystemDirectoryHandle
{
  readonly kind = 'directory';

  constructor(webdav: WebDAVClient, fullPath: string, name: string, webdavInfo: WebdavInfo) {
    super('directory', name, fullPath, webdav, webdavInfo);
  }

  resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
  resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
  resolve(): Promise<string[] | null> {
    throw new Error('Method not implemented.');
  }

  keys = (): AsyncIterableIterator<string> => {
    throw new Error('Method not implemented.');
  };

  values = (): AsyncIterableIterator<FileSystemFileHandle | FileSystemDirectoryHandle> => {
    throw new Error('Method not implemented.');
  };

  entries = (): AsyncIterableIterator<
    [string, WebdavFileSystemDirectoryHandle | WebdavFileSystemFileHandle]
  > => {
    let i = 0;

    const { webdav, fullPath, webdavInfo } = this;

    const p = webdav.getDirectoryContents(fullPath, {
      includeSelf: false
    }) as Promise<Array<FileStat>>;

    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      async next() {
        const values = await p;

        const curr = values[i++];

        if (!curr) {
          return { value: undefined, done: true };
        }

        return {
          value: [
            curr.basename,
            createWebdavFileSystemHandle(curr, webdav, fullPath + curr.basename, webdavInfo)
          ],
          done: false
        };
      }
    };
  };

  getDirectoryHandle = async (
    name: string,
    options?: FileSystemHandleCreateOptions
  ): Promise<WebdavFileSystemDirectoryHandle> => {
    const { create = false } = options || {};

    const subFullPath = this.fullPath + name;

    const isNotExists = await this.webdav.exists(subFullPath);

    if (isNotExists === false) {
      if (create === false) {
        throw new FilePathNotExistsError(subFullPath);
      } else {
        await this.webdav.createDirectory(subFullPath);
      }
    } else {
      const stat = (await this.webdav.stat(subFullPath)) as FileStat;

      if (stat.type !== 'directory') {
        throw new FileTypeError(stat.basename);
      }
    }

    return new WebdavFileSystemDirectoryHandle(
      this.webdav,
      subFullPath + '/',
      name,
      this.webdavInfo
    );
  };

  getFileHandle = async (
    name: string,
    options?: FileSystemHandleCreateOptions
  ): Promise<WebdavFileSystemFileHandle> => {
    const { create = false } = options || {};

    const subFullPath = this.fullPath + name;

    if (!(await this.webdav.exists(subFullPath))) {
      if (create === false) {
        throw new FilePathNotExistsError(subFullPath);
      } else {
        await this.webdav.putFileContents(subFullPath, '');
      }
    } else {
      const stat = (await this.webdav.stat(subFullPath)) as FileStat;

      if (stat.type !== 'file') {
        throw new FileTypeError(stat.basename);
      }
    }

    return new WebdavFileSystemFileHandle(this.webdav, subFullPath, name, this.webdavInfo);
  };

  removeEntry = async (name: string): Promise<undefined> => {
    const subFullPath = this.fullPath + name;

    await this.webdav.deleteFile(subFullPath);

    return void 0;
  };
}

class WebdavFile {
  name: string;

  icon = createElement(Icon, {
    icon: 'mdi--web',
    color: 'var(--color-primary)'
  });

  type = FileType.DIRECTORY;

  handle: WebdavFileSystemDirectoryHandle;

  webdav: WebDAVClient;

  remote = true;

  constructor(webdavInfo: WebdavInfo) {
    this.name = webdavInfo.name;

    this.webdav = createClient(webdavInfo.url, {
      authType: AuthType.Auto,
      username: webdavInfo.username,
      password: webdavInfo.password
    });

    this.handle = new WebdavFileSystemDirectoryHandle(this.webdav, '/', this.name, webdavInfo);
  }
}

export default WebdavFile;
