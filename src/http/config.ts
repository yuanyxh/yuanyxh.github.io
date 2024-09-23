import { ErrorMessage } from './commonEnum';

import axios, { AxiosError, AxiosInstance } from 'axios';

/**
 * @description axios instance copy
 */
export const request = axios.create({
  baseURL: 'https://api.yuanyxh.com/',
  headers: {
    'Content-Type': 'application/json; chatset=utf-8'
  },
  responseType: 'json'
});

/**
 *
 * @description http get method
 */
export const get: AxiosInstance['get'] = (...args) => {
  return request.get(...args);
};

/**
 *
 * @description http post method
 */
export const post: AxiosInstance['post'] = (...args) => {
  return request.post(...args);
};

request.interceptors.response.use(
  function onFulfilled(res) {
    if (res.data?.code === 200) {
      return res.data;
    }

    return Promise.reject(res.data?.message || ErrorMessage.UNKNOWN);
  },
  function onRejected(err: AxiosError) {
    return Promise.reject(err.message || ErrorMessage.UNKNOWN);
  }
);
