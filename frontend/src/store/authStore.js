import { create } from 'zustand'
import { authAPI } from '../api'

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('sv_user') || 'null'),
  token: localStorage.getItem('sv_token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await authAPI.login({ email, password })
      localStorage.setItem('sv_token', data.access_token)
      localStorage.setItem('sv_user', JSON.stringify(data.user))
      set({ user: data.user, token: data.access_token, loading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Login failed', loading: false })
      return false
    }
  },

  register: async (email, full_name, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await authAPI.register({ email, full_name, password })
      localStorage.setItem('sv_token', data.access_token)
      localStorage.setItem('sv_user', JSON.stringify(data.user))
      set({ user: data.user, token: data.access_token, loading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Registration failed', loading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('sv_token')
    localStorage.removeItem('sv_user')
    set({ user: null, token: null })
  },

  clearError: () => set({ error: null }),
  isAuthenticated: () => !!get().token,
}))
