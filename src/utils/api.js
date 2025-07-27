import axios from 'axios'
import store from '../store/store'
import { updateTokens, logout } from '../store/slices/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Skip adding access token if skipAuthInterceptor flag is set
    if (config.skipAuthInterceptor) {
      return config
    }
    
    const state = store.getState()
    const accessToken = state.auth.accessToken
    
    if (accessToken) {
      config.headers.Authorization = accessToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const state = store.getState()
      const refreshToken = state.auth.refreshToken
      
      if (refreshToken) {
        try {
          // Call refresh endpoint
          const response = await axios.get(
            `${API_BASE_URL}/api/auth/refresh`,
            {
              headers: {
                'Authorization': refreshToken
              }
            }
          )
          
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
          
          // Update tokens in Redux store and localStorage
          store.dispatch(updateTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          }))
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = newAccessToken
          return api(originalRequest)
          
        } catch (refreshError) {
          // Refresh failed, logout user
          store.dispatch(logout())
          window.location.href = '/'
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token, logout user
        store.dispatch(logout())
        window.location.href = '/'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
