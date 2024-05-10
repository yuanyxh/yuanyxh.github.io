import { useMemo, useRef, useState } from 'react';

import { Input, Layout } from 'antd';

import classNames from 'classnames';

import { error, uuid } from '@/utils';

import { isFileHandle } from '@/filehandle/utils/checkFileType';
import type { DH, FH } from '@/filehandle/utils/fileManager';
import {
  FileInfo,
  FileType,
  getChildren
} from '@/filehandle/utils/fileManager';

import { ContextMenu, Icon } from '@/components';

import styles from './styles/MDSidebar.module.less';

interface ISidebarProps {
  handle: DH;
  changed: boolean;
  onSelect(handle: FH): void;
}

type ExtendFileInfo = FileInfo & {
  id: string;
  parent?: ExtendFileInfo;
  children?: ExtendFileInfo[];
};

const ADD_KEY = '.$<>/\\.#$%' + uuid();

const { Sider } = Layout;

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

  return Promise.all(
    children
      .filter(
        (value) => value.type === FileType.DIRECTORY || value.ext === '.md'
      )
      .map(async (child) => {
        const newChild = wrapperFileItem(parent, child);
        if (child.type === FileType.DIRECTORY) {
          newChild.children = await getDeepChildren(
            child.handle as DH,
            newChild
          );
        }

        return newChild;
      })
  );
}

function AddFileInput({ file }: { file: ExtendFileInfo }) {
  const DEFAULT_NAME = 'default';
  const handleAdd = () => {};

  file;
  DEFAULT_NAME;

  return (
    <Input
      autoFocus
      size="small"
      onContextMenuCapture={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onKeyUp={handleAdd}
      onBlur={handleAdd}
    />
  );
}

function Menu({
  activeId,
  changed,
  items,
  onItemClick,
  onItemContextMenu
}: {
  activeId: string;
  changed: boolean;
  items: ExtendFileInfo[];
  onItemClick: (file: ExtendFileInfo) => void;
  onItemContextMenu: (file: ExtendFileInfo) => void;
}) {
  const [expands, setExpands] = useState<string[]>([]);

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
            <AddFileInput file={item} />
          ) : (
            <a
              href="/"
              onClick={(e) => e.preventDefault()}
              title={item.name}
              onContextMenu={() => {
                onItemContextMenu(item);
              }}
            >
              <div
                className={classNames(styles.row, {
                  [styles.active]:
                    activeId === item.id && !expands.includes(activeId),
                  [styles.directory]: item.children,
                  [styles.changed]: changed
                })}
                onClick={
                  item.children
                    ? () => handleSetExpands(item.id)
                    : () => handleSwitchFile(item)
                }
              >
                {item.children ? (
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
              onItemClick={onItemClick}
              onItemContextMenu={onItemContextMenu}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export const Sidebar: React.FC<Readonly<ISidebarProps>> = (props) => {
  const { handle, changed, onSelect } = props;

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

  const handleSelect = (file: ExtendFileInfo) => {
    if (isFileHandle(file.handle)) {
      onSelect(file.handle);
      setActiveId(file.id);
    }
  };

  const handleHide = () => {
    selection.length && setSelection([]);
  };

  const handleContextMenu = (file: ExtendFileInfo) => {
    setSelection([file]);
  };

  const addExtendFileInfo = (type: FileType) => {
    const curr = selection[0];

    const child = { name: ADD_KEY, id: uuid(), icon: '' };

    if (curr && curr.type === FileType.DIRECTORY) {
      (curr.children || (curr.children = [])).unshift({
        ...child,
        handle: curr.handle,
        type
      });
    } else if (curr && curr.parent) {
      const parent = curr.parent;
      (parent.children || (parent.children = [])).unshift({
        ...child,
        handle: parent.handle,
        type
      });
    } else {
      list.unshift({
        ...child,
        handle,
        type
      });
    }

    setList([...list]);
  };

  const handleAddFile = () => {
    addExtendFileInfo(FileType.FILE);
  };

  const handleAddDirectory = () => {
    addExtendFileInfo(FileType.DIRECTORY);
  };

  const handleDeleteFile = () => {};

  return (
    <>
      <Sider ref={siderRef} className={styles.sidebar} width={250}>
        <div className={styles.scrollbar}>
          <Menu
            items={list}
            changed={changed}
            activeId={activeId}
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
