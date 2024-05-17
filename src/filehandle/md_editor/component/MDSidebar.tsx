import { useEffect, useMemo, useRef, useState } from 'react';

import type { InputProps } from 'antd';
import { Input, Layout, Spin } from 'antd';

import classNames from 'classnames';

import { error, uuid, validateFileName } from '@/utils';

import { isFileHandle } from '@/filehandle/utils/checkFileType';
import type { DH, FH, FileInfo } from '@/filehandle/utils/fileManager';
import {
  createDirectory,
  createFile,
  FileType,
  getChildren,
  remove
} from '@/filehandle/utils/fileManager';

import { ContextMenu, Icon } from '@/components';

import styles from './styles/MDSidebar.module.less';

interface ISidebarProps {
  handle: DH;
  changed: boolean;
  update(): void;
  onSelect(handle: FH): void;
  onRemove(handle: DH | FH): void;
}

interface ExtendFileInfo extends FileInfo {
  id: string;
  parent?: ExtendFileInfo;
  children?: ExtendFileInfo[];
}

const ADD_KEY = '.$<>/\\.#$%' + uuid();

const { Sider } = Layout;

function replaceAndSort(
  list: ExtendFileInfo[],
  info: ExtendFileInfo,
  id: string
) {
  const i = list.findIndex((l) => l.id === id);

  if (i !== -1) {
    list[i] = info;

    return list
      .filter((l) => l.type === FileType.DIRECTORY)
      .sort((a, b) => a.name.localeCompare(b.name))
      .concat(
        list
          .filter((l) => l.type === FileType.FILE)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
  }

  return list.map((l) => {
    if (l.children?.length) {
      l.children = replaceAndSort(l.children, info, id);
    }

    return l;
  });
}

function wrapperFileItem(
  parent: ExtendFileInfo,
  file: FileInfo
): ExtendFileInfo {
  return { ...file, id: uuid(), parent };
}

async function getDeepChildren(
  handle: DH,
  parent?: ExtendFileInfo
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
      .filter(
        (value) => value.type === FileType.DIRECTORY || value.ext === '.md'
      )
      .map(async (child) => {
        const newChild = wrapperFileItem(parent, child);
        if (child.handle.kind === 'directory') {
          newChild.children = await getDeepChildren(child.handle, newChild);
        }

        return newChild;
      })
  );

  parent.children = newChildren;

  return newChildren;
}

function AddFileInput({
  file,
  names,
  replace,
  removeInput
}: {
  file: ExtendFileInfo;
  names: string[];
  replace(info: ExtendFileInfo, id: string): any;
  removeInput(id: string): any;
}) {
  const DEFAULT_NAME = 'default';

  const isAddFile = file.type === FileType.FILE;

  const [inputStatus, setInputStatus] = useState<{
    name: string;
    status: InputProps['status'];
  }>({ name: '', status: '' });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (!validateFileName(value) || names.some((n) => n === value)) {
      return setInputStatus({ name: value, status: 'error' });
    }

    setInputStatus({ name: value, status: '' });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toLocaleLowerCase() !== 'enter') {
      return void 0;
    }

    handleAdd();
  };

  const handleAdd = async () => {
    const reg = new RegExp(`(?<=default)\\d*(?=${isAddFile ? '.md' : ''})`);

    let name = inputStatus.name;
    if (inputStatus.name === '' || inputStatus.status !== '') {
      const max = names
        .map((n) => n.match(reg))
        .filter(Boolean)
        .map(Number)
        .sort((a, b) => a - b)
        .pop();

      if (typeof max === 'number') name = DEFAULT_NAME + (max + 1);
      else name = DEFAULT_NAME;
    }

    if (isAddFile) name += '.md';

    if (file.handle.kind === 'directory') {
      try {
        setLoading(true);

        const handle = await (isAddFile ? createFile : createDirectory)(
          file.handle,
          name
        );

        replace(
          {
            id: uuid(),
            name,
            type: file.type,
            handle,
            icon: '',
            parent: file.parent
          },
          file.id
        );
      } catch (err) {
        error((err as Error).message);
        removeInput(file.id);
      } finally {
        setLoading(false);
      }
    } else {
      removeInput(file.id);
    }
  };

  return (
    <Spin spinning={loading}>
      <Input
        name="add-mdfile-input"
        style={{ marginLeft: 8 }}
        autoFocus
        size="small"
        value={inputStatus.name}
        status={inputStatus.status}
        suffix={isAddFile ? '.md' : void 0}
        onChange={handleInputChange}
        onContextMenuCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onKeyUp={handleKeyUp}
        onBlur={handleAdd}
      />
    </Spin>
  );
}

function Menu({
  activeId,
  changed,
  items,
  replace,
  removeInput,
  onItemClick,
  onItemContextMenu
}: {
  activeId: string;
  changed: boolean;
  items: ExtendFileInfo[];
  replace(info: ExtendFileInfo, id: string): any;
  removeInput(id: string): any;
  onItemClick: (file: ExtendFileInfo) => void;
  onItemContextMenu: (file: ExtendFileInfo) => void;
}) {
  const [expands, setExpands] = useState<string[]>([]);

  useEffect(() => {
    const finded = items.find((item) =>
      item.children?.some((file) => file.name === ADD_KEY)
    );

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
              onClick={(e) => e.preventDefault()}
              title={item.name}
              onContextMenu={(e) => {
                e.stopPropagation();
                onItemContextMenu(item);
              }}
            >
              <div
                className={classNames(styles.row, {
                  [styles.active]:
                    activeId === item.id && !expands.includes(activeId),
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
              onItemClick={onItemClick}
              onItemContextMenu={onItemContextMenu}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const insetFile = (children: ExtendFileInfo[], child: ExtendFileInfo) => {
  if (child.type === FileType.DIRECTORY) {
    const i = children.findIndex((c) => c.type !== FileType.DIRECTORY);

    i === -1 ? children.push(child) : children.splice(i, 0, child);
  } else {
    children.push(child);
  }
};

export const Sidebar: React.FC<Readonly<ISidebarProps>> = (props) => {
  const { handle, changed, update, onSelect, onRemove } = props;

  const [list, setList] = useState<ExtendFileInfo[]>([]);
  const [activeId, setActiveId] = useState('');

  const [selection, setSelection] = useState<ExtendFileInfo[]>([]);

  const queryingRef = useRef(false);
  const siderRef = useRef<HTMLDivElement>(null);

  useMemo(() => {
    if (queryingRef.current) {
      return void 0;
    }

    queryingRef.current = true;
    getDeepChildren(handle)
      .then((list) => {
        setList(list);
      })
      .catch((err) => {
        error((err as Error).message);
      })
      .finally(() => {
        queryingRef.current = false;
      });
  }, [handle]);

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

  const handleDeleteFile = async () => {
    const curr = selection[0];
    if (curr) {
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
              icon: (
                <Icon
                  icon="material-symbols-light--folder"
                  color="var(--color-primary)"
                />
              ),
              onClick: handleAddDirectory
            },
            {
              name: '删除',
              icon: (
                <Icon
                  icon="material-symbols--delete"
                  color="var(--color-primary)"
                />
              ),
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
