import { FileTypeError } from './error';

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
  /** Is this a file from the Internet? */
  remote?: boolean;
  ext?: string;
}

export async function getFileInfo(handle: DH | FH, key: string): Promise<FileInfo> {
  const type = await getHandleType(handle);

  let ext: string | undefined = void 0;
  if (key.includes('.')) {
    ext = '.' + key.split('.').pop();
  }

  return { name: key, type, icon: '', handle, ext };
}

export async function getChildren(directory: DH) {
  const children: FileInfo[] = [];

  for await (const [key, handle] of directory.entries()) {
    children[children.length] = await getFileInfo(handle, key);
  }

  return children
    .filter((child) => child.type === FileType.DIRECTORY)
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
  const files = await window.showOpenFilePicker(options);

  await Promise.all(
    files.map(async (file) => createFile(directory, file.name, await file.getFile()))
  );

  return true;
}

export async function importDirectory(directory: DH, options?: DirectoryPickerOptions) {
  const folder = await window.showDirectoryPicker(options);

  await move(folder, await createDirectory(directory, folder.name));

  return true;
}

export async function exportFile(file: FH) {
  const handle = await window.showSaveFilePicker({
    suggestedName: file.name,
    types: [{ description: 'export file', accept: {} }]
  });

  await writeFile(handle, await file.getFile());

  return true;
}

export async function exportDirectory(directory: DH) {
  const handle = await window.showDirectoryPicker({ mode: 'readwrite' });

  await moveDirectoryWithSelf(directory, handle);

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

  if (!copy) {
    await remove(origin, name);
  }

  return handle;
}

export async function moveDirectoryWithSelf(origin: DH, target: DH) {
  const _target = await target.getDirectoryHandle(origin.name, { create: true });

  await move(origin, _target);

  return true;
}

export async function moveDirectory(origin: DH, target: DH, name: string, copy = true) {
  const _origin = await origin.getDirectoryHandle(name);
  const _target = await createDirectory(target, name);

  const entries = _origin.entries();
  for await (const [key, handle] of entries) {
    if ((await getHandleType(handle)) === FileType.FILE) {
      await moveFile(_origin, _target, key, copy);
    } else {
      await moveDirectory(_origin, _target, key);
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

        if (!copy) {
          await remove(origin, name);
        }

        return handle;
      }
    })
  );
}
