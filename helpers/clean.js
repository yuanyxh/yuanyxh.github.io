import fs from 'node:fs';
import { resolve } from 'node:path';

const filePaths = ['.eslintcache', /* 'build', */ '.analyze.html'];

filePaths.forEach((filePath) => {
  const fullFilePath = resolve(filePath);

  if (fs.existsSync(fullFilePath)) fs.unlinkSync(fullFilePath);
});
