import { createRoot } from 'react-dom/client';

import { Icon } from '@/components';

import type { FileHandle } from '../hooks/useFileSystem';
import type { DH, FH } from '../utils/fileManager';

function createMDHandleInstance(handle: DH | FH) {
  import('./MDHandle').then(({ default: MDHandle }) => {
    const el = window.document.createElement('div');

    el.style.position = 'relative';
    el.style.zIndex = 'var(--z-gighest)';

    window.document.body.appendChild(el);

    const root = createRoot(el);

    const destroy = () => {
      root.unmount();
      el.remove();
    };

    root.render(<MDHandle handle={handle} destroy={destroy} />);
  });
}

const mdHandler: FileHandle = {
  id: 'md-handler',
  ext: '.md',
  icon: <Icon icon="bxs--file-md" color="var(--color-primary)" />,
  open(file) {
    createMDHandleInstance(file);
  },
  contextMenu: {
    name: '用 MD 处理器打开',
    icon: <Icon icon="bxs--file-md" color="var(--color-primary)" />,
    handler(file) {
      createMDHandleInstance(file);
    }
  }
};

export default mdHandler;
