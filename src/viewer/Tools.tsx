import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';

import type { ResolveRouteObject } from '@/router';
import { Outlet, useHistory, useLocation } from '@/router';

import { useTools } from './hooks/useTools';

type MenuItem = Required<MenuProps>['items'][number];

const siderStyle: React.CSSProperties = {
  overflow: 'visible auto',
  height: 'calc(100vh - var(--navbar-height))',
  position: 'fixed',
  insetInlineStart: 0,
  top: 'var(--navbar-height)',
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarColor: 'unset'
};

const wrapperToolItem = (tools: ResolveRouteObject[]): MenuItem[] => {
  return tools.map((tool) => ({ label: tool.path.slice(0, -5), key: tool.fullPath }));
};

const Tools: React.FC = () => {
  const tools = useTools();

  const router = useHistory();
  const location = useLocation();

  return (
    <div>
      <Layout.Sider width={250} style={siderStyle}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.path]}
          items={wrapperToolItem(tools)}
          onClick={(e) => {
            router.push(e.key);
          }}
        />
      </Layout.Sider>

      <div style={{ paddingLeft: 250, height: 'calc(100vh - var(--navbar-height))' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Tools;
