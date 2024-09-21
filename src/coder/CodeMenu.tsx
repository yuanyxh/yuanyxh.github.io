import { useState } from 'react';

import classNames from 'classnames';

import type { ResolveRouteObject } from '@/router';
import { useHistory, useLocation } from '@/router';

import { Icon } from '@/components';

import styles from './styles/CodeMenu.module.less';

interface IMenu {
  path: string;
  fullPath: string;
  children?: IMenu[];
}

function mergeMenu(menu: IMenu[]) {
  let curr: IMenu | undefined;

  const result: IMenu[] = [];
  while ((curr = menu.shift())) {
    const some = menu.filter((item) => item.path === curr!.path);

    for (let i = 0; i < some.length; i++) {
      curr.children = [...(curr.children || []), ...(some[i].children || [])];

      curr.children = curr.children.length ? mergeMenu(curr.children) : undefined;
    }

    result.push(curr);

    menu = menu.filter((item) => item.path !== curr!.path);
  }

  result.sort((a, b) => {
    const _a = Number(!!a.children);
    const _b = Number(!!b.children);

    return _b - _a;
  });

  return result;
}

export function transformMenu(routes: ResolveRouteObject[]) {
  const values = routes.map((route) => {
    if (route.path.includes('-')) {
      const seqs = route.path.split('-');

      let seq = seqs.shift();

      const root: IMenu = { path: seq!, fullPath: route.fullPath };

      let current = root;

      while ((seq = seqs.shift())) {
        const child = { path: seq, fullPath: route.fullPath };
        current.children = [child];

        current = child;
      }

      return root;
    }

    return { path: route.path, fullPath: route.fullPath };
  });

  return mergeMenu(values);
}

export function Menu({ items }: { items: IMenu[] }) {
  const location = useLocation();

  const [expands, setExpands] = useState<string[]>([]);

  const history = useHistory();

  const handleSetExpands = (key: string) => {
    setExpands((prev) => {
      if (prev.includes(key)) {
        return prev.filter((path) => path !== key);
      }

      return [...prev, key];
    });
  };

  const handleSwitchFile = (path: string) => {
    history.replace(path);
  };

  return (
    <ul className={styles.list} onClick={(e) => e.stopPropagation()}>
      {items.map((item) => (
        <li
          key={item.fullPath}
          className={classNames(styles.item, {
            [styles.expand]: expands.includes(item.fullPath + item.path)
          })}
        >
          <a href={item.fullPath} onClick={(e) => e.preventDefault()} title={item.path}>
            <div
              className={classNames(styles.row, {
                [styles.active]:
                  location.path === item.fullPath && !expands.includes(item.fullPath + item.path),
                [styles.directory]: item.children
              })}
              onClick={
                item.children
                  ? () => handleSetExpands(item.fullPath + item.path)
                  : () => handleSwitchFile(item.fullPath)
              }
            >
              {item.children ? (
                <Icon
                  className={classNames(styles.directoryIcon, {
                    [styles.expand]: expands.includes(item.fullPath + item.path)
                  })}
                  icon="material-symbols:keyboard-arrow-right"
                />
              ) : null}
              <span>{item.path}</span>
            </div>
          </a>

          {item.children ? <Menu items={item.children} /> : null}
        </li>
      ))}
    </ul>
  );
}
