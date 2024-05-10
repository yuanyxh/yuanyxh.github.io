import { useContext, useRef, useState } from 'react';

import { Form, Input, Modal, Spin, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import type { WebdavInfo } from '@/store';
import { useUserStore } from '@/store';

import { alert, confirm, error, sleep, success } from '@/utils';

import { AddFileModal, ContextMenu, Icon } from '@/components';

import { FileSystemContext } from './FilePanel';
import styles from './styles/FileContent.module.less';
import type { DH, FileInfo } from '../utils/fileManager';
import { FileType } from '../utils/fileManager';

function MountWebdavModal(props: { open: boolean; close(): void }) {
  const { open, close } = props;

  const [form] = Form.useForm();

  const { children } = useContext(FileSystemContext);

  const { addWebdav } = useUserStore();

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        const webdav: WebdavInfo = form.getFieldsValue();

        if (children.some((w) => w.name === webdav.name.trim())) {
          alert({
            title: '提示',
            content: `已包含名称为 "${webdav.name.trim()}" 的目录！`
          });

          return void 0;
        }

        addWebdav({ ...webdav, name: webdav.name.trim() });

        success('已添加 webdav 目录。');

        form.resetFields();

        sleep(35, close);
      })
      .catch(() => {
        /* empty */
      });
  };

  const handleCancel = () => {
    form.resetFields();
    close();
  };

  return (
    <Modal
      title="挂载 webdav 目录"
      style={{ top: '30vh' }}
      open={open}
      okText={'确认'}
      cancelText={'取消'}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        name="mount_webdav"
        layout="vertical"
        form={form}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item<WebdavInfo>
          label="webdav 路径"
          name="url"
          rules={[{ required: true, message: 'Please input your webdav url!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<WebdavInfo>
          label="目录名称"
          name="name"
          rules={[
            { required: true, message: 'Please input your webdav locale name!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<WebdavInfo>
          label="用户名"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<WebdavInfo>
          label="密码"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
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
  const { webdavs, setWebdavs } = useUserStore();

  const {
    current,
    children,
    isBusy,
    fileHandles,
    fileLinked,
    backgroundManager,

    enterDirectory,
    create,
    remove,
    importFile,
    importDirectory
  } = useContext(FileSystemContext);

  const root = fileLinked?.root?.value;

  const titleRef = useRef<FileType>(FileType.FILE);
  const sectionRef = useRef<HTMLElement>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isMountModalOpen, setMountModalOpen] = useState(false);

  const [selection, setSelection] = useState<FileInfo[]>([]);

  const contextMenu = fileHandles
    .filter((handle) => handle.contextMenu)
    .map((handle) => ({
      name: handle.contextMenu!.name,
      icon: handle.contextMenu!.icon,
      async onClick() {
        try {
          let value = current;
          if (selection[0]) {
            value = selection[0].handle as DH;
          }

          await handle.contextMenu!.handler(value, backgroundManager);
        } catch (err) {
          error((err as Error).message);
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

  const handleMountWebdav = () => {
    setMountModalOpen(true);
  };

  const open = async (file: FileInfo) => {
    try {
      const handle = fileHandles.find((handle) =>
        handle.ext.split(',').some((ext) => ext.trim() === file.ext)
      );

      if (handle) {
        handle.open(await current.getFileHandle(file.name), backgroundManager);
      }
    } catch (err) {
      error((err as Error).message);
    }
  };

  const handleDeleteFile = () => {
    const _selection = selection.slice(0);

    const names = _selection
      .filter((file) => !file.remote)
      .map((file) => file.name);

    confirm({
      title: '温馨提示',
      icon: <ExclamationCircleFilled />,
      content: '您确认要删除这个文件吗？',
      async onOk() {
        try {
          let _webdavs = webdavs.slice(0);
          _selection.map((file) => {
            if (file.remote) {
              _webdavs = _webdavs.filter((webdav) => webdav.name !== file.name);
            }
          });
          setWebdavs(_webdavs);

          await Promise.all(names.map((name) => remove(name)));

          _selection.map(
            (file) =>
              file.type === FileType.DIRECTORY &&
              fileLinked.unlink(file.handle as DH)
          );
        } catch (err) {
          error((err as Error).message);
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
      error((err as Error).message);
    }
  };
  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <section ref={sectionRef} className={styles.content}>
        <Spin spinning={isBusy}>
          {children.map((child) => (
            <FileItem
              key={child.name}
              file={child}
              onContextMenu={() => {
                setSelection([child]);
              }}
              onDoubleClick={
                child.type === FileType.DIRECTORY
                  ? () => enterDirectory(child)
                  : () => open(child)
              }
            />
          ))}
        </Spin>

        <ContextMenu
          getBindElement={() => sectionRef.current!}
          getContainer={props.getContainer}
          onHide={() => selection.length && setSelection([])}
          menu={[
            ...contextMenu,
            {
              name: '挂载 webdav 目录',
              icon: <Icon icon="mdi--web" color="var(--color-primary)" />,
              style: {
                display: current === root ? void 0 : 'none'
              },
              onClick: handleMountWebdav
            },
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
              onClick: importFile
            },
            {
              name: '导入文件夹',
              icon: (
                <Icon icon="ri--import-line" color="var(--color-primary)" />
              ),
              onClick: importDirectory
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
        names={children.map((c) => c.name)}
        onOk={handleOk}
        onCancel={handleCancel}
      />

      <MountWebdavModal
        open={isMountModalOpen}
        close={() => setMountModalOpen(false)}
      />
    </>
  );
};

export default FileContent;
