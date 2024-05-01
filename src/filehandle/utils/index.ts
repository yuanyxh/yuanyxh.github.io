import type { DH } from './fileManager';
import { getHandle } from './fileManager';

export const isAlwaysExist = async (directory: DH, name: string) => {
  try {
    await getHandle(directory, name.trim());
    return true;
  } catch {
    return false;
  }
};
