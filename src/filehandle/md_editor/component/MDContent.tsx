import { useEffect, useMemo, useState } from 'react';

import type { DH, FH } from '@/filehandle/utils/fileManager';

import MDEditor from './MDEditor';
import { Sidebar } from './MDSidebar';
import styles from './styles/MDContent.module.less';

const getMarkdown = async (handle: FH) => {
  return handle.getFile().then((file) => file.text());
};

interface IMDContentProps {
  handle: DH | FH;
}

export const MDContent: React.FC<Readonly<IMDContentProps>> = (props) => {
  const { handle } = props;

  const [markdown, setMarkdown] = useState('');
  const [currentHandle, setCurrentHandle] = useState<FH | null>(null);

  useMemo(() => {
    currentHandle &&
      getMarkdown(currentHandle).then((text) => {
        setMarkdown(text);
      });
  }, [currentHandle]);

  useEffect(() => {
    if (handle instanceof FileSystemFileHandle) {
      setCurrentHandle(handle);
    }
  }, []);

  const handleSelect = (handle: FH) => {
    setCurrentHandle(handle);
  };

  const handleSave = (md: string) => {
    md;
  };

  return (
    <div className={styles.content}>
      {handle instanceof FileSystemDirectoryHandle ? (
        <Sidebar handle={handle} onSelect={handleSelect} />
      ) : null}

      <div className={styles.mdEditor}>
        <MDEditor markdown={markdown} onSave={handleSave} />
      </div>
    </div>
  );
};
