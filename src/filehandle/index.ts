import { default as FilePanelFactoryInner } from './FilePanelFactory';

export * from './components/FilePanel';
export * from './components/FilePanelContainer';
export * from './hooks/useFileSystem';
export * from './utils';
export * from './utils/checkSupport';
export * from './utils/error';
export * from './utils/fileManager';

export type FilePanelFactory = FilePanelFactoryInner;

export default new FilePanelFactoryInner();
