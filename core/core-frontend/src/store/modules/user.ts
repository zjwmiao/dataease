import { defineStore } from 'pinia'
import { store } from '../index'
import { useCache } from '@/hooks/web/useCache'
import { useLocaleStoreWithOut } from './locale'

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
      const { userInfo: getUserInfo, oneIdUserInfo: getOneIdUserInfo } = await import('@/api/user')
      try {
        const [userInfo, oneIdUserInfo] = await Promise.all([getUserInfo(), getOneIdUserInfo()])
        this.name = oneIdUserInfo.username
        this.photo = oneIdUserInfo.photo
        this.exp = 0
        this.time = Date.now()

        const keys: string[] = ['uid', 'oid', 'language']
        keys.forEach(key => {
          const dkey = key === 'uid' ? 'id' : key
          this[key] = userInfo[dkey]
        })
        /* const locale = useLocaleStoreWithOut()
        if (locale.getCurrentLocale?.lang !== this.language) {
          window.location.reload()
        } */
        this.setLanguage(this.language)
      } catch (error) {
        useCache().wsCache.delete('user.token')
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
      this.$reset()
    }
  }
})

export const useUserStoreWithOut = () => {
  return userStore(store)
}
