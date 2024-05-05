import { useEffect, useMemo, useRef, useState } from 'react';

import { cloneDeep } from 'lodash-es';

import FileLinkedList from '../FileLinkedList';
import type { DH, FH, FileDataType, FileInfo } from '../utils/fileManager';
import {
  createDirectory,
  createFile,
  FileType,
  getChildren,
  getHandle,
  remove as removeFile
} from '../utils/fileManager';

export interface FileHandle {
  id: string;
  ext: string;
  icon?: React.ReactNode;
  open(handler: FH): any;
  contextMenu?: {
    name: string;
    icon?: React.ReactNode;
    handler(handle: DH | FH): any;
  };
}

export interface FileSystem {
  current: DH;
  children: FileInfo[];
  fileLinked: FileLinkedList;
  fileHandles: FileHandle[];
  create(name: string, type: FileType, data?: FileDataType): Promise<any>;
  remove(name: string): Promise<any>;
  move(): void;
  register(handler: FileHandle): void;
  returnToRoot(): void;
  enterDirectory(name: string): Promise<any>;
  forceUpdate(): any;
}

export function useFileSystem(): FileSystem {
  const root =
    useRef<DH>() as React.MutableRefObject<FileSystemDirectoryHandle>;
  const fileLinked =
    useRef<FileLinkedList>() as React.MutableRefObject<FileLinkedList>;

  const [current, setCurrent] = useState<DH>() as [
    DH,
    React.Dispatch<React.SetStateAction<DH>>
  ];
  const [children, setChildren] = useState<FileInfo[]>([]);
  const fileHandleRef = useRef<FileHandle[]>([]);

  const update = () => {
    if (!current) return;

    getChildren(current).then((_children) => {
      setChildren(_children);
    });
  };

  useMemo(() => {
    if (!current) return void 0;

    update();
  }, [current]);

  const fileSystem = useMemo(() => {
    function register(handler: FileHandle) {
      if (fileHandleRef.current.some((curr) => handler.id === curr.id)) {
        return false;
      }

      fileHandleRef.current.push(cloneDeep(handler));
    }

    function move() {}

    async function remove(name: string) {
      await removeFile(current, name);

      update();
    }

    async function create(name: string, type: FileType, data?: FileDataType) {
      if (type === FileType.FILE) {
        await createFile(current, name, data);
      } else {
        await createDirectory(current, name);
      }

      update();
    }

    async function enterDirectory(name: string) {
      getHandle(current, name).then((res) => {
        if (res.kind === 'directory') {
          setCurrent(res);
          fileLinked.current.inset(res);
        }
      });
    }

    function returnToRoot() {
      setCurrent(root.current);
      fileLinked.current = new FileLinkedList(root.current);
    }

    return {
      current,
      children,
      fileLinked: fileLinked.current,
      fileHandles: fileHandleRef.current,
      register,
      returnToRoot,
      enterDirectory,
      move,
      remove,
      create,
      forceUpdate: update
    };
  }, [current, children, fileLinked.current]);

  useMemo(() => {
    if (!fileLinked.current) return;

    return fileLinked.current.listener((directory) => {
      setCurrent(directory);
    });
  }, [fileLinked.current]);

  useEffect(() => {
    window.navigator.storage.getDirectory().then((res) => {
      setCurrent(res);
      root.current = res;
      fileLinked.current = new FileLinkedList(res);
    });
  }, []);

  return fileSystem;
}
