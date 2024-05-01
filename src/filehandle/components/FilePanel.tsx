import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';

import type { InputProps } from 'antd';
import { App, Input, Modal, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import {
  fallbackFullscreen,
  isFullScreen,
  onFullScreen,
  requestFullScreen,
  sleep,
  validateFileName
} from '@/utils';

import { ContextMenu, Icon } from '@/components';

import styles from './styles/FilePanel.module.less';
import { FileSystem, useFileSystem } from '../hooks/useFileSystem';
import { isAlwaysExist } from '../utils';
import { DH, FileInfo, FileType } from '../utils/fileManager';

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

function AddFileModal({
  open,
  current,
  type,
  onOk,
  onCancel
}: {
  open: boolean;
  current: DH;
  type: FileType;
  onOk: (name: string, type: FileType) => any;
  onCancel: () => any;
}) {
  const [inputStatus, setInputStatus] = useState<{
    name: string;
    status: InputProps['status'];
    message: string;
  }>({
    name: '',
    status: '',
    message: ''
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value !== '' && !validateFileName(value)) {
      setInputStatus({ name: value, status: 'error', message: '无效的文件名' });
    } else if (await isAlwaysExist(current, value)) {
      setInputStatus({
        name: value,
        status: 'error',
        message: '当前目录已包含同名的文件'
      });
    } else {
      setInputStatus({ name: value, status: '', message: '' });
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toLocaleLowerCase() !== 'enter') {
      return false;
    }

    handleOk();
  };

  const handleOk = () => {
    if (inputStatus.name.trim() === '' || inputStatus.status === 'error') {
      return false;
    }
    onOk(inputStatus.name.trim(), type);
  };

  return (
    <Modal
      title={type === FileType.FILE ? '新建文件' : '新建文件夹'}
      open={open}
      onOk={handleOk}
      onCancel={() => {
        setInputStatus({ name: '', status: '', message: '' });
        onCancel();
      }}
      okText={'确认'}
      cancelText={'取消'}
    >
      <Input
        status={inputStatus.status}
        value={inputStatus.name}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
      />

      {inputStatus.message ? (
        <Typography.Paragraph type="danger">
          {inputStatus.message}
        </Typography.Paragraph>
      ) : null}
    </Modal>
  );
}

interface IFileItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  file: FileInfo;
}

const FileItem: React.FC<Readonly<IFileItemProps>> = (props) => {
  const { file, ...rest } = props;

  return (
    <a className={styles.fileItem} data-name={file.name} {...rest}>
      {file.icon ? (
        file.icon
      ) : (
        <Icon
          className={styles.fileIcon}
          icon={
            file.type === FileType.FILE
              ? 'ph--file-fill'
              : 'material-symbols-light--folder'
          }
          color="var(--color-primary)"
        />
      )}

      <span>{file.name}</span>
    </a>
  );
};

const Content: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const titleRef = useRef<FileType>(0);

  const [selection, setSelection] = useState<string[]>([]);

  const sectionRef = useRef<HTMLElement>(null);

  const { current, children, enterDirectory, create, remove } =
    useContext(FileSystemContext);

  const { modal } = App.useApp();

  const handleAddFile = () => {
    titleRef.current = FileType.FILE;
    setModalOpen(true);
  };
  const handleAddDirectory = () => {
    titleRef.current = FileType.DIRECTORY;
    setModalOpen(true);
  };

  const handleDeleteFile = () => {
    const names = selection.slice(0);

    modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleFilled />,
      content: '您确认要删除这个文件吗？',
      async onOk() {
        await Promise.all(names.map((name) => remove(name)));
      },
      okText: '确认',
      cancelText: '取消'
    });
  };

  const handleOk = async (name: string, type: FileType) => {
    await create(name, type);
    setModalOpen(false);
  };
  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <section ref={sectionRef} className={styles.content}>
        {children.map((child) => (
          <FileItem
            key={child.name}
            file={child}
            onContextMenu={() => {
              setSelection([child.name]);
            }}
            onDoubleClick={
              child.type === FileType.DIRECTORY
                ? () => enterDirectory(child.name)
                : void 0
            }
          />
        ))}

        <ContextMenu
          getBindElement={() => sectionRef.current!}
          getContainer={() =>
            window.document.body.querySelector(
              `.${styles.filePanel}`
            ) as HTMLElement
          }
          onHide={() => setSelection([])}
          menu={[
            {
              name: '新建文件',
              icon: <Icon icon="ph--file-fill" color="var(--color-primary)" />,
              onClick: handleAddFile
            },
            {
              name: '新建文件夹',
              icon: (
                <Icon
                  icon="material-symbols-light--folder"
                  color="var(--color-primary)"
                />
              ),
              onClick: handleAddDirectory
            },
            {
              name: '删除',
              icon: (
                <Icon
                  icon="material-symbols--delete"
                  color="var(--color-primary)"
                />
              ),
              style: {
                display: selection.length ? void 0 : 'none'
              },
              onClick: handleDeleteFile
            }
          ]}
        />
      </section>

      <AddFileModal
        open={isModalOpen}
        type={titleRef.current}
        current={current}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
};

interface IFilePanelProps extends DialogProps {
  open: boolean;
  onMinimize?(): any;
}

const FileSystemContext = createContext({} as FileSystem);

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

          <Content />
        </div>
      </div>
    </FileSystemContext.Provider>
  );
};

export default FilePanel;
