export { default as EventEmitter } from './event';
export * from './fullscreen';
export * from './localStorageTools';
export * from './notification';
export { default as ServiceWorkerManager } from './serviceWorker';
export * from './serviceWorker';
export * from './windowEvent';

export const sleep = (time: number, fn: (...anys: any[]) => any) => {
  const clearTimer = window.setTimeout(fn, time);

  return () => window.clearTimeout(clearTimer);
};
