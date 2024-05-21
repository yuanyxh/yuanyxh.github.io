import { useEffect, useMemo, useRef, useState } from 'react';

import { Layout } from 'antd';

import classNames from 'classnames';

import { error, uuid } from '@/utils';

import { ContextMenu, Icon } from '@/components';

import AddFileInput from './AddFileInput';
import styles from './styles/FileSideMenu.module.less';
import { isFileHandle } from '../utils/checkFileType';
import type { DH, FH, FileInfo } from '../utils/fileManager';
import { FileType, getChildren, getFileInfo, move, remove } from '../utils/fileManager';
import { fileOperationWarning } from '../utils/operationWarning';

export interface ExtendFileInfo extends FileInfo {
  id: string;
  parent?: ExtendFileInfo;
  children?: ExtendFileInfo[];
}

const ADD_KEY = '.$<>/\\.#$%' + uuid();

const { Sider } = Layout;

function replaceAndSort(list: ExtendFileInfo[], info: ExtendFileInfo, id: string) {
  const i = list.findIndex((l) => l.id === id);

  if (i !== -1) {
    list[i] = info;

    return list
      .filter((l) => l.type === FileType.DIRECTORY)
      .sort((a, b) => a.name.localeCompare(b.name))
      .concat(
        list.filter((l) => l.type === FileType.FILE).sort((a, b) => a.name.localeCompare(b.name))
      );
  }

  return list.map((l) => {
    if (l.children?.length) {
      l.children = replaceAndSort(l.children, info, id);
    }

    return l;
  });
}

function getExtendFileInfo(parent: ExtendFileInfo, file: FileInfo): ExtendFileInfo {
  return { ...file, id: uuid(), parent };
}

function isSelect(file: FileInfo, exts?: string[]) {
  if (!exts || exts.length === 0) {
    return true;
  }

  if (!file.ext) return false;

  return exts.includes(file.ext);
}

async function getDeepChildren(
  handle: DH,
  parent?: ExtendFileInfo,
  exts?: string[]
): Promise<ExtendFileInfo[]> {
  parent = parent || {
    id: uuid(),
    name: handle.name,
    type: FileType.DIRECTORY,
    icon: '',
    handle
  };

  const children = await getChildren(handle);

  const newChildren = await Promise.all(
    children
      .filter((value) => value.type === FileType.DIRECTORY || isSelect(value, exts))
      .map(async (child) => {
        const newChild = getExtendFileInfo(parent, child);

        if (child.handle.kind === 'directory') {
          newChild.children = await getDeepChildren(child.handle, newChild, exts);
        }

        return newChild;
      })
  );

  parent.children = newChildren;

  return newChildren;
}

const insetFile = (children: ExtendFileInfo[], child: ExtendFileInfo) => {
  if (child.type === FileType.DIRECTORY) {
    const i = children.findIndex((c) => c.type !== FileType.DIRECTORY);

    i === -1 ? children.push(child) : children.splice(i, 0, child);
  } else {
    children.push(child);
  }
};

function canDrop(dragdata: ExtendFileInfo, target_id: string): boolean {
  if (dragdata.id === target_id) return false;

  if (!dragdata.children?.length) return true;

  function some(children: ExtendFileInfo[] = [], id: string): boolean {
    return children.some((child) => {
      if (child.children?.length) {
        return some(child.children, id);
      }

      return false;
    });
  }

  return some(dragdata.children, target_id);
}

let dragdata: ExtendFileInfo | null = null;

