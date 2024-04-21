import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'fs';
import { resolve } from 'path';
import { codeToHtml } from 'shiki';

const root = './src/examples/base64_coder';
const dirs = readdirSync(root);

async function write(dirs, root) {
  for (let i = 0; i < dirs.length; i++) {
    const isDirectory = lstatSync(resolve(root, dirs[i])).isDirectory();

    if (isDirectory) {
      write(readdirSync(resolve(root, dirs[i])), resolve(root, dirs[i]));
    } else {
      const code = readFileSync(resolve(root, dirs[i]), 'utf-8');

      const html = await codeToHtml(code, {
        lang: dirs[i].split('.').pop(),
        theme: 'one-dark-pro'
      });

      if (!existsSync('./node')) {
        mkdirSync('./node');
      }

      const data = `export default function() {
        return <div dangerouslySetInnerHTML={\`${html}\`}></div>
      }`;

      writeFileSync('./node/' + dirs[i], data, { encoding: 'utf-8' });
    }
  }
}

write(dirs, root);
