import { useCallback, useMemo, useRef, useState } from 'react';

import type { IDialogProps } from '@/components';

import FilePanel from './FilePanel';

interface IFilePanelContainerProps extends Omit<IDialogProps, 'open'> {
  show(cb?: AsyncFunction): void;
  hide(cb?: AsyncFunction): void;
}

const FilePanelContainer: React.FC<Readonly<IFilePanelContainerProps>> = (props) => {
  const { show, hide, ...rest } = props;

  const renderResolveRef = useRef<(value: boolean) => void>();

  const [open, setOpen] = useState(false);

  useMemo(() => {
    show(
      () =>
        new Promise((resolve) => {
          setOpen(true);
          renderResolveRef.current = resolve;
        })
    );
    hide(
      () =>
        new Promise((resolve) => {
          setOpen(false);
          renderResolveRef.current = resolve;
        })
    );
  }, [show, hide]);

  const onAnimationEnd = useCallback(() => {
    renderResolveRef.current?.(true);
    renderResolveRef.current = void 0;
  }, [show, hide]);

  const onMinimize = () => {
    hide();
  };

  return (
    <FilePanel
      open={open}
      onAnimationEnd={onAnimationEnd}
      onMinimize={onMinimize}
      onClose={onMinimize}
      {...rest}
    />
  );
};

export default FilePanelContainer;
