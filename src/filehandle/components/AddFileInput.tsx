import { useState } from 'react';

import type { InputProps } from 'antd';
import { Input, Spin } from 'antd';

import { error, uuid, validateFileName } from '@/utils';

import { createDirectory, createFile, FileType } from '@/filehandle/utils/fileManager';

import { ExtendFileInfo } from './FileSideMenu';

function AddFileInput({
  file,
  names,
  replace,
  removeInput
}: {
  file: ExtendFileInfo;
  names: string[];
  replace(info: ExtendFileInfo, id: string): any;
  removeInput(id: string): any;
}) {
  const DEFAULT_NAME = 'default';

  const isAddFile = file.type === FileType.FILE;

  const [inputStatus, setInputStatus] = useState<{
    name: string;
    status: InputProps['status'];
  }>({ name: '', status: '' });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!validateFileName(value) || names.some((n) => n === value)) {
      return setInputStatus({ name: value, status: 'error' });
    }

    setInputStatus({ name: value, status: '' });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toLocaleLowerCase() !== 'enter') {
      return void 0;
    }

    handleAdd();
  };

  const handleAdd = async () => {
    const reg = new RegExp(`(?<=default)\\d*(?=${isAddFile ? '.md' : ''})`);

    let name = inputStatus.name;
    if (inputStatus.name === '' || inputStatus.status !== '') {
      const max = names
        .map((n) => n.match(reg))
        .filter(Boolean)
        .map(Number)
        .sort((a, b) => a - b)
        .pop();

      if (typeof max === 'number') name = DEFAULT_NAME + (max + 1);
      else name = DEFAULT_NAME;
    }

    if (isAddFile) name += '.md';

    if (file.handle.kind === 'directory') {
      try {
        setLoading(true);

        const handle = await (isAddFile ? createFile : createDirectory)(file.handle, name);

        replace(
          {
            id: uuid(),
            name,
            type: file.type,
            handle,
            icon: '',
            parent: file.parent
          },
          file.id
        );
      } catch (err) {
        error((err as Error).message);
        removeInput(file.id);
      } finally {
        setLoading(false);
      }
    } else {
      removeInput(file.id);
    }
  };

  return (
    <Spin spinning={loading}>
      <Input
        name="add-mdfile-input"
        autoComplete="off"
        spellCheck={false}
        style={{ marginLeft: 8 }}
        autoFocus
        size="small"
        value={inputStatus.name}
        status={inputStatus.status}
        suffix={isAddFile ? '.md' : void 0}
        onChange={handleInputChange}
        onContextMenuCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onKeyUp={handleKeyUp}
        onBlur={handleAdd}
      />
    </Spin>
  );
}

export default AddFileInput;
