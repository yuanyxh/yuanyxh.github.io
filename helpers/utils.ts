import path from 'path';

export const root = process.cwd();

export const resolve = (_path: string) => path.resolve(root, _path);
