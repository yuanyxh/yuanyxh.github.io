class FullScreenError extends Error {
  status = 400;

  constructor() {
    super('抱歉，无法进入全屏模式。');
  }
}

export const requestFullScreen = async (ele?: HTMLElement) => {
  if (isFullScreenEnabled()) {
    return new Promise<true>((resolve, reject) => {
      ele = ele || window.document.documentElement;

      function removeListener() {
        ele?.removeEventListener('fullscreenchange', success);
        ele?.removeEventListener('fullscreenerror', fail);
      }

      function success() {
        resolve(true);

        removeListener();
      }

      function fail() {
        reject(new FullScreenError());

        removeListener();
      }

      ele.addEventListener('fullscreenchange', success);

      ele.addEventListener('fullscreenerror', fail);

      try {
        ele.requestFullscreen({ navigationUI: 'hide' });
      } catch (err) {
        /* empty */
        fail();
      }
    });
  }

  return false;
};

export const isFullScreen = () => {
  return window.document.fullscreenElement !== null;
};

export const isFullScreenEnabled = () => {
  return window.document.fullscreenEnabled;
};

export const fallbackFullscreen = () => {
  return window.document.exitFullscreen();
};
