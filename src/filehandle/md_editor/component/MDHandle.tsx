import { useEffect, useId, useRef, useState } from 'react';

import { Button, Form, Input, Modal, Row } from 'antd';

import { error } from '@/utils';

import type { BackgroundManager } from '@/filehandle/BackgroundManager';

import { Dialog, Icon } from '@/components';

import type { IMDContentExpose } from './MDContent';
import { MDContent } from './MDContent';
import styles from './styles/MDHandle.module.less';
import type { DH, FH } from '../../utils/fileManager';
import type { UploadInfo } from '../store/useMDStore';
import { useMDStore } from '../store/useMDStore';

export interface IMDHandle {
  handle: DH | FH;
  backgroundManager: BackgroundManager;
  destroy(): void;
  update(): void;
}

const Toolbar = () => {
  const [uploadSettingModal, setUploadSettingModal] = useState(false);

  const { uploadInfo, setUploadInfo } = useMDStore();

  const [form] = Form.useForm<UploadInfo>();

  const handleSetImageUpload = () => {
    setUploadSettingModal(true);
  };

  const handleCancel = () => {
    setUploadSettingModal(false);

    form.resetFields();
  };

  const handleSetUploadSetting = () => {
    form
      .validateFields()
      .then((value) => {
        setUploadInfo(value);

        setUploadSettingModal(false);

        form.resetFields();
      })
      .catch(() => {
        /* empty */
      });
  };

  return (
    <>
      <Row style={{ marginLeft: 5 }} gutter={20}>
        <Button
          type="text"
          size="small"
          style={{ color: 'var(--color-info)' }}
          onClick={handleSetImageUpload}
        >
          图片上传设置
        </Button>
      </Row>

      <Modal
        title="图片上传设置"
        style={{ top: '15vh' }}
        destroyOnClose
        open={uploadSettingModal}
        onCancel={handleCancel}
        onOk={handleSetUploadSetting}
      >
        <Form
          name="markdown-upload-setting"
          layout="vertical"
          autoComplete="off"
          initialValues={uploadInfo}
          form={form}
        >
          <Form.Item<UploadInfo>
            label="上传地址"
            name="url"
            rules={[{ required: true, message: 'Please input upload url!' }]}
          >
            <Input placeholder="请输入上传的目标地址" />
          </Form.Item>

          <Form.Item<UploadInfo>
            label="文件字段"
            name="field"
            rules={[{ required: true, message: 'Please input file field!' }]}
          >
            <Input placeholder="请输入文件对应的字段" />
          </Form.Item>

          <Form.Item<UploadInfo>
            label="响应路径"
            name="navigation"
            rules={[
              { required: true, message: 'Please input response navigation!' }
            ]}
          >
            <Input placeholder="请输入图片地址在响应中的路径，以 . 分割" />
          </Form.Item>

          {/* TODO: JSON editor tool */}
          <Form.Item<UploadInfo> label="额外请求体" name="body">
            <Input.TextArea
              rows={5}
              placeholder="额外请求参数，请输入 JSON 格式"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const MDHandle: React.FC<IMDHandle> = (props) => {
  const { handle, backgroundManager, update, destroy } = props;

  const mdContentRef = useRef<IMDContentExpose>(null);

  const handleId = useId();

  const [open, setOpen] = useState(false);

  const initialRef = useRef(false);
  const destroyRef = useRef(false);

  useEffect(() => {
    if (!initialRef.current) {
      setOpen(true);
      initialRef.current = true;
    }
  }, []);

  const onClose = async () => {
    try {
      await mdContentRef.current?.confirm();

      backgroundManager.removeBackground(handleId);

      setOpen(false);
      destroyRef.current = true;
    } catch (err) {
      error('暂无法保存。');
    }
  };

  const handleMinimize = () => {
    setOpen(false);

    backgroundManager.bringToBackground({
      id: handleId,
      icon: <Icon icon="bxs--file-md" color="var(--color-primary)" />,
      open: () => {
        setOpen(true);
        backgroundManager.removeBackground(handleId);
      }
    });
  };

  const onAnimationEnd = () => {
    if (destroyRef.current) {
      destroy();
    }
  };

  return (
    <Dialog
      className={styles.mdHandle}
      open={open}
      draggable={false}
      toolbar={<Toolbar />}
      onAnimationEnd={onAnimationEnd}
      onMinimize={handleMinimize}
      onClose={onClose}
    >
      <MDContent ref={mdContentRef} handle={handle} update={update} />
    </Dialog>
  );
};

export default MDHandle;
