import { defineStore } from 'pinia'
import type { AuthTokens, EmployeeProfile, LoginReq } from 'src/api/Api'
import { apiClient } from 'src/utils/api-client'

const TOKEN_STORAGE_KEY = 'warehouse:auth:tokens'
const PROFILE_STORAGE_KEY = 'warehouse:auth:profile'

const isClient = () => typeof window !== 'undefined'

const loadPersisted = <T>(key: string): T | null => {
  if (!isClient()) {
    return null
  }

  const rawValue = window.localStorage.getItem(key)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as T
  } catch (error) {
    console.warn(`ローカルストレージのデータを解析できません: ${key}`, error)
    window.localStorage.removeItem(key)
    return null
  }
}

const persist = <T>(key: string, value: T | null) => {
  if (!isClient()) {
    return
  }

  if (value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  } else {
    window.localStorage.removeItem(key)
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    tokens: null as AuthTokens | null,
    profile: null as EmployeeProfile | null,
    loading: false,
    initializing: false,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.tokens?.accessToken),
  },

  actions: {
    loadFromStorage(): void {
      if (this.tokens) {
        return
      }

      const storedTokens = loadPersisted<AuthTokens>(TOKEN_STORAGE_KEY)
      const storedProfile = loadPersisted<EmployeeProfile>(PROFILE_STORAGE_KEY)

      if (storedTokens) {
        this.tokens = storedTokens
        apiClient.setSecurityData(storedTokens)
      }

      if (storedProfile) {
        this.profile = storedProfile
      }
    },

    setTokens(tokens: AuthTokens | null): void {
      this.tokens = tokens
      persist(TOKEN_STORAGE_KEY, tokens)
      apiClient.setSecurityData(tokens)
    },

    setProfile(profile: EmployeeProfile | null): void {
      this.profile = profile
      persist(PROFILE_STORAGE_KEY, profile)
    },

    clearAuth(): void {
      this.setTokens(null)
      this.setProfile(null)
    },

    async initialize(): Promise<void> {
      if (this.initialized) {
        return
      }

      this.initializing = true
      this.loadFromStorage()

      if (this.tokens && !this.profile) {
        try {
          await this.fetchProfile()
        } catch (error) {
          console.warn('初期化時にユーザー情報の取得に失敗しました。認証状態をクリアします', error)
          this.clearAuth()
        }
      }

      this.initialized = true
      this.initializing = false
    },

    async login(payload: LoginReq): Promise<EmployeeProfile> {
      this.loading = true
      try {
        const resp = await apiClient.auth.login(payload)
        this.setTokens(resp.data.tokens)
        this.setProfile(resp.data.employee)
        return resp.data.employee
      } catch (error) {
        this.clearAuth()
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProfile(): Promise<EmployeeProfile | null> {
      if (!this.tokens) {
        this.setProfile(null)
        return null
      }

      try {
        const resp = await apiClient.auth.getAuthProfile()
        this.setProfile(resp.data.employee)
        return resp.data.employee
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました', error)
        throw error
      }
    },

    async refreshTokens(): Promise<AuthTokens | null> {
      const refreshToken = this.tokens?.refreshToken
      if (!refreshToken) {
        return null
      }

      try {
        const resp = await apiClient.auth.refreshToken({ refreshToken })
        this.setTokens(resp.data.tokens)
        this.setProfile(resp.data.employee)
        return resp.data.tokens
      } catch (error) {
        console.error('トークンの更新に失敗しました', error)
        this.clearAuth()
        throw error
      }
    },

    async logout(): Promise<void> {
      const refreshToken = this.tokens?.refreshToken

      try {
        if (refreshToken) {
          await apiClient.auth.logout({ refreshToken })
        }
      } catch (error) {
        console.warn('ログアウトリクエストに失敗しました。ローカル状態をクリアします', error)
      } finally {
        this.clearAuth()
      }
    },
  },
})
