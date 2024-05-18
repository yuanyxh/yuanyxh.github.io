import { Spin } from 'antd';

import styles from './loading.module.less';

const Loading: React.FC = () => {
  return (
    <div className={styles.loadingWrapper}>
      <Spin className={styles.loading} delay={150} />
    </div>
  );
};

export default Loading;
