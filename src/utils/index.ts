export { default as EventEmitter } from './event';
export * from './fullscreen';
export * from './windowEvent';

export const sleep = (time: number, fn: (...anys: any[]) => any) => {
  const clearTimer = window.setTimeout(fn, time);

  return () => window.clearTimeout(clearTimer);
};
