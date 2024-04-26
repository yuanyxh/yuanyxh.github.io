import { useContext, useEffect, useRef, useState } from 'react';

import { Card, Col, Row, Spin, Switch, Typography } from 'antd';

import { useAppStore } from '@/store';

import {
  hasPermission,
  requestNotifyPermission,
  ServiceWorkerManager
} from '@/utils';

import { Canvas, CanvasInstance } from '@/components';

import styles from './styles/Settings.module.less';
import { AppContext } from '@/App';

const { Paragraph, Text } = Typography;

const isLocal = import.meta.env.PROD === false;

function ServiceWorkerCache() {
  const {
    settings: { enableServiceWorkerCache },
    setEnableServiceWorkerCache
  } = useAppStore();

  const [spinning, setSpinning] = useState(false);
  const { message } = useContext(AppContext);
  const serviceWorkerRef = useRef(new ServiceWorkerManager());

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

          message[installed ? 'success' : 'error'](info);
        });
    }

    serviceWorkerRef.current.unregisterServiceWorker().then((uninstalled) => {
      setSpinning(false);
      uninstalled && setEnableServiceWorkerCache(enableServiceWorkerCache);

      const info = uninstalled
        ? '已为您禁用 service worker 缓存'
        : '无法禁用 service worker 缓存，您可联系作者反馈。';

      message[uninstalled ? 'success' : 'error'](info);
    });
  };

  return (
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
  );
}

function WebNotification() {
  const {
    settings: { enableNotification },
    setEnableNotification
  } = useAppStore();

  const [spinning, setSpinning] = useState(false);
  const { message } = useContext(AppContext);

  useEffect(() => {
    hasPermission('notifications').then((value) => {
      setEnableNotification(value);
    });
  }, []);

  const handleSwitchWebNotification = (enableNotification: boolean) => {
    if (!enableNotification) {
      return setEnableNotification(false);
    }

    setSpinning(true);
    requestNotifyPermission()
      .then((e) => {
        if (e === 'cancel' || e === 'reject') {
          message.error('无法获取通知权限。');
          return false;
        }

        if (e === 'allow') {
          setEnableNotification(true);
          return true;
        }
      })
      .finally(() => {
        setSpinning(false);
      });
  };

  return (
    <Spin spinning={spinning}>
      <Row className={styles.row} gutter={20} align={'middle'}>
        <Col span={21}>
          <h5 className={styles.subTitle}>网站通知</h5>

          <Paragraph type="secondary">
            开启后，在您暂时离开本站时，如有消息通知，会使用应用程序（基本上，这应该是浏览器）的通知提醒您。此功能依赖于应用程序，您需要允许应用程序的通知权限。
          </Paragraph>
        </Col>

        <Col span={3} style={{ textAlign: 'center' }}>
          <Switch
            value={enableNotification}
            onChange={handleSwitchWebNotification}
          />
        </Col>
      </Row>
    </Spin>
  );
}

function StorageDetail() {
  const drawRef = useRef<CanvasInstance>(null);
  const [storage, setStorage] = useState<{
    quota: number;
    usage: number;
    unUsage: number;
  }>({
    unUsage: 0,
    usage: 0,
    quota: 0
  });

  useEffect(() => {
    window.navigator.storage.estimate().then((res) => {
      if (!(typeof res.quota === 'number' && typeof res.usage === 'number')) {
        return false;
      }

      const { quota, usage } = res;
      const unUsage = quota - usage;

      setStorage({
        quota: quota / 1000 / 1000,
        usage: usage / 1000 / 1000,
        unUsage: unUsage / 1000 / 1000
      });

      const usageAngle = Math.PI * 2 * (res.usage / res.quota);
      const unUsageAngle = Math.PI * 2 * ((res.quota - res.usage) / res.quota);

      const centerX = drawRef.current!.width() / 2;
      const centerY = drawRef.current!.height() / 2;

      drawRef.current!.arc(centerX, centerY, centerX - 2, 0, Math.PI * 2);
      drawRef.current!.strokeStyle('#f0f0f0');
      drawRef.current!.stroke();

      drawRef.current!.beginPath();
      drawRef.current!.moveTo(centerX, centerY);
      drawRef.current!.arc(centerX, centerY, centerX - 2, 0, usageAngle);
      drawRef.current!.fillStyle('#ff9759');
      drawRef.current!.fill();

      drawRef.current!.beginPath();
      drawRef.current!.moveTo(centerX, centerY);
      drawRef.current!.arc(
        centerX,
        centerY,
        centerX - 2,
        usageAngle,
        usageAngle + unUsageAngle
      );
      drawRef.current!.fillStyle('white');
      drawRef.current!.fill();
    });
  }, []);

  return (
    <Row className={styles.row} gutter={20} align={'middle'}>
      <Col span={24}>
        <h5 className={styles.subTitle}>网站存储详情</h5>

        <div style={{ display: 'flex', gap: '0 30px', marginBlock: 10 }}>
          <Canvas ref={drawRef} width={120} height={120} />

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px 0' }}
          >
            <div className={styles.line}>
              <span
                className={styles.symbol}
                style={{ backgroundColor: 'white' }}
              ></span>

              <Text type="secondary">总可用存储</Text>

              <Text>{storage.quota.toFixed(3)} MB</Text>
            </div>

            <div className={styles.line}>
              <span
                className={styles.symbol}
                style={{ backgroundColor: '#ff9759' }}
              ></span>

              <Text type="secondary">已用存储</Text>

              <Text>{storage.usage.toFixed(3)} MB</Text>
            </div>

            <div className={styles.line}>
              <span
                className={styles.symbol}
                style={{ backgroundColor: '#601986' }}
              ></span>

              <Text type="secondary">剩余可用</Text>
              <Text>{storage.unUsage.toFixed(3)} MB</Text>
            </div>
          </div>
        </div>

        <Paragraph type="secondary">
          通过 Web API
          获取网站可用的存储配额及已用的存储空间，此方式获得的数据是估值，不是精确的存储数据。
          该数据反映的是快照值，而不是及时更新的。
        </Paragraph>
      </Col>
    </Row>
  );
}

const Settings = () => {
  return (
    <Card className={styles.settings} title="网站设置">
      <ServiceWorkerCache />

      <StorageDetail />

      <WebNotification />
    </Card>
  );
};

export default Settings;
