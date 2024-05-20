import { useMemo, useRef, useState } from 'react';

import type { InputRef } from 'antd';
import { Input, type InputProps, Modal, Typography } from 'antd';

import { sleep, validateFileName } from '@/utils';

import { FileType } from '@/filehandle/utils/fileManager';

function AddFileModal({
  open,
  type,
  names,
  onOk,
  onCancel
}: {
  open: boolean;
  type: FileType;
  names: string[];
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
      // Delay to make the input box get the focus
      sleep(100, () => inputRef.current?.focus());
    }
  }, [open]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value !== '' && !validateFileName(value)) {
      setInputStatus({
        name: value,
        status: 'error',
        message: '无效的文件名'
      });
    } else if (names.some((c) => c === value)) {
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
    if (inputStatus.name === '' || inputStatus.status === 'error') {
      return false;
    }

    onOk(inputStatus.name, type);

    setInputStatus({ name: '', status: '', message: '' });
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
        <Typography.Paragraph type="danger">{inputStatus.message}</Typography.Paragraph>
      ) : null}
    </Modal>
  );
}

export default AddFileModal;
