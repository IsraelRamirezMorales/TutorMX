import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const token = ref(localStorage.getItem('token') || null)

  const login = async (credentials) => {
    try {
      // Mock API call for now
      // const response = await api.post('/auth/login', credentials)
      
      // Simulate successful login
      const mockResponse = { user: { id: 1, name: 'Student' }, token: 'mock-token' }
      setAuth(mockResponse.user, mockResponse.token)
      return true
    } catch (error) {
      console.error('Login error', error)
      return false
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    token.value = null
    localStorage.removeItem('token')
  }

  const setAuth = (userData, authToken) => {
    user.value = userData
    isAuthenticated.value = true
    token.value = authToken
    localStorage.setItem('token', authToken)
  }

  return {
    user,
    isAuthenticated,
    token,
    login,
    logout,
    setAuth
  }
})
