import EventEmitter from './event';

type AddGlobalListener = <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  capture?: boolean
) => any;

const event = new EventEmitter();

const map: {
  [key: string]: any;
} = {};

export const addGlobalListener: AddGlobalListener = (
  type,
  listener,
  capture
) => {
  const _type = capture ? `${type}Capture` : type;

  if (!event.has(_type)) {
    const _listener = (...args: any[]) => {
      event.emit(_type, ...args);
    };

    map[_type] = _listener;

    window.addEventListener(type, _listener, capture);
  }

  const cancel = event.on(_type, listener);

  return () => {
    cancel();

    if (!event.has(_type)) {
      window.removeEventListener(type, map[_type], capture);
    }
  };
};
