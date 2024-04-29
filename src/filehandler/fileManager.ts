import {
  FileAlwaysExistError,
  FileNotDirectoryError,
  FileNotFoundError,
  FilePathNotExistError,
  NotEnoughStorageSpaceError
} from './error';
import type { DirectoryType, FileType } from './fileInfoManager';
import {
  checkRemainingStorageSpace,
  getByteLength,
  getStorageUsage
} from './utils/getStorageUsage';

export type IHandle = FileSystemFileHandle | FileSystemDirectoryHandle;

export type FileData = ArrayBuffer | Blob;

const splitPath = (path: string) => path.split('/');

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
  options: Omit<DeleteOptions, 'permanentDelete'>
) {
  options;
}

async function safeDeleteFile(options: Omit<DeleteOptions, 'permanentDelete'>) {
  options;
}

async function deleteFile(path: string, options: DeleteOptions) {
  const { permanentDelete = false, deleteSelf = true, children } = options;

  if (permanentDelete) {
    return permanentDeleteFile({ deleteSelf, children });
  }

  return safeDeleteFile({ deleteSelf, children });
}
deleteFile;

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
    let parent: IHandle;
    let name: string;
    if (paths.length === 1) {
      parent = this.root;
      name = paths[0];
    } else {
      name = paths.pop()!;
      parent = await this.get(paths.join('/'));
    }

    if (!(parent instanceof FileSystemDirectoryHandle)) {
      throw new FileNotDirectoryError(paths.join('/'));
    }

    if (await navigate(this.root, path)) {
      throw new FileAlwaysExistError(name);
    }

    if (type === 0) return createFile(parent, name, data);
    else if (type === 1) return createDirectory(parent, name);
  }

  // async delete(path: string) {}

  // async update(path: string, data: any) {}

  async get(path: string) {
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
