import { useEffect, /* useId, */ useRef, useState } from 'react';

import { App } from 'antd';

import { Dialog } from '@/components';

import { MDContent } from './MDContent';
import styles from './styles/MDHandle.module.less';
// import type BackgroundManager from '../../backgroundManager';
import type { DH, FH } from '../../utils/fileManager';

interface IMDHandle {
  handle: DH | FH;
  // backgroundManager: BackgroundManager;
  destroy(): void;
}

const MDHandle: React.FC<IMDHandle> = (props) => {
  // const handleId = useId();

  const { handle, /* backgroundManager, */ destroy } = props;

  const [open, setOpen] = useState(false);
  const initialRef = useRef(false);
  const destroyRef = useRef(false);

  useEffect(() => {
    if (!initialRef.current) {
      setOpen(true);
      initialRef.current = true;
    }
  }, []);

  const onClose = () => {
    setOpen(false);
    destroyRef.current = true;
  };

  const onAnimationEnd = () => {
    if (destroyRef.current) {
      destroy();
    }
  };

  return (
    <Dialog
      className={styles.mdHandle}
      open={open}
      draggable={false}
      onAnimationEnd={onAnimationEnd}
      onMinimize={() => setOpen(false)}
      onClose={onClose}
    >
      <App>
        <MDContent handle={handle} />
      </App>
    </Dialog>
  );
};

export default MDHandle;
