import { useEffect } from 'react';

import { Button, Typography } from 'antd';

import { assetsLoadHandle, copy, serializeError, success, UnknownError } from '@/utils';

import { Icon } from '@/components';

import { ErrorState } from './ErrorBoundary';
import styles from './styles/Common.module.less';
import { useHistory } from '../hooks/useHistory';

interface IErrorProps {
  errorInfo?: ErrorState;
}

const ErrorCom: React.FC<IErrorProps> = (props) => {
  const { errorInfo: { hasError, error } = { hasError: true } } = props;

  const history = useHistory();

  useEffect(() => {
    // When rendering errors, we need to know that sending the error to the resource load processor
    hasError && assetsLoadHandle.emitRenderError();
  }, []);

  const handleReload = () => {
    history.go(0);
  };

  const handleCopyErrorInfo = () => {
    const errorInstance = error || new UnknownError();

    copy(serializeError(errorInstance)).then(() => {
      success('已为您复制错误信息。');
    });
  };

  return (
    <div className={styles.error}>
      <div>
        <Icon icon="error--in-site" size={'25vw'} />
      </div>

      <div>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 5, fontSize: 15 }}>
          当前页面有一些错误，
        </Typography.Paragraph>

        <Typography.Paragraph type="secondary" style={{ marginBottom: 5, fontSize: 15 }}>
          为保证您的体验，请前往{' '}
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
          <Button type="primary" onClick={handleReload}>
            重载页面
          </Button>

          <Button type="link" onClick={handleCopyErrorInfo}>
            复制错误信息
          </Button>
        </Typography.Paragraph>
      </div>
    </div>
  );
};

export default ErrorCom;
