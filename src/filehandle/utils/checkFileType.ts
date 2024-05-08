import type { DH, FH } from './fileManager';

export function isFileHandle(data: any): data is FH {
  const _data = data as FH | undefined;

  return data && _data?.kind === 'file' && _data?.name && _data?.createWritable;
}

export function isDirectoryHandle(data: any): data is DH {
  const _data = data as DH | undefined;

  return (
    data &&
    _data?.kind === 'directory' &&
    _data?.name &&
    typeof _data.getDirectoryHandle === 'function' &&
    typeof _data.getFileHandle === 'function'
  );
}
