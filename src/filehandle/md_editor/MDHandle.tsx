import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Dialog } from '@/components';

import MDEditor from './component/MDEditor';
import styles from './styles/MDHandle.module.less';
import { DH, FH } from '../utils/fileManager';

interface IMDHandle {
  handle: DH | FH;
  destroy(): void;
}

interface IMDContentProps {
  handle: DH | FH;
}

interface ISideProps {
  handle: DH;
}

interface IEditorProps {
  markdown: string;
}

const Side: React.FC<Readonly<ISideProps>> = (/* props */) => {
  // const { handle } = props;

  useEffect(() => {}, []);

  return <div>Side</div>;
};

const Editor: React.FC<Readonly<IEditorProps>> = (props) => {
  const { markdown } = props;

  return (
    <div className={styles.mdEditor}>
      <MDEditor markdown={markdown} />
    </div>
  );
};

const getMarkdown = async (handle: FH) => {
  return handle.getFile().then((file) => file.text());
};

const MDContent: React.FC<Readonly<IMDContentProps>> = (props) => {
  const { handle } = props;

  const [markdown, setMarkdown] = useState('');
  const [currentHandle, setCurrentHandle] = useState<FH | null>(null);

  useEffect(() => {
    if (handle instanceof FileSystemFileHandle) {
      setCurrentHandle(handle);
    }
  }, []);

  useMemo(() => {
    currentHandle &&
      getMarkdown(currentHandle).then((text) => {
        setMarkdown(text);
      });
  }, [currentHandle]);

  return (
    <>
      {handle instanceof FileSystemDirectoryHandle ? (
        <Side handle={handle} />
      ) : null}

      <Editor markdown={markdown} />
    </>
  );
};

const MDHandle: React.FC<IMDHandle> = (props) => {
  const { handle, destroy } = props;

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
      <MDContent handle={handle} />
    </Dialog>
  );
};

export default MDHandle;
