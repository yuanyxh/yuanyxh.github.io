import type { WebdavInfo } from '@/store';

import { FileTypeError } from './error';
import WebdavFile from '../WebdavFile';

export type FileDataType = ArrayBuffer | Blob | string;

export type DH = FileSystemDirectoryHandle;
export type FH = FileSystemFileHandle;

export enum FileType {
  FILE = 0,
  DIRECTORY = 1
}

export interface FileInfo {
  name: string;
  type: FileType;
  icon: React.ReactNode;
  handle: DH | FH;
  /** this is remote file? */
  remote?: boolean;
  ext?: string;
}

export async function getChildren(directory: DH, webdavs: WebdavInfo[] = []) {
  const children: FileInfo[] = [];

  for await (const [key, handle] of directory.entries()) {
    const type = await getHandleType(handle);

    let ext: string | undefined = void 0;
    if (key.includes('.')) {
      ext = '.' + key.split('.').pop();
    }

    children[children.length] = { name: key, type, icon: '', handle, ext };
  }

  return children
    .filter((child) => child.type === FileType.DIRECTORY)
    .concat(webdavs.map((webdav) => new WebdavFile(webdav)))
    .sort((a, b) => a.name.localeCompare(b.name))
    .concat(
      children
        .filter((child) => child.type === FileType.FILE)
        .sort((a, b) => a.name.localeCompare(b.name))
    );
}

export async function getHandle(directory: DH, name: string) {
  return directory.getFileHandle(name).catch(() => directory.getDirectoryHandle(name));
}

export async function getHandleType(handle: DH | FH) {
  const name = handle.name;

  if (handle.kind === 'file') {
    return FileType.FILE;
  } else if (handle.kind === 'directory') {
    return FileType.DIRECTORY;
  }

  throw new FileTypeError(name);
}

export async function importFile(directory: DH, options?: FilePickerOptions) {
  if (!window.showOpenFilePicker) return false;

  const files = await window.showOpenFilePicker(options);

  await Promise.all(
    files.map(async (file) => createFile(directory, file.name, await file.getFile()))
  );

  return true;
}

export async function importDirectory(directory: DH, options?: DirectoryPickerOptions) {
  if (!window.showDirectoryPicker) return false;

  const folder = await window.showDirectoryPicker(options);

  await move(folder, await createDirectory(directory, folder.name));

  return true;
}

export async function writeFile(file: FH, data: FileDataType) {
  const writable = await file.createWritable();
  await writable.write(data);
  await writable.close();
}

export async function createFile(directory: DH, name: string, data?: FileDataType) {
  const handle = await directory.getFileHandle(name, { create: true });

  if (!data) return handle;

  await writeFile(handle, data);

  return handle;
}

export async function createDirectory(directory: DH, name: string) {
  return directory.getDirectoryHandle(name, { create: true });
}

export async function remove(directory: DH, name: string) {
  return directory.removeEntry(name, { recursive: true });
}

export async function moveFile(origin: DH, target: DH, name: string, copy = true) {
  const file = await (await origin.getFileHandle(name)).getFile();

  const handle = await createFile(target, name, file);
  copy === false && (await remove(origin, name));

  return handle;
}

export async function moveDirectory(origin: DH, target: DH, name: string, copy = true) {
  const _origin = await origin.getDirectoryHandle(name);
  const _target = await createDirectory(target, name);

  for await (const [key, handle] of _origin.entries()) {
    if ((await getHandleType(handle)) === FileType.FILE) {
      return await moveFile(_origin, _target, key, copy);
    } else {
      return await moveDirectory(_origin, _target, key);
    }
  }

  return _target;
}

export async function move(origin: DH, target: DH, options?: { names?: string[]; copy?: boolean }) {
  let { names } = options || {};
  const { copy = true } = options || {};

  if (!names) {
    names = (await getChildren(origin)).map((child) => child.name);
  }

  return Promise.all(
    names.map(async (name) => {
      const handle = await getHandle(origin, name);
      if ((await getHandleType(handle)) === FileType.FILE) {
        return moveFile(origin, target, name, copy);
      } else {
        const handle = await moveDirectory(origin, target, name, copy);
        copy === false && (await remove(origin, name));

        return handle;
      }
    })
  );
}
