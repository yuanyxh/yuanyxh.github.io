import { useEffect, useMemo, useRef, useState } from 'react';

import { confirm, error } from '@/utils';

import {
  isDirectoryHandle,
  isFileHandle
} from '@/filehandle/utils/checkFileType';
import type { DH, FH } from '@/filehandle/utils/fileManager';
import { writeFile } from '@/filehandle/utils/fileManager';

import type { IMDEditorExpose } from './MDEditor';
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
  const [changed, setChanged] = useState(false);
  const [currentHandle, setCurrentHandle] = useState<FH | null>(null);

  const editorRef = useRef<IMDEditorExpose>(null);

  useMemo(() => {
    currentHandle &&
      getMarkdown(currentHandle).then((text) => {
        setMarkdown(text);
      });
  }, [currentHandle]);

  useEffect(() => {
    if (isFileHandle(handle)) {
      setCurrentHandle(handle);
    }
  }, []);

  const handleSelect = (handle: FH) => {
    if (!changed) return setCurrentHandle(handle);

    confirm({
      title: '温馨提示',
      content: '是否保存更改？如果不保存，您的更改会丢失。',
      okText: '保存',
      cancelText: '放弃更改',
      onOk() {
        if (currentHandle && editorRef.current) {
          writeFile(currentHandle, editorRef.current.getMarkdown())
            .then(() => {
              setCurrentHandle(handle);
            })
            .catch((err) => {
              error((err as Error).message);
            });
        }
      },
      onCancel() {
        setCurrentHandle(handle);
      }
    });
  };

  const handleSetChanged = (changed: boolean) => {
    setChanged(changed);
  };

  const handleSave = (md: string) => {
    if (currentHandle) {
      writeFile(currentHandle, md)
        .then(() => {
          setChanged(false);
        })
        .catch((err) => {
          error((err as Error).message);
        });
    }
  };

  return (
    <div className={styles.content}>
      {isDirectoryHandle(handle) ? (
        <Sidebar handle={handle} changed={changed} onSelect={handleSelect} />
      ) : null}

      <div className={styles.mdEditor}>
        <MDEditor
          ref={editorRef}
          markdown={markdown}
          changed={changed}
          onChanged={handleSetChanged}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};
