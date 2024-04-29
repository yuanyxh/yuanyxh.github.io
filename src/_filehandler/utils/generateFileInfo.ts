import { isArrayBuffer } from 'lodash-es';

import { FileInfo } from '../fileInfoManager';
import type { FileData } from '../fileManager';

import md5 from 'md5';

interface GenerateOptions
  extends Pick<FileInfo, 'name' | 'path' | 'type' | 'ext'> {
  data?: FileData;
}

interface GenerateFileInfo {
  (options: GenerateOptions): Promise<FileInfo>;
}

export const generateFileInfo: GenerateFileInfo = async ({
  name,
  path,
  type,
  ext,
  data
}) => {
  let byteLength = 0;
  let sign = '';
  if (isArrayBuffer(data)) {
    byteLength = data.byteLength;
    sign = md5(new Uint8Array(data));
  } else if (data instanceof Blob) {
    const buffer = await data.arrayBuffer();
    byteLength = buffer.byteLength;
    sign = md5(new Uint8Array(buffer));

    md5(new Uint8Array(buffer));
  }

  const hasFileData = byteLength && sign;

  return {
    ...{ name, updateAt: Date.now(), version: 0, sign: '', path, ext, type },
    ...(hasFileData ? { size: byteLength, sign } : {})
  };
};
