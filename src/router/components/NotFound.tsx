import { Button, Typography } from 'antd';

import { Icon } from '@/components';

import styles from './styles/Common.module.less';
import { useHistory } from '../hooks/useHistory';

const NotFound: React.FC = () => {
  const history = useHistory();

  const handleBack = () => {
    history.replace('/');
  };

  return (
    <div className={styles.error}>
      <div>
        <Icon icon="page-not-found" size={'25vw'} />

        <Typography.Paragraph type="secondary">
          Free Page Not Found Illustration By&nbsp;
          <Typography.Link
            type="danger"
            target="_blank"
            rel="external nofollow noopener"
            href="https://iconscout.com/contributors/iconscout"
          >
            IconScout Store
          </Typography.Link>
        </Typography.Paragraph>
      </div>

      <div>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 5, fontSize: 15 }}>
          您访问了一个不存在的页面，
        </Typography.Paragraph>

        <Typography.Paragraph type="secondary" style={{ marginBottom: 5, fontSize: 15 }}>
          如果这是一个错误请前往{' '}
          <Typography.Link
            type="danger"
            target="_blank"
            href="https://github.com/yuanyxh/yuanyxh.github.io/issues/new"
          >
            Github
          </Typography.Link>
          &nbsp;反馈。
        </Typography.Paragraph>

        <Typography.Paragraph style={{ marginTop: 20 }}>
          <Button type="primary" onClick={handleBack}>
            返回首页
          </Button>
        </Typography.Paragraph>
      </div>
    </div>
  );
};

export default NotFound;
