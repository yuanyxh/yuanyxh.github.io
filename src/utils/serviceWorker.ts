import EventEmitter from './event';

import { addGlobalListener, sleep } from '.';

interface ServiceWorkerManagerOptions {
  update(): any;
}

const EVENT_KEY = 'update';

const CACHE_KEYS = ['workbox', 'fontCache', 'imageCache'];

/**
 *
 * @description clear the service worker canche
 * @returns
 */
export async function clearCache() {
  return new Promise<boolean>((resolve) => {
    async function deleteIndexedDBCaches() {
      if (window.indexedDB.databases) {
        try {
          const databases = await window.indexedDB.databases();
          databases.map((database) => {
            const isFound = database.name?.includes('workbox');

            if (isFound) {
              const idb = window.indexedDB.deleteDatabase(database.name!);
              idb.onsuccess = () => resolve(true);
              idb.onerror = () => resolve(false);
            }
          });

          return true;
        } catch (_err) {
          /** empty */
        }
      }

      const idb = window.indexedDB.deleteDatabase('workbox-expiration');
      idb.onsuccess = () => resolve(true);
      idb.onerror = () => resolve(false);
    }

    const cachesPromise = window.caches.keys().then((keys) => {
      keys.map((key) => {
        const isFound = CACHE_KEYS.some((cacheKey) => key.includes(cacheKey));

        if (isFound) {
          window.caches.delete(key);
        }
      });
    });

    const indexedDBPromise = deleteIndexedDBCaches();

    Promise.all([cachesPromise, indexedDBPromise])
      .then(() => {
        resolve(true);
      })
      .catch(() => resolve(false));
  });
}

/** service workder manager */
class ServiceWorkerManager {
  private event = new EventEmitter();
  private serviceWorker: ServiceWorkerRegistration | undefined;

  private isRunning = false;

  private cancel: (() => any) | undefined;

  constructor(options?: ServiceWorkerManagerOptions) {
    if (options) {
      this.event.on(EVENT_KEY, options.update);
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in window.navigator) {
      return new Promise<boolean>((resolve) => {
        window.navigator.serviceWorker
          .register('/sw.js')
          .then((serviceWorker) => {
            resolve(true);

            this.listenUpdate();
            this.serviceWorker = serviceWorker;

            if (serviceWorker.waiting) {
              return this.event.emit(EVENT_KEY);
            }

            const _self = this;
            function serviceWorkerUpdate() {
              const installingWorker = serviceWorker.installing;

              function stateChange() {
                if (installingWorker?.state === 'installed' && navigator.serviceWorker.controller) {
                  _self.event.emit(EVENT_KEY);

                  installingWorker.removeEventListener('statechange', stateChange);
                }
              }

              installingWorker?.addEventListener('statechange', stateChange);

              serviceWorker.removeEventListener('updatefound', serviceWorkerUpdate);
            }

            serviceWorker.addEventListener('updatefound', serviceWorkerUpdate);
          })
          .catch(() => {
            resolve(false);
          });
      });
    }

    return Promise.resolve(false);
  }

  async unregisterServiceWorker() {
    const cleared = await clearCache();

    if (!cleared) {
      return false;
    }

    let uninstalled = await navigator.serviceWorker.ready.then((registration) =>
      registration.unregister()
    );

    if (!uninstalled) {
      uninstalled =
        (await navigator.serviceWorker
          ?.getRegistration()
          .then((sw) => sw?.unregister() || false)) || false;

      return uninstalled;
    }

    return true;
  }

  private listenUpdate() {
    addGlobalListener(
      'click',
      () => {
        if (this.cancel) return;

        this.cancel = sleep(8000, () => {
          if (
            window.document.hidden === false &&
            !(this.serviceWorker?.installing || this.serviceWorker?.waiting)
          ) {
            this.serviceWorker?.update();
          }

          this.cancel = void 0;
        });
      },
      true
    );

    window.document.addEventListener('visibilitychange', () => {
      if (
        window.document.hidden === false &&
        !(this.cancel || this.serviceWorker?.installing || this.serviceWorker?.waiting)
      ) {
        this.serviceWorker?.update();
      }
    });
  }

  skipWaiting() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.serviceWorker?.waiting?.postMessage({ type: 'SKIP_WAITING' });

    return new Promise((resolve) => sleep(200, resolve)).then(() => {
      this.isRunning = false;
      window.location.reload();
    });
  }
}

export default ServiceWorkerManager;
