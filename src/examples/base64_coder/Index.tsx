//--meta:
// title: base64 编解码
// date: 2024-4-21 16:54:00
// author: yuanyxh
// description: js 实现的 base64 示例，帮助理解 base64 是如何工作的
//--endmeta

import { useState } from 'react';

import { Layout } from 'antd';

import classNames from 'classnames';

import type { ResolveRouteObject } from '@/router';
import { Outlet, useHistory, useRoute } from '@/router';

import { Icon } from '@/components';

import styles from './Index.module.less';

export function Base64_Coder() {
  return <div className={styles.base64}></div>;
}

const { Sider } = Layout;

function Menu({ items }: { items: ResolveRouteObject[] }) {
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
            [styles.expand]: expands.includes(item.fullPath)
          })}
        >
          <div
            className={styles.row}
            onClick={
              item.children
                ? () => handleSetExpands(item.fullPath)
                : () => handleSwitchFile(item.fullPath)
            }
          >
            {item.children ? (
              <Icon
                className={styles.directoryIcon}
                icon="material-symbols:keyboard-arrow-right"
              />
            ) : null}
            <span>{item.path}</span>
          </div>

          {item.children ? <Menu items={item.children} /> : null}
        </li>
      ))}
    </ul>
  );
}

export default function Wrapper() {
  const route = useRoute();

  const codes = route?.[1].children?.[1].children || [];

  return (
    <Layout className={styles.wrapper}>
      <Sider className={styles.sider} theme="dark">
        <Menu items={codes} />
      </Sider>

      <main className={styles.content}>
        <section className={styles.code}>
          <Outlet />
        </section>

        <section className={styles.exhibit}></section>
      </main>
    </Layout>
  );
}
