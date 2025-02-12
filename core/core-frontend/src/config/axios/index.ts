import { service } from './service'

import { config } from './config'
import { AxiosRequestConfig } from 'axios'

const { default_headers } = config

const request = (option: any) => {
  const { url, method, params, data, headersType, responseType, loading } = option
  return service({
    url,
    ...(option.baseURL ? { baseURL: option.baseURL } : {}),
    method,
    loading,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers
    }
  })
}

export default {
  get: <T = any, C extends AxiosRequestConfig = AxiosRequestConfig>(option: C) => {
    return request({ method: 'get', ...option }) as unknown as T
  },
  post: <T = any, C extends AxiosRequestConfig = AxiosRequestConfig>(option: C) => {
    return request({ method: 'post', ...option }) as unknown as T
  },
  delete: <T = any, C extends AxiosRequestConfig = AxiosRequestConfig>(option: C) => {
    return request({ method: 'delete', ...option }) as unknown as T
  },
  put: <T = any, C extends AxiosRequestConfig = AxiosRequestConfig>(option: C) => {
    return request({ method: 'put', ...option }) as unknown as T
  }
}
