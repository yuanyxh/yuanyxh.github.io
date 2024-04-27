import { useState } from 'react';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { Modal } from 'antd';

// import styles from './styles/FilePanel.module.less';

interface IFilePanelProps {
  show(cb: ProcedureFunction): void;
  hide(cb: ProcedureFunction): void;
}

const FilePanel: React.FC<Readonly<IFilePanelProps>> = (props) => {
  const { show, hide } = props;

  useEffect(() => {
    show(() => setOpen(true));
    hide(() => setOpen(false));
  }, []);

  const [open, setOpen] = useState(false);

  return <Modal open={open}></Modal>;
};

const getContainer = () => {
  const container = window.document.createElement('div');

  window.document.body.appendChild(container);

  return container;
};

class FilePanelFactory {
  private container = getContainer();

  private root = createRoot(this.container);

  show = () => {};

  hide = () => {};

  constructor() {
    const show = (cb: ProcedureFunction) => (this.show = cb);
    const hide = (cb: ProcedureFunction) => (this.hide = cb);

    this.root.render(<FilePanel show={show} hide={hide} />);
  }

  destroy() {
    this.root.unmount();
    Promise.resolve().then(() => this.container.remove());
  }
}

export default FilePanelFactory;
