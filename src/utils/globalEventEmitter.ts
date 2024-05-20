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

class GlobalEvent {
  event = new EventEmitter();

  on(type: 'user_tips', fn: (data: GlobalEventInfo['user_tips']) => any): () => void;
  on(type: 'user_alert', fn: (data: GlobalEventInfo['user_alert']) => any): () => void;
  on<T extends GlobalEventKeys>(type: GlobalEventKeys, fn: (data: GlobalEventInfo[T]) => any) {
    return this.event.on(type, fn);
  }

  emit(type: 'user_tips', data: GlobalEventInfo['user_tips']): void;
  emit(type: 'user_alert', data: GlobalEventInfo['user_alert']): void;
  emit<T extends GlobalEventKeys>(type: GlobalEventKeys, data: GlobalEventInfo[T]) {
    this.event.emit(type, data);
  }
}

const globalEvent = new GlobalEvent();

export function success(message: string) {
  globalEvent.emit('user_tips', { type: 'success', message });
}

export function warning(message: string) {
  globalEvent.emit('user_tips', { type: 'warning', message });
}

export function error(message: string) {
  globalEvent.emit('user_tips', { type: 'error', message });
}

export function alert(props: Omit<ModalFuncProps, 'type'>) {
  globalEvent.emit('user_alert', { type: 'error', ...props });
}

export function confirm(props: Omit<ModalFuncProps, 'type'>) {
  globalEvent.emit('user_alert', { type: 'confirm', ...props });
}

export default globalEvent;
