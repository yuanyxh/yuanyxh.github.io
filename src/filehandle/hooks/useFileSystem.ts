import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { cloneDeep } from 'lodash-es';

import { useUserStore } from '@/store';

import { AppContext } from '@/App';

import BackgroundManager from '../BackgroundManager';
import FileLinkedList from '../FileLinkedList';
import type { DH, FH, FileDataType, FileInfo } from '../utils/fileManager';
import {
  createDirectory,
  createFile,
  FileType,
  getChildren,
  remove as removeFile
} from '../utils/fileManager';

export interface FileHandle {
  id: string;
  ext: string;
  icon?: React.ReactNode;
  open(handler: FH, bgm: BackgroundManager): any;
  contextMenu?: {
    name: string;
    icon?: React.ReactNode;
    handler(handle: DH | FH, bgm: BackgroundManager): any;
  };
}

export interface FileSystem {
  current: DH;
  children: FileInfo[];
  fileLinked: FileLinkedList;
  fileHandles: FileHandle[];
  backgroundManager: BackgroundManager;
  create(name: string, type: FileType, data?: FileDataType): Promise<any>;
  remove(name: string): any;
  move(): void;
  register(handler: FileHandle): void;
  returnToRoot(): void;
  enterDirectory(file: FileInfo): any;
  forceUpdate(): any;
}

export function useFileSystem(): FileSystem {
  const { message } = useContext(AppContext);

  const { webdavs } = useUserStore();

  const root =
    useRef<DH>() as React.MutableRefObject<FileSystemDirectoryHandle>;
  const fileLinked =
    useRef<FileLinkedList>() as React.MutableRefObject<FileLinkedList>;
  const fileHandlesRef = useRef<FileHandle[]>([]);
  const backgroundManager = useRef(new BackgroundManager());

  const [current, setCurrent] = useState<DH>() as [
    DH,
    React.Dispatch<React.SetStateAction<DH>>
  ];
  const [children, setChildren] = useState<FileInfo[]>([]);

  const update = () => {
    if (!current) return;

    getChildren(current, root.current === current ? webdavs : void 0)
      .then((_children) => {
        setChildren([..._children]);
      })
      .catch((err) => {
        message.error((err as Error).message);
      });
  };

  useMemo(() => {
    if (!current) return void 0;

    update();
  }, [current, webdavs]);

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

  const fileSystem = useMemo(() => {
    function register(handler: FileHandle | FileHandle[]) {
      const handlers = Array.isArray(handler) ? handler : [handler];

      handlers.forEach((handler) => {
        if (fileHandlesRef.current.some((curr) => handler.id === curr.id)) {
          return false;
        }

        fileHandlesRef.current = [
          ...fileHandlesRef.current,
          cloneDeep(handler)
        ];
      });

      update();
    }

    function move() {}

    function remove(name: string) {
      removeFile(current, name)
        .then(() => {
          update();
        })
        .catch((err) => {
          message.error((err as Error).message);
        });
    }

    async function create(name: string, type: FileType, data?: FileDataType) {
      try {
        if (type === FileType.FILE) {
          await createFile(current, name, data);
        } else {
          await createDirectory(current, name);
        }

        update();
      } catch (err) {
        message.error((err as Error).message);
      }
    }

    function enterDirectory(file: FileInfo) {
      if (file.handle.kind === 'directory') {
        setCurrent(file.handle);
        fileLinked.current.inset(file.handle);
      }
    }

    function returnToRoot() {
      setCurrent(root.current);
      fileLinked.current = new FileLinkedList(root.current);
    }

    return {
      current,
      children,
      fileLinked: fileLinked.current,
      fileHandles: fileHandlesRef.current,
      backgroundManager: backgroundManager.current,
      register,
      returnToRoot,
      enterDirectory,
      move,
      remove,
      create,
      forceUpdate: update
    };
  }, [current, children, fileLinked.current, backgroundManager.current]);

  return fileSystem;
}
