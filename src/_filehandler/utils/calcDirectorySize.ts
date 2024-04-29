import type { FileInfo } from '../fileInfoManager';

export const calcDirectorySize = (fileInfo: FileInfo) => {
  let size = 0;

  const { children } = fileInfo;

  if (children?.length) {
    size += children.reduce((prev, curr) => prev + calcDirectorySize(curr), 0);
  }

  size += fileInfo.size || 0;

  return size;
};
