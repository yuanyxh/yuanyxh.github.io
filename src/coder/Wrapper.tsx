import { useEffect, useMemo, useState } from 'react';

import { Card, Layout } from 'antd';

import { cloneDeep } from 'lodash-es';

import { findRouteByPath, getChildrenById, Outlet, useLocation, useRoutes } from '@/router';

import { Examples_ID } from '@/viewer/hooks/useExamples';

import { Menu, transformMenu } from '@/coder/CodeMenu';
import styles from '@/coder/styles/Wrapper.module.less';

import Exhibit from '@/examples/base64_coder/Index';

import { Icon } from '@/components';

export default function Wrapper() {
  const [title, setTitle] = useState('');
  const [openCode, setOpenCode] = useState(false);
  const [openExhibit, setOpenExhibit] = useState(true);

  const routes = useRoutes();
  const location = useLocation();

  const menu = useMemo(() => {
    const codes = getChildrenById(routes, Examples_ID);

    const curr = location.path.replace('/coder/', '').split('/').shift();

    return transformMenu(cloneDeep(codes.find((code) => code.path === curr)!.children!));
  }, []);

  useEffect(() => {
    const route = findRouteByPath(routes, location.path);

    if (route?.meta?.title) {
      setTitle(route.meta.title);
    }
  }, []);

  const handleTriggerCodeOpen = () => {
    setOpenCode((v) => !v);
  };

  const handleTriggerCodeExhibit = () => {
    setOpenExhibit((v) => !v);
  };

  return (
    <Layout className={styles.wrapper}>
      <section className={styles.exhibit} style={{ display: openExhibit ? undefined : 'none' }}>
        <Card
          title={title}
          extra={
            <Icon
              className="icon-btn"
              icon="ant-design--code-outlined"
              title="显示代码"
              size={20}
              onClick={handleTriggerCodeOpen}
            />
          }
        >
          <Exhibit />
        </Card>
      </section>

      <section className={styles.codeWrapper} style={{ display: openCode ? undefined : 'none' }}>
        <Layout.Sider className={styles.sider}>
          <div className={styles.codeController}>
            <Icon
              className="icon-btn"
              color="#d9d9d9"
              icon="ic--twotone-width-full"
              title="代码区全屏切换"
              size={20}
              onClick={handleTriggerCodeExhibit}
            />
          </div>
          <Menu items={menu} />
        </Layout.Sider>

        <div className={styles.codeShow}>
          <Outlet />
        </div>
      </section>
    </Layout>
  );
}
