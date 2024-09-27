import type { ModalFuncProps } from 'antd';

import EventEmitter from './event';

interface GlobalEventInfo {
  user_tips: {
    type: 'success' | 'warning' | 'error';
    message: string;
  };
  user_alert: {
    type: 'error' | 'confirm';
  } & ModalFuncProps;
}

type GlobalEventKeys = keyof GlobalEventInfo;

/**
 *
 * @description global event object, Cross-component communication
 */
class GlobalEvent {
  event = new EventEmitter();

  /**
   *
   * @description listen to user message
   * @param type
   * @param fn
   */
  on(
    type: 'user_tips',
    fn: (data: GlobalEventInfo['user_tips']) => any,
    options?: EventOptions
  ): () => void;
  on(
    type: 'user_alert',
    fn: (data: GlobalEventInfo['user_alert']) => any,
    options?: EventOptions
  ): () => void;
  on<T extends GlobalEventKeys>(
    type: GlobalEventKeys,
    fn: (data: GlobalEventInfo[T]) => any,
    options?: EventOptions
  ) {
    return this.event.on(type, fn, options);
  }

  /**
   *
   * @description notify message to user
   * @param type
   * @param data
   */
  emit(type: 'user_tips', data: GlobalEventInfo['user_tips']): void;
  emit(type: 'user_alert', data: GlobalEventInfo['user_alert']): void;
  emit<T extends GlobalEventKeys>(type: GlobalEventKeys, data: GlobalEventInfo[T]) {
    this.event.emit(type, data);
  }
}

const globalEvent = new GlobalEvent();

/**
 *
 * @description alert success message
 * @param message
 */
export function success(message: string) {
  globalEvent.emit('user_tips', { type: 'success', message });
}

/**
 *
 * @description alert warning message
 * @param message
 */
export function warning(message: string) {
  globalEvent.emit('user_tips', { type: 'warning', message });
}

/**
 *
 * @description alert error message
 * @param message
 */
export function error(message: string) {
  globalEvent.emit('user_tips', { type: 'error', message });
}

/**
 *
 * @description alert normal message
 * @param message
 */
export function alert(props: Omit<ModalFuncProps, 'type'>) {
  globalEvent.emit('user_alert', { type: 'error', ...props });
}

/**
 *
 * @description alert confirm message
 * @param message
 */
export function confirm(props: Omit<ModalFuncProps, 'type'>) {
  globalEvent.emit('user_alert', { type: 'confirm', ...props });
}

export default globalEvent;
