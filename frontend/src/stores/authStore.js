import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const token = ref(localStorage.getItem('token') || null)

  // Getters de Roles y Estados
  const isStudent = computed(() => user.value?.role === 'USER' && !user.value?.is_tutor)
  const isTutor = computed(() => user.value?.role === 'USER' && user.value?.is_tutor)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isApprovedTutor = computed(() => isTutor.value && user.value?.verification_status === 'APPROVED')

  const login = async (credentials) => {
    try {
      // Mock API call for now
      // const response = await api.post('/auth/login', credentials)
      
      // Simulate successful login (modificado para incluir atributos de rol para pruebas)
      const mockResponse = { 
        user: { 
          id: 1, 
          name: 'Usuario Prueba', 
          role: 'USER', 
          is_tutor: false, 
          verification_status: 'APPROVED' 
        }, 
        token: 'mock-token' 
      }
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
    isStudent,
    isTutor,
    isAdmin,
    isApprovedTutor,
    login,
    logout,
    setAuth
  }
})
