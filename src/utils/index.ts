export * from './canvas.ts';
export * from './error.ts';
export { default as EventEmitter } from './event';
export * from './file.ts';
export * from './fullscreen';
export { default as globalEvent } from './globalEventEmitter';
export * from './globalEventEmitter';
export * from './localStorageTools';
export * from './notification';
export { default as assetsLoadHandler } from './online.ts';
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

export const createElementContainer = () => {
  const container = window.document.createElement('div');

  container.style.position = 'relative';
  container.style.zIndex = 'var(--z-gighest)';
  container.style.width = '0';
  container.style.height = '0';

  window.document.body.appendChild(container);

  return container;
};

export const copy = (str: string) => {
  return window.navigator.clipboard.writeText(str);
};
