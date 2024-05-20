import EventEmitter from './event';
import { warning } from './globalEventEmitter';
import { addGlobalListener } from './windowEvent';

import { sleep } from '.';

const LOAD_ERROR_KEY = 'load_error';

class AssetsLoadHandle {
  event = new EventEmitter();

  private cb = () => false;

  private listener = () => {
    if (!window.navigator.onLine) {
      const _listener = () => {
        cancelOnlineListener();

        if (this.cb()) {
          warning('即将在三秒后重载页面。');
          sleep(3000, () => window.location.reload());
        }
      };

      const cancelOnlineListener = addGlobalListener('online', _listener);
    }
  };

  emitRenderError() {
    this.event.emit(LOAD_ERROR_KEY);
  }

  reLoadByOnline(cb: () => boolean) {
    this.cb = cb;

    const cancelGlobalErrorListener = addGlobalListener('error', this.listener, true);
    const cancelRenderErrorListener = this.event.on(LOAD_ERROR_KEY, this.listener);

    return () => {
      cancelGlobalErrorListener();
      cancelRenderErrorListener();
    };
  }
}

export default new AssetsLoadHandle();
