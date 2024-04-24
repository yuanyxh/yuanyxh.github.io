import EventEmitter from './event';

import { sleep } from '.';

interface ServiceWorkerManagerOptions {
  update(): any;
}

const EVENT_KEY = 'update';

const CACHE_KEYS = ['workbox', 'fontCache', 'imageCache'];

export async function clearCache() {
  return new Promise<boolean>((resolve) => {
    async function deleteIndexedDBCaches() {
      if (window.indexedDB.databases) {
        try {
          const databases = await window.indexedDB.databases();
          databases.map((database) => {
            const isFound = database.name?.includes('workbox');

            console.error(database);

            if (isFound) {
              window.indexedDB.deleteDatabase(database.name!);
            }
          });

          return true;
        } catch (err) {
          /** empty */
        }
      }

      return window.indexedDB.deleteDatabase('workbox-expiration');
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

class ServiceWorkerManager {
  private event = new EventEmitter();
  private serviceWorker: ServiceWorkerRegistration | undefined;

  private isRunning = false;

  constructor(options?: ServiceWorkerManagerOptions) {
    if (options) {
      this.event.on(EVENT_KEY, options.update);
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in window.navigator) {
      return new Promise<boolean>((resolve) => {
        window.navigator.serviceWorker
          .register('./sw.js')
          .then((serviceWorker) => {
            resolve(true);

            this.serviceWorker = serviceWorker;

            if (serviceWorker.waiting) {
              return this.event.emit(EVENT_KEY);
            }

            const _self = this;
            function serviceWorkerUpdate() {
              const installingWorker = serviceWorker.installing;

              function stateChange() {
                if (
                  installingWorker?.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  _self.event.emit(EVENT_KEY);

                  installingWorker.removeEventListener(
                    'statechange',
                    stateChange
                  );
                }
              }

              installingWorker?.addEventListener('statechange', stateChange);

              serviceWorker.removeEventListener(
                'updatefound',
                serviceWorkerUpdate
              );
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
    if (!this.serviceWorker) return false;

    const uninstalled = await this.serviceWorker.unregister();

    if (uninstalled) {
      return await clearCache();
    }

    return false;
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
