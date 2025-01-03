interface NotifyOptions extends NotificationOptions {
  title: string;
  onShow?(): any;
  onError?(): any;
  onClick?(): any;
  onClose?(): any;
}

type NotifyPermissionStatus = 'allow' | 'cancel' | 'reject';

/**
 *
 * @description request notify permission
 * @returns
 */
export async function requestNotifyPermission() {
  return new Promise<NotifyPermissionStatus>((resolve, reject) => {
    window.Notification.requestPermission((e) => {
      switch (e) {
        case 'default':
          resolve('cancel');
          break;
        case 'denied':
          resolve('reject');
          break;
        case 'granted':
          resolve('allow');
          break;
        default:
          reject('unknow error');
          break;
      }
    });
  });
}

/**
 *
 * @description notify user
 * @param options
 * @returns
 */
export async function notify(options: NotifyOptions) {
  const status = await requestNotifyPermission();

  if (status !== 'allow') {
    return status;
  }

  return new Promise<boolean>((resolve) => {
    const { title, onShow, onError, onClick, onClose, ...rest } = options;

    const notice = new window.Notification(title, rest);

    notice.addEventListener('click', function click() {
      notice.removeEventListener('click', click);

      if (onClick) {
        return onClick();
      }

      notice.close();
    });

    if (onClose) {
      notice.addEventListener('close', onClose);
    }

    notice.addEventListener('show', function show() {
      notice.removeEventListener('show', show);

      resolve(true);

      onShow?.();
    });
  });
}
