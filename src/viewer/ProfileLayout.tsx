import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';

import { Outlet, useHistory, useLocation } from '@/router';

import { useAppStore } from '@/store';

import profileNavbarData from './data/profileNavbar.json';
import profileSiderbarData from './data/profileSidebar.json';

const { Content, Sider, Header } = Layout;

const ProfileLayout = () => {
  const history = useHistory();
  const location = useLocation();

  const {
    status: { isSmallScreen }
  } = useAppStore();

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
      {!isSmallScreen ? (
        <Sider
          collapsedWidth={0}
          zeroWidthTriggerStyle={{ backgroundColor: 'var(--color-primary)' }}
          width={250}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={[location.path]}
            style={{ height: '100%' }}
            items={profileSiderbarData as MenuProps['items']}
            onClick={handleNavigate}
          />
        </Sider>
      ) : (
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--background-color)'
          }}
        >
          <Menu
            mode="horizontal"
            items={profileNavbarData as MenuProps['items']}
            onClick={handleNavigate}
          />
        </Header>
      )}

      <Content
        style={{
          height: '100%',
          overflowY: 'auto',
          padding: '24px 24px 24px 40px',
          backgroundColor: 'inherit'
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default ProfileLayout;
