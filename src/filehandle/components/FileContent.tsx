import { useContext, useMemo, useRef, useState } from 'react';

import type { InputProps } from 'antd';
import type { InputRef } from 'antd';
import { App, Input, Modal, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import { sleep, validateFileName } from '@/utils';

import { ContextMenu, Icon } from '@/components';

import { FileSystemContext } from './FilePanel';
import styles from './styles/FileContent.module.less';
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
  const { message } = App.useApp();

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
      // Delay to make the input box get the focus
      sleep(100, () => inputRef.current?.focus());
    }
  }, [open]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    try {
      if (value !== '' && !validateFileName(value)) {
        setInputStatus({
          name: value,
          status: 'error',
          message: '无效的文件名'
        });
      } else if (await isAlwaysExist(current, value)) {
        setInputStatus({
          name: value,
          status: 'error',
          message: '当前目录已包含同名的文件'
        });
      } else {
        setInputStatus({ name: value, status: '', message: '' });
      }
    } catch (err) {
      message.error((err as Error).message);
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
    <span className={styles.fileItem} data-name={file.name} {...rest}>
      <span className={styles.fileIcon}>{getIcon(file)}</span>

      <Typography.Paragraph
        style={{ flex: 1, marginBottom: 0 }}
        ellipsis={{ rows: 1, tooltip: true }}
      >
        {file.name}
      </Typography.Paragraph>
    </span>
  );
};

interface IFileContentProps {
  getContainer(): HTMLElement;
}

const FileContent: React.FC<IFileContentProps> = (props) => {
  const { modal, message } = App.useApp();

  const {
    current,
    children,
    fileHandles,
    enterDirectory,
    create,
    remove,
    forceUpdate
  } = useContext(FileSystemContext);

  const titleRef = useRef<FileType>(0);
  const sectionRef = useRef<HTMLElement>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);

  const contextMenu = fileHandles
    .filter((handle) => handle.contextMenu)
    .map((handle) => ({
      name: handle.contextMenu!.name,
      icon: handle.contextMenu!.icon,
      async onClick() {
        try {
          let value = current;
          if (selection[0]) {
            value = (await getHandle(current, selection[0])) as DH;
          }
          await handle.contextMenu!.handler(value);
        } catch (err) {
          message.error((err as Error).message);
        }
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
    try {
      const handle = fileHandles.find((handle) =>
        handle.ext.split(',').some((ext) => ext.trim() === file.ext)
      );

      if (handle) {
        handle.open(await current.getFileHandle(file.name));
      }
    } catch (err) {
      message.error((err as Error).message);
    }
  };

  const handleDeleteFile = () => {
    const names = selection.slice(0);

    modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleFilled />,
      content: '您确认要删除这个文件吗？',
      async onOk() {
        try {
          await Promise.all(names.map((name) => remove(name)));
        } catch (err) {
          message.error((err as Error).message);
        }
      },
      okText: '确认',
      cancelText: '取消'
    });
  };

  const handleOk = async (name: string, type: FileType) => {
    try {
      await create(name, type);
      setModalOpen(false);
    } catch (err) {
      message.error((err as Error).message);
    }
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
