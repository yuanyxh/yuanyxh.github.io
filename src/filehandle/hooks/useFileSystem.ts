import { useEffect, useMemo, useRef, useState } from 'react';

import { cloneDeep } from 'lodash-es';

import { useUserStore } from '@/store';

import { error, warning } from '@/utils';

import BackgroundManager from '../BackgroundManager';
import FileLinkedList from '../FileLinkedList';
import type { IMDHandle } from '../md_editor/component/MDHandle';
import type { DH, FH, FileDataType, FileInfo } from '../utils/fileManager';
import {
  createDirectory,
  createFile,
  FileType,
  getChildren,
  importDirectory as importDH,
  importFile as importFH,
  remove as removeFile
} from '../utils/fileManager';

export interface FileHandle {
  id: string;
  ext: string;
  icon?: React.ReactNode;
  open(handler: FH, props: Omit<IMDHandle, 'destroy' | 'handle'>): any;
  contextMenu?: {
    name: string;
    icon?: React.ReactNode;
    handler(handle: DH | FH, props: Omit<IMDHandle, 'destroy' | 'handle'>): any;
  };
}

export interface FileSystem {
  /** current folder */
  current: DH;
  /** current folder index */
  children: FileInfo[];
  /** history */
  fileLinked: FileLinkedList;
  /** file processing program list */
  fileHandles: FileHandle[];
  /** Background manager */
  backgroundManager: BackgroundManager;
  /** During the operation, blocking user operation is generally used for remote files */
  isBusy: boolean;
  create(name: string, type: FileType, data?: FileDataType): Promise<any>;
  remove(name: string): any;
  move(): void;
  importFile(): Promise<any>;
  importDirectory(): Promise<any>;
  register(handler: FileHandle): void;
  returnToRoot(): void;
  enterDirectory(file: FileInfo): any;
  forceUpdate(): any;
}

export function useFileSystem(): FileSystem {
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

  const [isBusy, setBusy] = useState(false);

  const update = async (handle?: DH, cb?: () => void) => {
    const target = handle || current;

    if (target) {
      try {
        setBusy(true);

        const children = await getChildren(
          target,
          root.current === target ? webdavs : void 0
        );

        setCurrent(target);
        setChildren(children);

        cb && cb();
      } catch (err) {
        error((err as Error).message);
      } finally {
        setBusy(false);
      }
    }
  };

  useMemo(() => update(), [webdavs]);

  useEffect(
    () => fileLinked.current?.listener((directory) => update(directory)),
    [fileLinked.current, webdavs]
  );

  useEffect(() => {
    window.navigator.storage
      .getDirectory()
      .then((_root) => {
        root.current = _root;
        fileLinked.current = new FileLinkedList(_root);

        update(_root);
      })
      .catch((err) => {
        error((err as Error).message);
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

      setChildren([...children]);
    }

    async function move() {}

    async function remove(name: string) {
      try {
        await removeFile(current, name);

        setChildren(
          children.filter((c) => {
            if (c.name === name && c.handle.kind === 'directory') {
              fileLinked.current.unlink(c.handle);
            }

            return c.name !== name;
          })
        );
      } catch (err) {
        error((err as Error).message);
      }
    }

    async function create(name: string, type: FileType, data?: FileDataType) {
      try {
        await (type === FileType.FILE
          ? createFile(current, name, data)
          : createDirectory(current, name));

        update();
      } catch (err) {
        error((err as Error).message);
      }
    }

    async function importFile() {
      try {
        setBusy(true);
        const value = await importFH(current);

        if (!value) {
          return warning('暂无法导入文件');
        }

        update();
      } catch (err) {
        error((err as Error).message);
      } finally {
        setBusy(false);
      }
    }

    async function importDirectory() {
      try {
        setBusy(true);
        const value = await importDH(current);

        if (!value) {
          return warning('暂无法导入文件夹');
        }

        update();
      } catch (err) {
        error((err as Error).message);

        error('本次导入存在异常，请确认目录是否导入完整。');

        // When the user executes multiple file operations, even if an abnormality occurs,
        // the directory list should be updated to tell the user that some file operation fails
        update();
      } finally {
        setBusy(false);
      }
    }

    function enterDirectory(file: FileInfo) {
      if (file.handle.kind === 'directory') {
        update(file.handle, () => fileLinked.current.inset(file.handle as DH));
      }
    }

    function returnToRoot() {
      update(
        root.current,
        () => (fileLinked.current = new FileLinkedList(root.current))
      );
    }

    return {
      current,
      children,
      isBusy,
      fileLinked: fileLinked.current,
      fileHandles: fileHandlesRef.current,
      backgroundManager: backgroundManager.current,
      register,
      returnToRoot,
      enterDirectory,
      move,
      remove,
      create,
      importFile,
      importDirectory,
      forceUpdate: update
    };
  }, [
    current,
    children,
    webdavs,
    fileLinked.current,
    backgroundManager.current,
    isBusy
  ]);

  return fileSystem;
}
