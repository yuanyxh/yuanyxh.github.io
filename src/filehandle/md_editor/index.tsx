import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { createElementContainer } from '@/utils';

import { Icon } from '@/components';

import type { IMDHandle } from './component/MDHandle';
import type { FileHandle } from '../hooks/useFileSystem';
import type { DH, FH } from '../utils/fileManager';

let MDHandle: typeof import('./component/MDHandle').default;
async function createMDHandleInstance(
  handle: DH | FH,
  props: Omit<IMDHandle, 'destroy' | 'handle'>
) {
  if (!MDHandle) {
    MDHandle = (await import('./component/MDHandle')).default;
  }

  const el = createElementContainer();
  const root = createRoot(el);

  const destroy = () => {
    root.unmount();
    el.remove();
  };

  root.render(
    <StrictMode>
      <MDHandle handle={handle} destroy={destroy} {...props} />
    </StrictMode>
  );
}

const mdHandler: FileHandle = {
  id: 'md-handler',
  ext: '.md',
  icon: <Icon icon="bxs--file-md" color="var(--color-primary)" />,
  open(file, props) {
    return createMDHandleInstance(file, props);
  },
  contextMenu: {
    name: '用 MD 处理器打开',
    icon: <Icon icon="bxs--file-md" color="var(--color-primary)" />,
    handler(file, props) {
      return createMDHandleInstance(file, props);
    }
  }
};

export default mdHandler;
