import { memo, useMemo, useState } from 'react';

import { Drawer, FloatButton, Form, Layout, Radio } from 'antd';

import { cloneDeep } from 'lodash-es';
import classNames from 'classnames';

import type { ResolveRouteObject } from '@/router';
import { Outlet, useHistory, useLocation, useRoutes } from '@/router';

import styles from '@/coder/styles/Wrapper.module.less';

import Default from '@/examples/base64_coder/Index';

import { Icon } from '@/components';

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

function transformMenu(routes: ResolveRouteObject[]) {
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

const { Sider } = Layout;

function Menu({ items }: { items: IMenu[] }) {
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

const Exhibit = memo(function Exhibit() {
  return (
    <section className={styles.exhibit}>
      <Default />
    </section>
  );
});

type FieldType = {
  distribution: number;
};

export default function Wrapper() {
  const routes = useRoutes();
  const location = useLocation();
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [layoutId, setLayoutId] = useState(0);

  const menu = useMemo(() => {
    const codes = routes?.[1].children || [];

    const curr = location.path.replace('/coder/', '').split('/').shift()!;

    return transformMenu(cloneDeep(codes.find((code) => code.path === curr)!.children!));
  }, []);

  const handleChangeLayout = (e: number) => {
    setLayoutId(e);
  };

  const handleBack = () => {
    history.back();
  };

  return (
    <Layout className={styles.wrapper}>
      <Sider className={styles.sider} theme="dark">
        <Menu items={menu} />
      </Sider>

      <main
        className={classNames(styles.content, {
          [styles.codearea]: layoutId === 1,
          [styles.examplearea]: layoutId === 2
        })}
      >
        <section className={styles.code}>
          <Outlet />
        </section>

        <Exhibit />
      </main>

      <Drawer title="Settings" onClose={() => setOpen(false)} open={open}>
        <Form
          name="settings"
          layout="horizontal"
          style={{ maxWidth: 600 }}
          initialValues={{ distribution: 0 }}
          autoComplete="off"
        >
          <Form.Item<FieldType> label="布局" name="distribution">
            <Radio.Group onChange={(e) => handleChangeLayout(e.target.value)}>
              <Radio.Button value={0}>左右布局</Radio.Button>
              <Radio.Button value={1}>代码区</Radio.Button>
              <Radio.Button value={2}>示例区</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>

      <FloatButton.Group>
        <FloatButton
          aria-label="settings"
          icon={<Icon icon="material-symbols:settings" />}
          onClick={() => setOpen(true)}
        />
        <FloatButton
          aria-label="back"
          icon={<Icon icon="typcn--arrow-back" />}
          onClick={handleBack}
        />
      </FloatButton.Group>
    </Layout>
  );
}
