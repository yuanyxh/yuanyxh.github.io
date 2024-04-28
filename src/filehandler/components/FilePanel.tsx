import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { sleep } from '@/utils';

import styles from './styles/FilePanel.module.less';

type DialogProps = Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open'>;

type AsyncFunction = () => Promise<boolean>;

interface IFilePanelProps extends DialogProps {
  open: boolean;
}

let mousePosition: { x: number; y: number } | null = null;

function onClick(e: MouseEvent) {
  mousePosition = {
    x: e.pageX,
    y: e.pageY
  };

  sleep(100, () => (mousePosition = null));
}
window.document.documentElement.addEventListener('click', onClick, true);

function setTransformOrigin(ele: HTMLElement) {
  const { x, y } = ele.getBoundingClientRect();

  if (mousePosition) {
    ele.style.transformOrigin = `${mousePosition.x - x}px ${mousePosition.y - y}px`;
  }
}

const animateStrategy = {
  beforeEnter(ele: HTMLDialogElement) {
    ele.show();
    ele.style.display = 'block';
    setTransformOrigin(ele);

    this.enter(ele);
  },
  enter(ele: HTMLDialogElement) {
    ele.classList.add(styles.enter);
  },
  afterEnter(ele: HTMLDialogElement) {
    ele.classList.remove(styles.enter);
  },
  beforeLeave(ele: HTMLDialogElement) {
    this.leave(ele);
  },
  leave(ele: HTMLDialogElement) {
    ele.classList.add(styles.leave);
  },
  afterLeave(ele: HTMLDialogElement) {
    ele.close();
    ele.style.display = 'none';
    ele.classList.remove(styles.leave);
  }
};

const FilePanel: React.FC<Readonly<IFilePanelProps>> = (props) => {
  const { open, onAnimationEnd, ...rest } = props;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const initedRef = useRef(open);

  useLayoutEffect(() => {
    if (open) {
      initedRef.current = true;
    }

    if (!initedRef.current) {
      dialogRef.current!.style.display = 'none';
      return void 0;
    }

    animateStrategy[open ? 'beforeEnter' : 'beforeLeave'](dialogRef.current!);
  }, [open]);

  const _onAnimationEnd = (e: React.AnimationEvent<HTMLDialogElement>) => {
    animateStrategy[open ? 'afterEnter' : 'afterLeave'](dialogRef.current!);
    onAnimationEnd?.(e);
  };

  return (
    <dialog
      {...rest}
      ref={dialogRef}
      className={styles.filePanel}
      onAnimationEnd={_onAnimationEnd}
    ></dialog>
  );
};

interface IFilePanelContainerProps extends DialogProps {
  show(cb: AsyncFunction): void;
  hide(cb: AsyncFunction): void;
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

  return <FilePanel open={open} {...rest} onAnimationEnd={onAnimationEnd} />;
};

const getContainer = () => {
  const container = window.document.createElement('div');
  container.className = styles.filePanelContainer;

  window.document.body.appendChild(container);

  return container;
};

class FilePanelFactory {
  private container = getContainer();

  private root = createRoot(this.container);

  private _show!: AsyncFunction;
  private _hide!: AsyncFunction;

  private doorValve = false;

  private isShow = false;

  constructor() {
    const show = (cb: AsyncFunction) => (this._show = cb);
    const hide = (cb: AsyncFunction) => (this._hide = cb);
    this.root.render(<FilePanelContainer show={show} hide={hide} />);
  }

  show() {
    if (this.doorValve) return;
    this.doorValve = true;

    Promise.resolve().then(() => {
      this._show().then(() => {
        this.doorValve = false;
        this.isShow = true;
      });
    });
  }

  hide() {
    if (this.doorValve) return;
    this.doorValve = true;

    Promise.resolve().then(() => {
      this._hide().then(() => {
        this.doorValve = false;
        this.isShow = false;
      });
    });
  }

  toggle() {
    this.isShow ? this.hide() : this.show();
  }

  destroy() {
    window.document.documentElement.removeEventListener('click', onClick, true);
    this.root.unmount();
    Promise.resolve().then(() => this.container.remove());
  }
}

export default new FilePanelFactory();
