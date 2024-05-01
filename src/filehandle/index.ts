import { default as FilePanelFactory } from './FilePanelFactory';

export * from './components/FilePanel';
export * from './components/FilePanelContainer';
export * from './hooks/useFileSystem';
export * from './utils/checkSupport';
export * from './utils/error';
export * from './utils/fileManager';

export default new FilePanelFactory();
