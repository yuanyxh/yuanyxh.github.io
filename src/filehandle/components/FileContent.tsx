import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import type { InputProps } from 'antd';
import { App, Input, InputRef, Modal, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import { sleep, validateFileName } from '@/utils';

import { ContextMenu, Icon } from '@/components';

import { FileSystemContext } from './FilePanel';
import styles from './styles/FileContent.module.less';
import mdHandler from '../md_editor';
import { isAlwaysExist } from '../utils';
import type { DH, FileInfo } from '../utils/fileManager';
import {
  FileType,
  getHandle,
  importDirectory,
  importFile
} from '../utils/fileManager';

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

  const inputRef = useRef<InputRef>(null);

  useMemo(() => {
    if (open) {
      sleep(100, () => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

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
      style={{ top: '30vh' }}
      open={open}
      okText={'确认'}
      cancelText={'取消'}
      onOk={handleOk}
      onCancel={() => {
        setInputStatus({ name: '', status: '', message: '' });
        onCancel();
      }}
    >
      <Input
        ref={inputRef}
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

  const { fileHandles } = useContext(FileSystemContext);

  const getIcon = (file: FileInfo) => {
    if (file.type === FileType.DIRECTORY) {
      return (
        <Icon
          icon="material-symbols-light--folder"
          color="var(--color-primary)"
        />
      );
    }

    const handle = fileHandles.find((handle) =>
      handle.ext.split(',').some((ext) => ext.trim() === file.ext)
    );

    if (handle && handle.icon) {
      return handle.icon;
    }

    return <Icon icon="ph--file-fill" color="var(--color-primary)" />;
  };

  return (
    <a className={styles.fileItem} data-name={file.name} {...rest}>
      <span className={styles.fileIcon}>{getIcon(file)}</span>

      <Typography.Paragraph
        style={{ flex: 1, marginBottom: 0 }}
        ellipsis={{ rows: 1, tooltip: true }}
      >
        {file.name}
      </Typography.Paragraph>
    </a>
  );
};

interface IFileContentProps {
  getContainer(): HTMLElement;
}

const FileContent: React.FC<IFileContentProps> = (props) => {
  const titleRef = useRef<FileType>(0);
  const sectionRef = useRef<HTMLElement>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);

  const {
    current,
    children,
    fileHandles,
    register,
    enterDirectory,
    create,
    remove,
    forceUpdate
  } = useContext(FileSystemContext);

  const { modal, message } = App.useApp();

  useEffect(() => {
    register(mdHandler);

    forceUpdate();
  }, []);

  const contextMenu = fileHandles
    .filter((handle) => handle.contextMenu)
    .map((handle) => ({
      name: handle.contextMenu!.name,
      icon: handle.contextMenu!.icon,
      onClick() {
        getHandle(current, selection[0]).then((value) => {
          handle.contextMenu!.handler(value);
        });
      }
    }));

  const handleAddFile = () => {
    titleRef.current = FileType.FILE;
    setModalOpen(true);
  };
  const handleAddDirectory = () => {
    titleRef.current = FileType.DIRECTORY;
    setModalOpen(true);
  };

  const handleImportFile = () => {
    importFile(current)
      .then((value) => {
        if (!value) {
          return message.warning('暂无法导入文件');
        }
        forceUpdate();
      })
      .catch((err) => {
        message.error((err as Error).message);
      });
  };

  const handleImportDirectory = () => {
    importDirectory(current)
      .then((value) => {
        if (!value) {
          return message.warning('暂无法导入文件夹');
        }
        forceUpdate();
      })
      .catch((err) => {
        message.error((err as Error).message);
      });
  };

  const open = async (file: FileInfo) => {
    const handle = fileHandles.find((handle) =>
      handle.ext.split(',').some((ext) => ext.trim() === file.ext)
    );

    if (handle) {
      handle.open(await current.getFileHandle(file.name));
    }
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
                : () => open(child)
            }
          />
        ))}

        <ContextMenu
          getBindElement={() => sectionRef.current!}
          getContainer={props.getContainer}
          onHide={() => selection.length && setSelection([])}
          menu={[
            ...contextMenu,
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
              name: '导入文件',
              icon: (
                <Icon icon="mdi--file-import" color="var(--color-primary)" />
              ),
              onClick: handleImportFile
            },
            {
              name: '导入文件夹',
              icon: (
                <Icon icon="ri--import-line" color="var(--color-primary)" />
              ),
              onClick: handleImportDirectory
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

export default FileContent;
