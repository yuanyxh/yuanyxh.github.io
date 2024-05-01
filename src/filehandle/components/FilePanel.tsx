import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';

import {
  fallbackFullscreen,
  isFullScreen,
  onFullScreen,
  requestFullScreen,
  sleep
} from '@/utils';

import { Icon } from '@/components';

import FileContent from './FileContent';
import styles from './styles/FilePanel.module.less';
import { FileSystem, useFileSystem } from '../hooks/useFileSystem';

export type DialogProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'open' | 'onClose'
>;

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
}

export const FileSystemContext = createContext({} as FileSystem);

const FilePanel: React.FC<Readonly<IFilePanelProps>> = function FilePanel(
  props
) {
  const { open, onAnimationEnd, onMinimize, ...rest } = props;

  const dialogRef = useRef<HTMLDivElement>(null);
  const initedRef = useRef(open);

  const fileSystem = useFileSystem();

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

      // TODO: Browsers that support translate do not have a high occupancy rate on the market.
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
      window.document.documentElement.removeEventListener('mouseup', mouoseUp);
    }

    window.document.documentElement.addEventListener('mousemove', mouseMove);
    window.document.documentElement.addEventListener('mouseup', mouoseUp);
  };

  function Header() {
    const [full, setFull] = useState(false);

    useEffect(() => {
      return onFullScreen(() => {
        setFull(isFullScreen(dialogRef.current!));
      }, dialogRef.current!);
    }, []);

    const _onMinimize = () => {
      onMinimize?.();

      if (full) {
        fallbackFullscreen();
      }
    };

    const onMaximize = () => {
      const ele = dialogRef.current!;

      if (!isFullScreen(ele)) {
        ele.style.translate = '';
        requestFullScreen(ele);
        setFull(true);
      }
    };
    const onRestore = () => {
      const ele = dialogRef.current!;

      if (isFullScreen(ele)) {
        ele.style.translate = `${savePosition.x}px ${savePosition.y}px`;
        fallbackFullscreen();
        setFull(false);
      }
    };

    const onClose = () => {
      onMinimize?.();
      fileSystem.returnToRoot();
    };

    return (
      <header className={styles.header}>
        <div className={styles.bar} onMouseDownCapture={handleStart}></div>

        <div className={styles.operator}>
          <Icon
            role="button"
            icon="mingcute--minimize-fill"
            onClick={_onMinimize}
          />

          <Icon
            style={{ display: full ? 'none' : void 0 }}
            role="button"
            icon="fluent--maximize-28-filled"
            onClick={onMaximize}
          />
          <Icon
            style={{ display: full ? void 0 : 'none' }}
            role="button"
            icon="icon-park-outline--internal-reduction"
            onClick={onRestore}
          />

          <Icon
            role="button"
            icon="material-symbols--close"
            onClick={onClose}
          />
        </div>
      </header>
    );
  }

  return (
    <FileSystemContext.Provider value={fileSystem}>
      <div className={styles.wrapper}>
        <div
          role="dialog"
          aria-modal
          ref={dialogRef}
          className={styles.filePanel}
          onAnimationEnd={_onAnimationEnd}
          {...rest}
        >
          <Header />

          <FileContent getContainer={() => dialogRef.current!} />
        </div>
      </div>
    </FileSystemContext.Provider>
  );
};

export default FilePanel;
