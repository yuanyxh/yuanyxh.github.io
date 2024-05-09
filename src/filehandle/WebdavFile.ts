import { createElement } from 'react';

import type { FileStat, WebDAVClient } from 'webdav';
import { AuthType, createClient } from 'webdav';

import type { WebdavInfo } from '@/store';

import { Icon } from '@/components';

import { FilePathNotExistsError, FileTypeError } from './utils/error';
import { FileType } from './utils/fileManager';

function createWebdavFileSystemHandle(
  file: FileStat,
  webdav: WebDAVClient,
  parentPath: string
) {
  if (file.type == 'directory') {
    return new WebdavFileSystemDirectoryHandle(
      webdav,
      parentPath + '/',
      file.basename
    );
  } else {
    return new WebdavFileSystemFileHandle(webdav, parentPath, file.basename);
  }
}

class WebdavFileSystemWritableFileStream
  implements FileSystemWritableFileStream
{
  locked: boolean = false;

  private webdav: WebDAVClient;
  private fullPath: string;

  constructor(webdav: WebDAVClient, fullPath: string) {
    this.webdav = webdav;
    this.fullPath = fullPath;
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
  }

  async close(): Promise<void> {
    return void 0;
  }
}

class WebdavFileSystemFileHandle implements FileSystemFileHandle {
  readonly kind = 'file';

  private webdav: WebDAVClient;

  private fullPath: string;

  private _name: string;

  constructor(webdav: WebDAVClient, fullPath: string, name: string) {
    this.webdav = webdav;

    this._name = name;

    this.fullPath = fullPath;
  }

  get name() {
    return this._name;
  }

  createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle> {
    throw new Error('Method not implemented.');
  }

  isSameEntry(other: FileSystemHandle): Promise<boolean>;
  isSameEntry(arg: FileSystemHandle): boolean;
  isSameEntry(): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  queryPermission(): Promise<PermissionStatus> {
    throw new Error('Method not implemented.');
  }

  requestPermission(): Promise<PermissionStatus> {
    throw new Error('Method not implemented.');
  }

  remove(): Promise<undefined> {
    throw new Error('Method not implemented.');
  }

  async getFile() {
    const data = (await this.webdav.getFileContents(this.fullPath, {
      format: 'binary'
    })) as ArrayBuffer;

    return new File([data], this._name);
  }

  async createWritable(
    options?: FileSystemCreateWritableOptions | undefined
  ): Promise<FileSystemWritableFileStream> {
    options;

    const { webdav, fullPath } = this;

    return new WebdavFileSystemWritableFileStream(webdav, fullPath);
  }
}

class WebdavFileSystemDirectoryHandle implements FileSystemDirectoryHandle {
  readonly kind = 'directory';

  private webdav: WebDAVClient;

  private fullPath: string;

  private _name: string;

  constructor(webdav: WebDAVClient, fullPath: string, name: string) {
    this.webdav = webdav;

    this._name = name;
    this.fullPath = fullPath;
  }

  get name() {
    return this._name;
  }

  resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
  resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
  resolve(): Promise<string[] | null> {
    throw new Error('Method not implemented.');
  }

  keys(): AsyncIterableIterator<string> {
    throw new Error('Method not implemented.');
  }

  values(): AsyncIterableIterator<
    FileSystemFileHandle | FileSystemDirectoryHandle
  > {
    throw new Error('Method not implemented.');
  }

  isSameEntry(other: FileSystemHandle): Promise<boolean>;
  isSameEntry(arg: FileSystemHandle): boolean;
  isSameEntry(): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  queryPermission(): Promise<PermissionStatus> {
    throw new Error('Method not implemented.');
  }

  requestPermission(): Promise<PermissionStatus> {
    throw new Error('Method not implemented.');
  }

  remove(): Promise<undefined> {
    throw new Error('Method not implemented.');
  }

  entries(): AsyncIterableIterator<
    [string, WebdavFileSystemDirectoryHandle | WebdavFileSystemFileHandle]
  > {
    let i = 0;

    const { webdav, fullPath } = this;

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
            createWebdavFileSystemHandle(curr, webdav, fullPath + curr.basename)
          ],
          done: false
        };
      }
    };
  }

  async getDirectoryHandle(
    name: string,
    options?: FileSystemHandleCreateOptions
  ): Promise<WebdavFileSystemDirectoryHandle> {
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
      name
    );
  }

  async getFileHandle(
    name: string,
    options?: FileSystemHandleCreateOptions
  ): Promise<WebdavFileSystemFileHandle> {
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

    return new WebdavFileSystemFileHandle(this.webdav, subFullPath, name);
  }

  async removeEntry(name: string): Promise<undefined> {
    const subFullPath = this.fullPath + name;

    await this.webdav.deleteFile(subFullPath);

    return void 0;
  }
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

  constructor(webdav: WebdavInfo) {
    this.name = webdav.name;

    this.webdav = createClient(webdav.url, {
      authType: AuthType.Auto,
      username: webdav.username,
      password: webdav.password
    });

    this.handle = new WebdavFileSystemDirectoryHandle(
      this.webdav,
      '/',
      this.name
    );
  }
}

export default WebdavFile;
