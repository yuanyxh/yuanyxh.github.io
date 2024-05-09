import { merge } from 'lodash-es';

export const KEYS = {
  /** Website configuration key */
  APP_KEY: 'app',
  USER_KEY: 'user'
} as const;

type TKEYS = (typeof KEYS)[keyof typeof KEYS];

export function setStorage(key: TKEYS, data: any) {
  try {
    if (!data) {
      data = '';
    } else if (typeof data === 'object') {
      data = window.JSON.stringify(data);
    }

    window.localStorage.setItem(key, data);

    return true;
  } catch (err) {
    return false;
  }
}

export function removeStorage(key: TKEYS) {
  try {
    window.localStorage.removeItem(key);

    return true;
  } catch (err) {
    return false;
  }
}

export function getStorage<T>(key: TKEYS, fallback?: T): T;
export function getStorage<T>(key: TKEYS, fallback?: T): T | undefined {
  const value = window.localStorage.getItem(key);

  if (value === null) {
    return fallback;
  }

  try {
    return merge(fallback, window.JSON.parse(value));
  } catch (err) {
    return fallback;
  }
}

export function hasLocalStorage(key: TKEYS) {
  return !!window.localStorage.getItem(key);
}

export function clearStorage() {
  window.localStorage.clear();
}
