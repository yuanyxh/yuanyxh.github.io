import { useEffect, useId, /* useId, */ useRef, useState } from 'react';

import type BackgroundManager from '@/filehandle/BackgroundManager';

import { Dialog, Icon } from '@/components';

import { MDContent } from './MDContent';
import styles from './styles/MDHandle.module.less';
import type { DH, FH } from '../../utils/fileManager';

export interface IMDHandle {
  handle: DH | FH;
  backgroundManager: BackgroundManager;
  destroy(): void;
  update(): void;
}

const MDHandle: React.FC<IMDHandle> = (props) => {
  const { handle, backgroundManager, update, destroy } = props;

  const handleId = useId();

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
    backgroundManager.removeBackground(handleId);

    setOpen(false);
    destroyRef.current = true;
  };

  const handleMinimize = () => {
    setOpen(false);

    backgroundManager.bringToBackground({
      id: handleId,
      icon: <Icon icon="bxs--file-md" color="var(--color-primary)" />,
      open: () => {
        setOpen(true);
        backgroundManager.removeBackground(handleId);
      }
    });
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
      onMinimize={handleMinimize}
      onClose={onClose}
    >
      <MDContent handle={handle} update={update} />
    </Dialog>
  );
};

export default MDHandle;
