import { useRef, useState } from 'react';

import { Card, Col, message, Row, Spin, Switch, Typography } from 'antd';

import { useAppStore } from '@/store';

import { ServiceWorkerManager } from '@/utils';

import styles from './styles/Settings.module.less';

const { Paragraph } = Typography;

const isLocal = import.meta.env.PROD === false;

function ServiceWorkerCache() {
  const {
    settings: { enableServiceWorkerCache },
    setEnableServiceWorkerCache
  } = useAppStore();

  const [spinning, setSpinning] = useState(false);
  const serviceWorkerRef = useRef(new ServiceWorkerManager());
  const [messageApi, contextHolder] = message.useMessage();

  const handleSwitchServiceWorkerCache = (
    enableServiceWorkerCache: boolean
  ) => {
    setSpinning(true);

    if (enableServiceWorkerCache) {
      return serviceWorkerRef.current
        .registerServiceWorker()
        .then((installed) => {
          setSpinning(false);
          installed && setEnableServiceWorkerCache(enableServiceWorkerCache);

          const info = installed
            ? '已为您启用 service worker 缓存'
            : '无法启用 service worker 缓存，您可联系作者反馈。';

          messageApi[installed ? 'success' : 'error'](info);
        });
    }

    serviceWorkerRef.current.unregisterServiceWorker().then((uninstalled) => {
      setSpinning(false);
      uninstalled && setEnableServiceWorkerCache(enableServiceWorkerCache);

      const info = uninstalled
        ? '已为您禁用 service worker 缓存'
        : '无法禁用 service worker 缓存，您可联系作者反馈。';

      messageApi[uninstalled ? 'success' : 'error'](info);
    });
  };

  return (
    <>
      {contextHolder}

      <Spin spinning={spinning}>
        <Row className={styles.row} gutter={20} align={'middle'}>
          <Col span={21}>
            <h5 className={styles.subTitle}>离线缓存</h5>

            <Paragraph type="danger">
              注意，当您禁用离线缓存时，我们会将所有已下载的离线资源删除，并卸载
              service
              worker，这意味着后续所有资源都会经过网络，并且无法离线访问本站点。
            </Paragraph>
          </Col>

          <Col span={3} style={{ textAlign: 'center' }}>
            <Switch
              disabled={isLocal}
              value={enableServiceWorkerCache}
              onChange={handleSwitchServiceWorkerCache}
            />
          </Col>
        </Row>
      </Spin>
    </>
  );
}

const Settings = () => {
  return (
    <Card className={styles.settings} title="网站设置">
      <ServiceWorkerCache />
    </Card>
  );
};

export default Settings;
