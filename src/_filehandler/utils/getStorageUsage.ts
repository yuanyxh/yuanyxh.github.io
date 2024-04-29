import { FileData } from '../fileManager';

export const ONE_GIGABYTE = 1 * 1000 * 1000 * 1000;

export const getStorageUsage = () => {
  return window.navigator.storage.estimate();
};

export const getByteLength = async (data: FileData | string) => {
  if (data instanceof Blob) {
    return (await data.arrayBuffer()).byteLength;
  } else if (data instanceof ArrayBuffer) {
    return data.byteLength;
  }

  return (await new Blob([data], { type: 'text/plain' }).arrayBuffer())
    .byteLength;
};

/**
 *
 * @param size file byte
 */
export const checkRemainingStorageSpace = async (size: number) => {
  const { quota, usage } = await getStorageUsage();

  if (typeof quota === 'undefined' || typeof usage === 'undefined') {
    return false;
  }

  // always maintain a 1 GB origin storage quota
  return quota - usage - ONE_GIGABYTE > size;
};
