import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { createElementContainer } from '@/utils';

import { Icon } from '@/components';

import type BackgroundManager from '../BackgroundManager';
import type { FileHandle } from '../hooks/useFileSystem';
import type { DH, FH } from '../utils/fileManager';

async function createMDHandleInstance(handle: DH | FH, bgm: BackgroundManager) {
  const { default: MDHandle } = await import('./component/MDHandle');

  const el = createElementContainer();
  const root = createRoot(el);
  const destroy = () => {
    root.unmount();
    el.remove();
  };
  root.render(
    <StrictMode>
      <MDHandle handle={handle} backgroundManager={bgm} destroy={destroy} />
    </StrictMode>
  );
}

const mdHandler: FileHandle = {
  id: 'md-handler',
  ext: '.md',
  icon: <Icon icon="bxs--file-md" color="var(--color-primary)" />,
  open(file, bgm) {
    return createMDHandleInstance(file, bgm);
  },
  contextMenu: {
    name: '用 MD 处理器打开',
    icon: <Icon icon="bxs--file-md" color="var(--color-primary)" />,
    handler(file, bgm) {
      return createMDHandleInstance(file, bgm);
    }
  }
};

export default mdHandler;
