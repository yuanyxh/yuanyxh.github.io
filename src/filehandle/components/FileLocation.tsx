import { useContext } from 'react';

import classNames from 'classnames';

import { Icon } from '@/components';

import { FileSystemContext } from './FilePanel';
import styles from './styles/FileLocation.module.less';

interface IFileLocationProps {}

const FileLocation: React.FC<Readonly<IFileLocationProps>> = () => {
  const { fileLinked } = useContext(FileSystemContext);

  return (
    <div className={styles.fileLocation}>
      <div className={styles.history}>
        <Icon
          className={classNames(styles.fallback, {
            [styles.disabled]: !fileLinked?.current.fallback
          })}
          icon="solar--arrow-left-linear"
          onClick={() => fileLinked.fallback()}
        />
        <Icon
          className={classNames(styles.next, {
            [styles.disabled]: !fileLinked?.current.next
          })}
          icon="solar--arrow-right-linear"
          onClick={() => fileLinked.next()}
        />
      </div>
    </div>
  );
};

export default FileLocation;
