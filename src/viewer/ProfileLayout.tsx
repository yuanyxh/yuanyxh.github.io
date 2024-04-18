import { Layout, Menu } from 'antd';

import { Outlet, useHistory, useLocation } from '@/router';

import profileSiderbarData from './data/profileSidebar.json';

const { Content, Sider } = Layout;

const Settings = () => {
  const history = useHistory();
  const location = useLocation();

  const handleNavigate = ({ key }: { key: string }) => {
    history.push(key);
  };

  return (
    <Layout
      style={{
        backgroundColor: 'var(--background-color)',
        height: '100%'
      }}
    >
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[location!.path]}
          style={{ height: '100%' }}
          items={profileSiderbarData}
          onClick={handleNavigate}
        />
      </Sider>

      <Content
        style={{
          height: '100%',
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: 'inherit'
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default Settings;
