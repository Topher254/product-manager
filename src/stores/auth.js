import { defineStore } from 'pinia'
import { apiRequest } from '../services/api'

const STORAGE_KEY = 'pm-auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    refreshToken: '',
    user: null,
    status: 'idle',
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(credentials) {
      this.status = 'loading'
      this.error = null

      try {
        const payload = await apiRequest('/auth/login', {
          method: 'POST',
          body: credentials,
        })

        this.token = payload.accessToken || payload.token || ''
        this.refreshToken = payload.refreshToken || ''
        this.user = {
          id: payload.id,
          username: payload.username,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          image: payload.image,
        }

        this.persist()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to login'
        throw error
      } finally {
        this.status = 'idle'
      }
    },
    logout() {
      this.token = ''
      this.refreshToken = ''
      this.user = null
      localStorage.removeItem(STORAGE_KEY)
    },
    restoreSession() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        this.token = parsed.token
        this.refreshToken = parsed.refreshToken || ''
        this.user = parsed.user
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token: this.token,
          refreshToken: this.refreshToken,
          user: this.user,
        }),
      )
    },
  },
})

