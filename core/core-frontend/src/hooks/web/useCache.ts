/**
 * 配置浏览器本地存储的方式，可直接存储对象数组。
 */

import { useUserStoreWithOut } from '@/store/modules/user'
import WebStorageCache from 'web-storage-cache'

type CacheType = 'sessionStorage' | 'localStorage'

class MyWsCache extends WebStorageCache {
  constructor(...args: any[]) {
    super(...args)
  }

  get(key: string) {
    if (key.startsWith('user.')) {
      const userStore = useUserStoreWithOut()
      const userKey = key.substring(5)
      if (userKey === 'token') {
        let token: string = null
        if (!(token = userStore.getToken)) {
          const _U_T_ = document.cookie.match(/\b_U_T_=(.+)?;?/)?.[1]
          if (_U_T_) {
            token = _U_T_
            userStore.token = _U_T_
          }
        }
        return token
      }
      return userStore[userKey] ?? ''
    }
    return super.get(key)
  }

  delete(key: string): void {
    if (key === 'user.token') {
      useUserStoreWithOut().$reset()
      return
    }
    super.delete(key)
  }
}

const caches: Record<CacheType, { wsCache: MyWsCache }> = {
  localStorage: {
    wsCache: new MyWsCache({
      storage: 'localStorage'
    })
  },
  sessionStorage: {
    wsCache: new MyWsCache({
      storage: 'sessionStorage'
    })
  }
}

export const useCache = (type: CacheType = 'localStorage') => {
  return caches[type]
}
