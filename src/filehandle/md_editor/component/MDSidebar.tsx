import { useMemo, useState } from 'react';

import { App, Layout } from 'antd';

import classNames from 'classnames';

import { uuid } from '@/utils';

import type { DH, FH } from '@/filehandle/utils/fileManager';
import {
  FileInfo,
  FileType,
  getChildren,
  getHandle
} from '@/filehandle/utils/fileManager';

import { Icon } from '@/components';

import styles from './styles/MDSidebar.module.less';

interface ISidebarProps {
  handle: DH;
  changed: boolean;
  onSelect(handle: FH): void;
}

interface ExtendFileInfo extends FileInfo {
  id: string;
  children?: ExtendFileInfo[];
}

const { Sider } = Layout;

function wrapperFileItem(file: FileInfo): ExtendFileInfo {
  return { ...file, id: uuid() };
}

async function getDeepChildren(handle: DH): Promise<ExtendFileInfo[]> {
  const children = await getChildren(handle);

  return Promise.all(
    children
      .filter(
        (value) => value.type === FileType.DIRECTORY || value.ext === '.md'
      )
      .map(async (child) => {
        const newChild = wrapperFileItem(child);
        if (child.type === FileType.DIRECTORY) {
          newChild.children = await getDeepChildren(
            (await getHandle(handle, child.name)) as DH
          );
        }

        return newChild;
      })
  );
}

function Menu({
  activeId,
  changed,
  items,
  onItemClick
}: {
  activeId: string;
  changed: boolean;
  items: ExtendFileInfo[];
  onItemClick: (file: ExtendFileInfo) => void;
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
          <a href="/" onClick={(e) => e.preventDefault()} title={item.name}>
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

          {item.children ? (
            <Menu
              items={item.children}
              activeId={activeId}
              changed={changed}
              onItemClick={onItemClick}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export const Sidebar: React.FC<Readonly<ISidebarProps>> = (props) => {
  const { handle, changed, onSelect } = props;

  const { message } = App.useApp();

  const [list, setList] = useState<ExtendFileInfo[]>([]);
  const [activeId, setActiveId] = useState('');

  useMemo(() => {
    getDeepChildren(handle)
      .then((list) => {
        setList(list);
      })
      .catch((err) => {
        message.error((err as Error).message);
      });
  }, [handle]);

  const handleSelect = (file: ExtendFileInfo) => {
    if (file.handle instanceof FileSystemFileHandle) {
      onSelect(file.handle);
      setActiveId(file.id);
    }
  };

  return (
    <Sider className={styles.sidebar} width={250}>
      <Menu
        items={list}
        changed={changed}
        activeId={activeId}
        onItemClick={handleSelect}
      />
    </Sider>
  );
};