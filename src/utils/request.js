import axios from 'axios';
import { serverUrl, getToken } from './tools';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const instance = axios.create({
  baseURL: serverUrl,
  timeout: 5000,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    NProgress.start();
    // Do something before request is sent
    config.headers['token'] = getToken();
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    NProgress.done();
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 未授权跳转到登录页
    if (error.response.status === 401) {
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

/**
 * 发起get请求
 * @param {*} url
 * @param {*} params
 * @returns
 */
export const get = (url, params) => instance.get(url, { params });

/**
 * 发起post请求
 * @param {*} url
 * @param {*} data
 * @returns
 */
export const post = (url, data) => instance.post(url, data);

/**
 * 发起put请求
 * @param {*} url
 * @param {*} data
 * @returns
 */
export const put = (url, data) => instance.put(url, data);

/**
 * 发起一个del请求
 * @param {*} url
 * @returns
 */
export const del = (url) => instance.delete(url);
