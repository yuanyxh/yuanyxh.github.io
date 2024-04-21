import { Spin } from 'antd';

import styles from './loading.module.less';

const Loading = () => {
  return (
    <div className={styles.loadingWrapper}>
      <Spin className={styles.loading} delay={150} />
    </div>
  );
};

export default Loading;
