import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { createRoot } from 'react-dom/client';

import {
  fallbackFullscreen,
  isFullScreen,
  requestFullScreen,
  sleep
} from '@/utils';

import { Icon } from '@/components';

import styles from './styles/FilePanel.module.less';

type DialogProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'open' | 'onClose'
>;

type AsyncFunction = () => Promise<boolean>;

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
  beforeEnter(ele: HTMLDivElement) {
    ele.parentElement!.style.display = 'flex';
    ele.style.display = 'block';

    setTransformOrigin(ele);
    this.enter(ele);
  },
  enter(ele: HTMLDivElement) {
    ele.classList.add(styles.enter);
  },
  afterEnter(ele: HTMLDivElement) {
    ele.classList.remove(styles.enter);
  },
  beforeLeave(ele: HTMLDivElement) {
    this.leave(ele);
  },
  leave(ele: HTMLDivElement) {
    ele.classList.add(styles.leave);
  },
  afterLeave(ele: HTMLDivElement) {
    ele.style.display = 'none';
    ele.parentElement!.style.display = 'none';

    ele.classList.remove(styles.leave);
  }
};

let savePosition = {
  x: 0,
  y: 0
};

interface IFilePanelProps extends DialogProps {
  open: boolean;
  onMinimize?(): any;
  onMaximize?(): any;
  onClose?(): any;
}

interface IFilePanelRef {
  getDialog(): HTMLDivElement | null;
}

const FilePanel = forwardRef<IFilePanelRef, Readonly<IFilePanelProps>>(
  function FilePanel(props, filePanelRef) {
    const { open, onAnimationEnd, onMinimize, onMaximize, onClose, ...rest } =
      props;

    const dialogRef = useRef<HTMLDivElement>(null);
    const initedRef = useRef(open);

    useImperativeHandle(filePanelRef, () => ({
      getDialog() {
        return dialogRef.current;
      }
    }));

    useLayoutEffect(() => {
      if (open) {
        initedRef.current = true;
      }

      if (!initedRef.current) {
        dialogRef.current!.style.display = 'none';
        dialogRef.current!.parentElement!.style.display = 'none';
        return void 0;
      }

      animateStrategy[open ? 'beforeEnter' : 'beforeLeave'](dialogRef.current!);
    }, [open]);

    const _onAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
      animateStrategy[open ? 'afterEnter' : 'afterLeave'](dialogRef.current!);
      onAnimationEnd?.(e);
    };

    const handleStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isFullScreen(dialogRef.current!)) {
        return false;
      }

      let prev = { x: e.pageX, y: e.pageY };

      function mouseMove(e: MouseEvent) {
        const movementX = e.pageX - prev.x;
        const movementY = e.pageY - prev.y;

        savePosition = {
          x: savePosition.x + movementX,
          y: savePosition.y + movementY
        };

        // TODO: supporting existence
        dialogRef.current!.style.translate = `${savePosition.x}px ${savePosition.y}px`;

        prev = {
          x: e.pageX,
          y: e.pageY
        };
      }

      function mouoseUp() {
        window.document.documentElement.removeEventListener(
          'mousemove',
          mouseMove
        );
        window.document.documentElement.removeEventListener(
          'mouseup',
          mouoseUp
        );
      }

      window.document.documentElement.addEventListener('mousemove', mouseMove);
      window.document.documentElement.addEventListener('mouseup', mouoseUp);
    };

    return (
      <div className={styles.wrapper}>
        <div
          {...rest}
          role="dialog"
          ref={dialogRef}
          className={styles.filePanel}
          onAnimationEnd={_onAnimationEnd}
        >
          <header className={styles.header}>
            <div className={styles.bar} onMouseDownCapture={handleStart}></div>

            <div className={styles.operator}>
              <Icon
                role="button"
                icon="mingcute--minimize-fill"
                onClick={onMinimize}
              />
              <Icon
                role="button"
                icon="fluent--maximize-28-filled"
                onClick={onMaximize}
              />
              <Icon
                role="button"
                icon="material-symbols--close"
                onClick={onClose}
              />
            </div>
          </header>
        </div>
      </div>
    );
  }
);

interface IFilePanelContainerProps extends DialogProps {
  show(cb?: AsyncFunction): void;
  hide(cb?: AsyncFunction): void;
}

const FilePanelContainer: React.FC<Readonly<IFilePanelContainerProps>> = (
  props
) => {
  const { show, hide, ...rest } = props;

  const renderResolveRef = useRef<(value: boolean) => void>();
  const filePanelRef = useRef<IFilePanelRef>(null);

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

    const ele = filePanelRef.current!.getDialog()!;
    if (isFullScreen(ele)) {
      fallbackFullscreen();
    }
  };
  const onMaximize = () => {
    const ele = filePanelRef.current!.getDialog()!;

    if (!isFullScreen(ele)) {
      requestFullScreen(ele);
    }
  };
  const onClose = () => {};

  return (
    <FilePanel
      ref={filePanelRef}
      open={open}
      onAnimationEnd={onAnimationEnd}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
      {...rest}
    />
  );
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

  private _show: AsyncFunction | undefined;
  private _hide: AsyncFunction | undefined;

  private doorValve = false;

  private isShow = false;

  constructor() {
    const show = (cb?: AsyncFunction) => {
      if (!this._show && cb) {
        return (this._show = cb);
      }

      this.show();
    };
    const hide = (cb?: AsyncFunction) => {
      if (!this._hide && cb) {
        return (this._hide = cb);
      }

      this.hide();
    };
    this.root.render(<FilePanelContainer show={show} hide={hide} />);
  }

  show() {
    if (this.doorValve) return;
    this.doorValve = true;

    Promise.resolve().then(() => {
      this._show?.().then(() => {
        this.doorValve = false;
        this.isShow = true;
      });
    });
  }

  hide() {
    if (this.doorValve) return;
    this.doorValve = true;

    Promise.resolve().then(() => {
      this._hide?.().then(() => {
        this.doorValve = false;
        this.isShow = false;
      });
    });
  }

  toggle() {
    this.isShow ? this.hide() : this.show();
  }

  destroy() {
    // window.document.documentElement.removeEventListener('click', onClick, true);
    this.root.unmount();
    Promise.resolve().then(() => this.container.remove());
  }
}

export default new FilePanelFactory();