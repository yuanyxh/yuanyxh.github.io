import { useCallback, useMemo, useState } from 'react';

import type { DH, FileDataType, FileInfo } from '../utils/fileManager';
import {
  createDirectory,
  createFile,
  FileType,
  getChildren
} from '../utils/fileManager';

interface FileSystem {
  create(name: string, type: FileType, data?: FileDataType): void;
  remove(): void;
  move(): void;
  register(): void;
}

export function useFileSystem(): [FileSystem, DH, FileInfo[]] {
  const [current, setCurrent] = useState<DH>() as [
    DH,
    React.Dispatch<React.SetStateAction<DH>>
  ];
  const [children, setChildren] = useState<FileInfo[]>([]);

  const update = useCallback(() => {
    getChildren(current).then((_children) => {
      setChildren(_children);
    });
  }, []);

  useMemo(() => {
    if (!current) return void 0;

    update();
  }, [current]);

  const fileSystem = useMemo(() => {
    function register() {}

    function move() {}

    function remove() {}

    async function create(name: string, type: FileType, data?: FileDataType) {
      if (type === FileType.FILE) {
        await createFile(current, name, data);
      } else {
        await createDirectory(current, name);
      }

      update();
    }

    window.navigator.storage.getDirectory().then((res) => {
      setCurrent(res);
    });

    return { register, move, remove, create };
  }, []);

  return [fileSystem, current, children];
}
