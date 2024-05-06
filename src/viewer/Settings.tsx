import { useContext, useEffect, useRef, useState } from 'react';

import { Card, Col, Row, Spin, Switch, Typography } from 'antd';

import { useAppStore } from '@/store';

import {
  hasPermission,
  requestNotifyPermission,
  ServiceWorkerManager
} from '@/utils';

import { getStorageUsage } from '@/filehandle';

import type { CanvasInstance } from '@/components';
import { Canvas } from '@/components';

import { AppContext } from '@/App';

import styles from './styles/Settings.module.less';

const { Paragraph, Text } = Typography;

const isLocal = import.meta.env.PROD === false;

function ServiceWorkerCache() {
  const { message } = useContext(AppContext);

  const {
    settings: { enableServiceWorkerCache },
    setEnableServiceWorkerCache
  } = useAppStore();

  const [spinning, setSpinning] = useState(false);

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
        })
        .catch((err) => {
          message.error((err as Error).message);
        });
    }

    serviceWorkerRef.current
      .unregisterServiceWorker()
      .then((uninstalled) => {
        setSpinning(false);
        uninstalled && setEnableServiceWorkerCache(enableServiceWorkerCache);

        const info = uninstalled
          ? '已为您禁用 service worker 缓存'
          : '无法禁用 service worker 缓存，您可联系作者反馈。';

        message[uninstalled ? 'success' : 'error'](info);
      })
      .catch((err) => {
        message.error((err as Error).message);
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
  const { message } = useContext(AppContext);

  const {
    settings: { enableNotification },
    setEnableNotification
  } = useAppStore();

  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    hasPermission('notifications')
      .then((value) => {
        setEnableNotification(value);
      })
      .catch((err) => {
        message.error((err as Error).message);
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
      .catch((err) => {
        message.error((err as Error).message);
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

function PersistentStorage() {
  const { message } = useContext(AppContext);
  const [enablePersistent, setEnablePersistentStorage] = useState(false);

  const handleEnablePersistent = (enablePersistent: boolean) => {
    if (enablePersistent) {
      window.navigator?.storage
        .persist()
        .then((persistent) => {
          setEnablePersistentStorage(persistent);

          if (!persistent) {
            message.error('暂无法获取持久化存储权限。');
          }
        })
        .catch((err) => {
          message.error((err as Error).message);

          setEnablePersistentStorage(false);
        });
    }
  };

  useEffect(() => {
    window.navigator?.storage
      .persisted()
      .then((persistent) => {
        setEnablePersistentStorage(persistent);
      })
      .catch((err) => {
        message.error((err as Error).message);
      });
  }, []);

  return (
    <Row className={styles.row} gutter={20} align={'middle'}>
      <Col span={21}>
        <h5 className={styles.subTitle}>持久化存储</h5>

        <Paragraph type="danger">
          <Text type="secondary">
            默认情况下，浏览器对于 Storage
            存储的数据采用的策略是尽力而为的，这意味着在您的存储空间不足时，浏览器会通过指定的算法进行清理，您可以开启此选项以改变浏览器的默认策略。
          </Text>
          注意，此选项是一次性的，如果您需要关闭，请前往浏览器设置并重置本站权限。
        </Paragraph>
      </Col>

      <Col span={3} style={{ textAlign: 'center' }}>
        <Switch
          disabled={enablePersistent}
          value={enablePersistent}
          onChange={handleEnablePersistent}
        />
      </Col>
    </Row>
  );
}

function StorageDetail() {
  const { message } = useContext(AppContext);

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
    getStorageUsage()
      .then((res) => {
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
        const unUsageAngle =
          Math.PI * 2 * ((res.quota - res.usage) / res.quota);

        const drawEl = drawRef.current!;

        const centerX = drawEl.width() / 2;
        const centerY = drawEl.height() / 2;

        drawEl.arc(centerX, centerY, centerX - 2, 0, Math.PI * 2);
        drawEl.strokeStyle('#f0f0f0');
        drawEl.stroke();

        drawEl.beginPath();
        drawEl.moveTo(centerX, centerY);
        drawEl.arc(centerX, centerY, centerX - 2, 0, usageAngle);
        drawEl.fillStyle('#ff9759');
        drawEl.fill();

        drawEl.beginPath();
        drawEl.moveTo(centerX, centerY);
        drawEl.arc(
          centerX,
          centerY,
          centerX - 2,
          usageAngle,
          usageAngle + unUsageAngle
        );
        drawEl.fillStyle('white');
        drawEl.fill();
      })
      .catch((err) => {
        message.error((err as Error).message);
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

      <PersistentStorage />
    </Card>
  );
};

export default Settings;
