class FullScreenError extends Error {
  status = 400;

  constructor() {
    super('抱歉，无法进入全屏模式。');
  }
}

/**
 *
 * @description request enter the full screen mode
 * @param ele
 * @returns
 */
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
      } catch (_err) {
        fail();
      }
    });
  }

  return false;
};

/**
 *
 * @description listener the full screen mode change
 * @param cb
 * @param ele
 * @returns
 */
export const onFullScreen = (cb: (isFullScreen: boolean) => any, ele?: HTMLElement) => {
  function onChange() {
    cb(isFullScreen());
  }

  (ele || document.documentElement).addEventListener('fullscreenchange', onChange);

  return () => {
    (ele || document.documentElement).removeEventListener('fullscreenchange', onChange);
  };
};

/**
 *
 * @description check current is full screen mode
 * @param ele
 * @returns
 */
export const isFullScreen = (ele?: Element) => {
  if (ele) {
    return window.document.fullscreenElement === ele;
  }

  return window.document.fullscreenElement !== null;
};

/**
 *
 * @description full screen mode is enable with current browser
 * @returns
 */
export const isFullScreenEnabled = () => {
  return window.document.fullscreenEnabled;
};

/**
 *
 * @description fallback full screen mode
 * @returns
 */
export const fallbackFullscreen = () => {
  return window.document.exitFullscreen();
};
