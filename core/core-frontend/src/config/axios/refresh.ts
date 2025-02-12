import { useCache } from '@/hooks/web/useCache'
import { refreshApi } from '@/api/login'
import { useUserStoreWithOut } from '@/store/modules/user'
import { useRequestStoreWithOut } from '@/store/modules/request'

import { isLink } from '@/utils/utils'
import { AxiosRequestConfig } from 'axios'
const { wsCache } = useCache()
const userStore = useUserStoreWithOut()
const requestStore = useRequestStoreWithOut()
const refreshUrl = '/login/refresh'

const expConstants = 10000

const expTimeConstants = 90000

const isExpired = () => {
  const exp = wsCache.get('user.exp')
  if (!exp) {
    return false
  }
  const time = wsCache.get('user.time')
  if (!time) {
    return exp - Date.now() < expConstants
  }
  return Date.now() - time > expTimeConstants
}

const delayExecute = (token: string) => {
  const cachedRequestList = requestStore.getRequestList
  cachedRequestList.forEach(cb => {
    cb(token)
  })
  requestStore.cleanCacheRequest()
}

const getRefreshStatus = () => {
  return wsCache.get('de-global-refresh') || false
}
const setRefreshStatus = (status: boolean) => {
  wsCache.set('de-global-refresh', status, { exp: 5 })
}

const cacheRequest = cb => {
  requestStore.addCacheRequest(cb)
}

export const configHandler = <T extends AxiosRequestConfig>(config: T) => {
  const desktop = wsCache.get('app.desktop')
  if (desktop) {
    return config
  }
  if (isLink()) {
    return config
  }
  if (wsCache.get('user.token')) {
    config.headers['X-DE-TOKEN'] =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjEsIm9pZCI6MX0.UK4jQ8CzyC8nylz_eAFZMa8agK9vCF2zt9GQENwXbV0'
    const expired = isExpired()
    if (expired && config.url !== refreshUrl) {
      if (!getRefreshStatus()) {
        setRefreshStatus(true)
        refreshApi()
          .then(res => {
            userStore.setToken(res.data.token)
            userStore.setExp(res.data.exp)
            userStore.setTime(Date.now())
            config.headers['X-DE-TOKEN'] = res.data.token
            delayExecute(res.data.token)
          })
          .catch(e => {
            console.error(e)
          })
          .finally(() => {
            setRefreshStatus(false)
          })
      }
      const retry = new Promise<T>(resolve => {
        cacheRequest(token => {
          config.headers['X-DE-TOKEN'] = token
          resolve(config)
        })
      })
      return retry
    } else {
      return config
    }
  }
  return config
}
