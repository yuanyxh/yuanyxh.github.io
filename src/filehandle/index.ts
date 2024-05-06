import { default as FilePanelFactoryInner } from './FilePanelFactory';

export { getStorageUsage } from './utils';
export * from './utils/checkSupport';

export type FilePanelFactory = FilePanelFactoryInner;

export default new FilePanelFactoryInner();
