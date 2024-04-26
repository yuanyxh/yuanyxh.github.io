import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import styles from './styles/FilePanel.module.less';

interface IFilePanelProps {}

const FilePanel: React.FC<Readonly<IFilePanelProps>> = (props) => {
  props;

  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.show();
  }, []);

  useLayoutEffect(() => {
    setOpen(true);
    dialogRef.current?.classList.add(styles.show);
    const animationend = () => {
      dialogRef.current?.classList.remove(styles.show);
      dialogRef.current?.close();
    };
    dialogRef.current?.addEventListener('animationend', animationend);

    return () =>
      dialogRef.current?.removeEventListener('animationend', animationend);
  }, [open]);

  return (
    <dialog ref={dialogRef} className={styles.filePanel}>
      FilePanel
    </dialog>
  );
};

const FILE_CONTAINER_ID = 'file-container';

const getContainer = () => {
  let container = window.document.getElementById(FILE_CONTAINER_ID);

  if (container) {
    return container;
  }

  container = window.document.createElement('div');
  container.setAttribute('id', FILE_CONTAINER_ID);

  window.document.body.appendChild(container);

  return container;
};

export function showFilePanel() {
  const container = getContainer();

  const root = createRoot(container);

  root.render(<FilePanel />);
}

export default FilePanel;
