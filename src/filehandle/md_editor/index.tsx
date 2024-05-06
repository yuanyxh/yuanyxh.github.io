import { createRoot } from 'react-dom/client';

import { createElementContainer } from '@/utils';

import { Icon } from '@/components';

import type { FileHandle } from '../hooks/useFileSystem';
import type { DH, FH } from '../utils/fileManager';

async function createMDHandleInstance(handle: DH | FH) {
  const { default: MDHandle } = await import('./MDHandle');

  const el = createElementContainer();
  const root = createRoot(el);
  const destroy = () => {
    root.unmount();
    el.remove();
  };
  root.render(<MDHandle handle={handle} destroy={destroy} />);
  // .catch((err) => {
  //   // TODO: add global error sender
  //   window.alert((err as Error).message);
  // });
}

const mdHandler: FileHandle = {
  id: 'md-handler',
  ext: '.md',
  icon: <Icon icon="bxs--file-md" color="var(--color-primary)" />,
  open(file) {
    return createMDHandleInstance(file);
  },
  contextMenu: {
    name: '用 MD 处理器打开',
    icon: <Icon icon="bxs--file-md" color="var(--color-primary)" />,
    handler(file) {
      return createMDHandleInstance(file);
    }
  }
};

export default mdHandler;
