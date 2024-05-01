export { default as EventEmitter } from './event';
export * from './fullscreen';
export * from './localStorageTools';
export * from './notification';
export * from './permissions';
export { default as ServiceWorkerManager } from './serviceWorker';
export * from './serviceWorker';
export * from './windowEvent';

export const sleep = (time: number, fn: (...anys: any[]) => any) => {
  const clearTimer = window.setTimeout(fn, time);

  return () => window.clearTimeout(clearTimer);
};

export const uuid = () => {
  if (!window.crypto?.randomUUID) {
    return [8, 4, 4, 4, 12]
      .reduce((prev, curr) => {
        return `${prev}-${Math.random()
          .toString(16)
          .slice(2, 2 + curr)
          .padStart(curr, '0')}`;
      }, '')
      .slice(1);
  }

  return window.crypto.randomUUID();
};

export const validateFileName = (name: string) => {
  if (name.trim() === '') return false;

  return /^[^\\/:*?'`"<>|]{0,255}[^\\/:*?"`<>|.']$/.test(name.trim());
};
