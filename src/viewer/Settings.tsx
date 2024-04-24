import { Row, Space, Switch, Typography } from 'antd';

const Settings = () => {
  return (
    <section>
      <Typography.Title level={5}>Cache</Typography.Title>

      <Row>
        <Space>
          <Typography.Text>禁用离线缓存：</Typography.Text>

          <Switch />
        </Space>
      </Row>
    </section>
  );
};

export default Settings;
