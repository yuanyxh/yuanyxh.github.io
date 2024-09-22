import { resolve } from 'node:path';
import { rimrafSync } from 'rimraf';

const filePaths = ['.eslintcache', 'build', '.analyze.html'];

rimrafSync(
  filePaths.map((f) => resolve(f)),
  { preserveRoot: false }
);
