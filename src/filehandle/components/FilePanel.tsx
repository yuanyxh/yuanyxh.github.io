import React, { createContext, useRef } from 'react';

import { Dialog, IDialogExpose, IDialogProps } from '@/components';

import FileContent from './FileContent';
import FileLocation from './FileLocation';
import type { FileSystem } from '../hooks/useFileSystem';
import { useFileSystem } from '../hooks/useFileSystem';

export const FileSystemContext = createContext({} as FileSystem);

const FilePanel: React.FC<Readonly<IDialogProps>> = function FilePanel(props) {
  const { onClose, ...rest } = props;

  const dialogRef = useRef<IDialogExpose>(null);
  const fileSystem = useFileSystem();

  return (
    <FileSystemContext.Provider value={fileSystem}>
      <Dialog
        ref={dialogRef}
        {...rest}
        onClose={() => {
          onClose?.();
          fileSystem.returnToRoot();
        }}
      >
        <FileLocation />

        <FileContent getContainer={() => dialogRef.current!.dialog!} />
      </Dialog>
    </FileSystemContext.Provider>
  );
};

export default FilePanel;
