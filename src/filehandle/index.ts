import { default as FilePanelFactoryInner } from './FilePanelFactory';

export { getStorageUsage } from './utils';
export * from './utils/checkSupport';

export type FilePanelFactory = FilePanelFactoryInner;

/** file system manager, concrete file management panel */
export default new FilePanelFactoryInner();
