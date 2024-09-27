import EventEmitter from './event';

type AddGlobalListener = <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) => any;

const event = new EventEmitter();

const map: {
  [key: string]: any;
} = {};

/**
 *
 * @description add window event listener
 * @param type
 * @param listener
 * @param options
 * @returns
 */
export const addGlobalListener: AddGlobalListener = (type, listener, options) => {
  let capture = false;
  if (typeof options === 'boolean') {
    capture = options;
  } else if (options && typeof options === 'object') {
    capture = options.capture || false;
  }

  const _type = capture ? `${type}Capture` : type;

  if (!event.has(_type)) {
    const _listener = (...args: any[]) => {
      event.emit(_type, ...args);
    };

    map[_type] = _listener;

    window.addEventListener(type, _listener, options);
  }

  const cancel = event.on(
    _type,
    listener,
    typeof options === 'object' ? options.signal && { signal: options.signal } : void 0
  );

  return () => {
    cancel();

    if (!event.has(_type)) {
      window.removeEventListener(type, map[_type], options);
    }
  };
};
