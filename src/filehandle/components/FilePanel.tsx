import React, { createContext, useEffect, useRef } from 'react';

import type { IDialogExpose, IDialogProps } from '@/components';
import { Dialog } from '@/components';

import BackgroundMenu from './BackgroundMenu';
import FileContent from './FileContent';
import FileLocation from './FileLocation';
import type { FileSystem } from '../hooks/useFileSystem';
import { useFileSystem } from '../hooks/useFileSystem';
import mdHandler from '../md_editor';

export const FileSystemContext = createContext({} as FileSystem);

const FilePanel: React.FC<Readonly<IDialogProps>> = function FilePanel(props) {
  const { onClose, ...rest } = props;

  const dialogRef = useRef<IDialogExpose>(null);
  const fileSystem = useFileSystem();

  useEffect(() => {
    fileSystem.register(mdHandler);
  }, []);

  return (
    <FileSystemContext.Provider value={fileSystem}>
      <Dialog
        ref={dialogRef}
        onClose={() => {
          onClose?.();
          fileSystem.returnToRoot();
        }}
        {...rest}
      >
        <FileLocation />

        <FileContent getContainer={() => dialogRef.current!.dialog!} />
      </Dialog>

      <BackgroundMenu backgroundManager={fileSystem.backgroundManager} />
    </FileSystemContext.Provider>
  );
};

export default FilePanel;