function Menu({
  activeId,
  changed,
  items,
  replace,
  removeInput,
  moveItem,
  onItemClick,
  onItemContextMenu
}: {
  activeId: string;
  changed: boolean;
  items: ExtendFileInfo[];
  replace(info: ExtendFileInfo, id: string): any;
  removeInput(id: string): any;
  moveItem(target: ExtendFileInfo, item: ExtendFileInfo): any;
  onItemClick: (file: ExtendFileInfo) => void;
  onItemContextMenu: (file: ExtendFileInfo) => void;
}) {
  const [expands, setExpands] = useState<string[]>([]);

  useEffect(() => {
    const finded = items.find((item) => item.children?.some((file) => file.name === ADD_KEY));

    if (finded && !expands.some((expand) => expand === finded.id)) {
      handleSetExpands(finded.id);
    }
  }, [items]);

  const handleSetExpands = (key: string) => {
    setExpands((prev) => {
      if (prev.includes(key)) {
        return prev.filter((path) => path !== key);
      }

      return [...prev, key];
    });
  };

  const handleSwitchFile = (file: ExtendFileInfo) => {
    onItemClick(file);
  };

  const handleDropFile = (target: ExtendFileInfo) => {
    const _dragdata = dragdata;

    if (
      !_dragdata ||
      !_dragdata.parent ||
      _dragdata.parent.handle.kind === 'file' ||
      target.handle.kind === 'file' ||
      !canDrop(_dragdata, target.id)
    ) {
      return void 0;
    }

    fileOperationWarning({
      title: `您确认要将以下文件移动至 ${target.name} 吗？`,
      list: [_dragdata.name],
      async onOk() {
        try {
          await move(_dragdata.parent!.handle as DH, target.handle as DH, {
            names: [_dragdata.name],
            copy: false
          });

          moveItem(target, _dragdata);

          if (expands.includes(target.id)) {
            handleSetExpands(target.id);
          }
        } catch (err) {
          error((err as Error).message);
        }
      }
    });
  };

  return (
    <ul className={styles.list} onClick={(e) => e.stopPropagation()}>
      {items.map((item) => (
        <li
          key={item.id}
          className={classNames(styles.item, {
            [styles.expand]: expands.includes(item.id)
          })}
        >
          {item.name === ADD_KEY ? (
            <AddFileInput
              file={item}
              names={items.map((c) => c.name)}
              replace={replace}
              removeInput={removeInput}
            />
          ) : (
            <a
              href="/"
              style={{ position: 'relative' }}
              onClick={(e) => e.preventDefault()}
              title={item.name}
              onContextMenu={(e) => {
                e.stopPropagation();
                onItemContextMenu(item);
              }}
              onDragStart={(e) => {
                e.stopPropagation();
                dragdata = item;
              }}
              onDragEnd={(e) => {
                e.stopPropagation();
                dragdata = null;
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.stopPropagation();
                handleDropFile(item);
              }}
            >
              <div
                className={classNames(styles.row, {
                  [styles.active]: activeId === item.id && !expands.includes(activeId),
                  [styles.directory]: item.type === FileType.DIRECTORY,
                  [styles.changed]: changed
                })}
                onClick={
                  item.type === FileType.DIRECTORY
                    ? () => handleSetExpands(item.id)
                    : () => handleSwitchFile(item)
                }
              >
                {item.type === FileType.DIRECTORY ? (
                  <Icon
                    className={classNames(styles.directoryIcon, {
                      [styles.expand]: expands.includes(item.id)
                    })}
                    icon="material-symbols:keyboard-arrow-right"
                  />
                ) : null}

                <span>{item.name}</span>
              </div>
            </a>
          )}

          {item.children ? (
            <Menu
              items={item.children}
              activeId={activeId}
              changed={changed}
              replace={replace}
              removeInput={removeInput}
              moveItem={moveItem}
              onItemClick={onItemClick}
              onItemContextMenu={onItemContextMenu}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

interface IFileSideMenuProps {
  handle: DH;
  changed: boolean;
  exts?: string[];
  update(): void;
  onSelect(handle: FH): void;
  onRemove(handle: DH | FH): void;
}

const FileSideMenu: React.FC<Readonly<IFileSideMenuProps>> = (props) => {
  const { handle, changed, exts, update, onSelect, onRemove } = props;

  const [list, setList] = useState<ExtendFileInfo[]>([]);
  const [activeId, setActiveId] = useState('');

  const [selection, setSelection] = useState<ExtendFileInfo[]>([]);

  const queryingRef = useRef(false);
  const siderRef = useRef<HTMLDivElement>(null);

  useMemo(() => {
    getList();
  }, [handle]);

  function getList() {
    if (queryingRef.current) {
      return void 0;
    }

    queryingRef.current = true;
    getDeepChildren(handle, void 0, exts)
      .then((list) => {
        setList(list);
      })
      .catch((err) => {
        error((err as Error).message);
      })
      .finally(() => {
        queryingRef.current = false;
      });
  }

  const addExtendFileInfo = (type: FileType) => {
    const curr = selection[0];

    const child = { name: ADD_KEY, id: uuid(), icon: '', type };

    if (curr && curr.type === FileType.DIRECTORY) {
      insetFile(curr.children || (curr.children = []), {
        ...child,
        handle: curr.handle,
        parent: curr
      });
    } else if (curr && curr.parent) {
      const parent = curr.parent;
      insetFile(parent.children || (parent.children = []), {
        ...child,
        handle: parent.handle,
        parent: parent
      });
    } else {
      insetFile(list, {
        ...child,
        handle,
        parent: list[0]?.parent || {
          id: uuid(),
          name: handle.name,
          type: FileType.DIRECTORY,
          icon: '',
          handle
        }
      });
    }

    setList([...list]);
  };

  function filter(_list: ExtendFileInfo[], id: string) {
    return _list.filter((item) => {
      if (item.id !== id) {
        if (item.children?.length) {
          item.children = filter(item.children, id);
        }
        return true;
      }

      return false;
    });
  }

  function replace(info: ExtendFileInfo, id: string) {
    setList([...replaceAndSort(list, info, id)]);

    if (info.handle.kind === 'file') {
      onSelect(info.handle);
      setActiveId(info.id);
    }

    update();
  }

  const removeInput = (id: string) => setList(filter(list, id));

  const moveItem = async (target: ExtendFileInfo, item: ExtendFileInfo) => {
    if (target.handle.kind === 'directory') {
      removeInput(item.id);

      try {
        const newHandle = await (
          item.type === FileType.DIRECTORY
            ? target.handle.getDirectoryHandle
            : target.handle.getFileHandle
        )(item.name);

        insetFile(
          target.children || (target.children = []),
          getExtendFileInfo(target, await getFileInfo(newHandle, newHandle.name))
        );
      } catch (err) {
        error((err as Error).message);
      }
    }
  };

  const handleSelect = (file: ExtendFileInfo) => {
    if (isFileHandle(file.handle)) {
      onSelect(file.handle);
      setActiveId(file.id);
    }
  };

  const handleHide = () => selection.length && setSelection([]);

  const handleContextMenu = (file: ExtendFileInfo) => setSelection([file]);

  const handleAddFile = () => addExtendFileInfo(FileType.FILE);

  const handleAddDirectory = () => addExtendFileInfo(FileType.DIRECTORY);

  const handleDeleteFile = () => {
    const curr = selection[0];

    curr &&
      fileOperationWarning({
        title: '您确认要删除以下文件吗？',
        list: [curr.name],
        async onOk() {
          const dh = curr.parent?.handle || handle;

          if (dh.kind === 'directory') {
            try {
              await remove(dh, curr.name);
              setList(filter(list, curr.id));

              onRemove(curr.handle);
              update();
            } catch (err) {
              error((err as Error).message);
            }
          }
        }
      });
  };

  return (
    <>
      <Sider ref={siderRef} className={styles.sidebar} width={250}>
        <div className={styles.scrollbar}>
          <Menu
            items={list}
            changed={changed}
            activeId={activeId}
            replace={replace}
            removeInput={removeInput}
            moveItem={moveItem}
            onItemClick={handleSelect}
            onItemContextMenu={handleContextMenu}
          />
        </div>

        <ContextMenu
          getContainer={() => siderRef.current!}
          getBindElement={() => siderRef.current!}
          onHide={handleHide}
          menu={[
            {
              name: '新建文件',
              icon: <Icon icon="ph--file-fill" color="var(--color-primary)" />,
              onClick: handleAddFile
            },
            {
              name: '新建文件夹',
              icon: <Icon icon="material-symbols-light--folder" color="var(--color-primary)" />,
              onClick: handleAddDirectory
            },
            {
              name: '删除',
              icon: <Icon icon="material-symbols--delete" color="var(--color-primary)" />,
              style: {
                display: selection.length === 0 ? 'none' : void 0
              },
              onClick: handleDeleteFile
            }
          ]}
        />
      </Sider>
    </>
  );
};

export default FileSideMenu;
