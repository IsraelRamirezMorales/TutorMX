import axios from 'axios'

// API base URL configuration (can be driven by env vars)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: Interceptors for auth tokens, etc.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors, e.g., 401 Unauthorized
    if (error.response?.status === 401) {
      // e.g. logout user
    }
    return Promise.reject(error)
  }
)

export default api
