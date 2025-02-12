import { defineStore } from 'pinia'
import { store } from '../index'
import { useCache } from '@/hooks/web/useCache'
import { useLocaleStoreWithOut } from './locale'
// const { wsCache } = useCache()

interface UserState {
  token: string
  uid: string
  name: string
  oid: string
  language: string
  photo: string
  exp: number
  time: number
}

export const userStore = defineStore('user', {
  state: (): UserState => {
    return {
      token: null,
      uid: null,
      name: null,
      oid: null,
      language: 'zh-CN',
      exp: null,
      time: null,
      photo: null
    }
  },
  getters: {
    getToken(): string {
      return this.token
    },
    getUid(): string {
      return this.uid
    },
    getName(): string {
      return this.name
    },
    getOid(): string {
      return this.oid
    },
    getLanguage(): string {
      return this.language
    },
    getExp(): number {
      return this.exp
    },
    getTime(): number {
      return this.time
    }
  },
  actions: {
    async setUser() {
      const user = await import('@/api/user')
      try {
        const res = await user.userInfo()
        const data = res.data
        this.uid = data.username
        this.name = data.username
        this.photo = data.photo
        /* data.token = wsCache.get('user.token')
        data.exp = wsCache.get('user.exp')
        data.time = wsCache.get('user.time')
        const keys: string[] = ['token', 'uid', 'name', 'oid', 'language', 'exp', 'time']
  
        keys.forEach(key => {
          const dkey = key === 'uid' ? 'id' : key
          this[key] = data[dkey]
          wsCache.set('user.' + key, this[key])
        }) */
        const locale = useLocaleStoreWithOut()
        if (locale.getCurrentLocale?.lang !== this.language) {
          window.location.reload()
        }
        this.setLanguage(this.language)
      } catch (error) {
        useCache().wsCache.delete('user.token')
        console.log(error)
      }
    },
    setToken(token: string) {
      useCache().wsCache.set('user.token', token)
      this.token = token
    },
    setExp(exp: number) {
      useCache().wsCache.set('user.exp', exp)
      this.exp = exp
    },
    setTime(time: number) {
      useCache().wsCache.set('user.time', time)
      this.time = time
    },
    setUid(uid: string) {
      useCache().wsCache.set('user.uid', uid)
      this.uid = uid
    },
    setName(name: string) {
      useCache().wsCache.set('user.name', name)
      this.name = name
    },
    setOid(oid: string) {
      useCache().wsCache.set('user.oid', oid)
      this.oid = oid
    },
    setLanguage(language: string) {
      const locale = useLocaleStoreWithOut()
      if (!language || language === 'zh_CN') {
        language = 'zh-CN'
      }
      useCache().wsCache.set('user.language', language)
      this.language = language
      locale.setLang(language)
    },
    clear() {
      const keys: string[] = ['token', 'uid', 'name', 'oid', 'language', 'exp', 'time']
      const { wsCache } = useCache()
      keys.forEach(key => wsCache.delete('user.' + key))
    }
  }
})

export const useUserStoreWithOut = () => {
  return userStore(store)
}
