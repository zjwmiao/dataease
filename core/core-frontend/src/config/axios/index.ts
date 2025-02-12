import { MyAxiosRequestConfig, service } from './service'

import { config } from './config'

const { default_headers } = config

const request = (option: any) => {
  const { headersType } = option
  return service({
    ...option,
    headers: {
      'Content-Type': headersType || default_headers
    }
  })
}

export default {
  get: <T = any, C extends MyAxiosRequestConfig = MyAxiosRequestConfig>(option: C) => {
    return request({ method: 'get', ...option }) as unknown as T
  },
  post: <T = any, C extends MyAxiosRequestConfig = MyAxiosRequestConfig>(option: C) => {
    return request({ method: 'post', ...option }) as unknown as T
  },
  delete: <T = any, C extends MyAxiosRequestConfig = MyAxiosRequestConfig>(option: C) => {
    return request({ method: 'delete', ...option }) as unknown as T
  },
  put: <T = any, C extends MyAxiosRequestConfig = MyAxiosRequestConfig>(option: C) => {
    return request({ method: 'put', ...option }) as unknown as T
  }
}
