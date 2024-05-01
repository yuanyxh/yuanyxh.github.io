import { useCallback, useMemo, useRef, useState } from 'react';

import type { DialogProps } from './FilePanel';
import FilePanel from './FilePanel';

interface IFilePanelContainerProps extends DialogProps {
  show(cb?: AsyncFunction): void;
  hide(cb?: AsyncFunction): void;
}

const FilePanelContainer: React.FC<Readonly<IFilePanelContainerProps>> = (
  props
) => {
  const { show, hide, ...rest } = props;

  const renderResolveRef = useRef<(value: boolean) => void>();

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
  }, []);

  const [open, setOpen] = useState(false);

  const onAnimationEnd = useCallback(() => {
    renderResolveRef.current?.(true);
    renderResolveRef.current = void 0;
  }, []);

  const onMinimize = () => {
    hide();
  };

  return (
    <FilePanel
      open={open}
      onAnimationEnd={onAnimationEnd}
      onMinimize={onMinimize}
      {...rest}
    />
  );
};

export default FilePanelContainer;
