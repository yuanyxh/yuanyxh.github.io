import {
  FileAlwaysExistError,
  FileNotDirectoryError,
  FileNotFoundError,
  FilePathNotExistError,
  NotEnoughStorageSpaceError
} from './error';
import type { DirectoryType, FileType } from './fileInfoManager';
import fileInfoManager from './fileInfoManager';
import { splitPath } from './utils';
import { calcDirectorySize } from './utils/calcDirectorySize';
import {
  checkRemainingStorageSpace,
  getByteLength,
  getStorageUsage
} from './utils/getStorageUsage';

export type IHandle = FileSystemFileHandle | FileSystemDirectoryHandle;

export type FileData = ArrayBuffer | Blob;

async function navigate(root: FileSystemDirectoryHandle, path: string) {
  const paths = splitPath(path);

  let current: IHandle = root;

  let currentName: string | undefined;

  while ((currentName = paths.shift())) {
    if (paths.length) {
      if (current instanceof FileSystemDirectoryHandle) {
        current = await current.getDirectoryHandle(currentName);

        if (!(current instanceof FileSystemDirectoryHandle)) {
          throw new FilePathNotExistError(path);
        }
      } else {
        throw new FilePathNotExistError(path);
      }
    } else {
      try {
        return await current.getFileHandle(currentName);
      } catch (err) {
        try {
          return await current.getDirectoryHandle(currentName);
        } catch (err) {
          return false;
        }
      }
    }
  }

  return false;
}

async function createFile(
  parent: FileSystemDirectoryHandle,
  name: string,
  data?: FileData | string
) {
  const handle = await parent.getFileHandle(name, { create: true });

  if (!data) return handle;

  const fileSize = await getByteLength(data);
  if (!(await checkRemainingStorageSpace(fileSize))) {
    const { quota = 0, usage = 0 } = await getStorageUsage();
    throw new NotEnoughStorageSpaceError(fileSize, quota - usage);
  }

  const writeable = await handle.createWritable();
  await writeable.write(data);
  await writeable.close();
  return handle;
}

async function createDirectory(
  parent: FileSystemDirectoryHandle,
  name: string
) {
  return parent.getDirectoryHandle(name, { create: true });
}

interface DeleteOptions {
  permanentDelete?: boolean;
  deleteSelf?: boolean;
  children?: string[];
}

async function permanentDeleteFile(
  path: string,
  options: Omit<DeleteOptions, 'permanentDelete'>
) {
  const { deleteSelf, children } = options;

  if (deleteSelf) {
    const paths = splitPath(path);
    const name = paths.pop()!;
    const parent = await fileManager.get(paths.join(''));

    return (parent as FileSystemDirectoryHandle).removeEntry(name, {
      recursive: true
    });
  }

  if (children?.length) {
    const parent = (await fileManager.get(path)) as FileSystemDirectoryHandle;

    return Promise.all(
      children.map((child) => parent.removeEntry(child, { recursive: true }))
    );
  }
}
async function safeDeleteFile(
  path: string,
  options: Omit<DeleteOptions, 'permanentDelete'>
) {
  const { deleteSelf, children } = options;
  deleteSelf;
  children;

  const target = fileInfoManager.get(path);
  const size = calcDirectorySize(target);

  if (!(await checkRemainingStorageSpace(size))) {
    // Data in the space in the recycling station permanently
    await permanentDeleteFile('temp', { deleteSelf: false });

    if (!(await checkRemainingStorageSpace(size))) {
      const { quota = 0, usage = 0 } = await getStorageUsage();
      throw new NotEnoughStorageSpaceError(size, quota - usage);
    }
  }
}

class FileManager {
  private root!: FileSystemDirectoryHandle;

  constructor() {
    window.navigator.storage.getDirectory().then((handle) => {
      this.root = handle;
    });
  }

  async add(
    path: string,
    type: FileType | DirectoryType,
    data?: FileData | string
  ) {
    if (!this.root) return false;

    const paths = splitPath(path);

    const parent = await this.get(paths.join('/'));
    const name = paths.pop()!;

    if (!(parent instanceof FileSystemDirectoryHandle)) {
      throw new FileNotDirectoryError(paths.join('/'));
    }

    if (await navigate(this.root, path)) {
      throw new FileAlwaysExistError(name, paths.join('/'));
    }

    if (type === 0) return createFile(parent, name, data);
    else if (type === 1) return createDirectory(parent, name);
  }

  async delete(path: string, options: DeleteOptions) {
    const { permanentDelete = false, ...rest } = options;

    if (permanentDelete) {
      return permanentDeleteFile(path, rest);
    }

    return safeDeleteFile(path, rest);
  }

  // async update(path: string, data: any) {}

  async get(path: string) {
    if (path === '') {
      if (this.root) return this.root;

      throw new FilePathNotExistError(path);
    }

    const result = await navigate(this.root, path);
    if (!result) {
      const paths = splitPath(path);
      const name = paths.pop()!;

      throw new FileNotFoundError(paths.join('/'), name);
    }

    return result;
  }

  // async move(origin: string, target: string) {}
}

const fileManager = new FileManager();

export default fileManager;
