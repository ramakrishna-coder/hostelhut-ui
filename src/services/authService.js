import api from '../utils/api'

export const authService = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials)
    return response.data
  },

  logout: async (refreshToken) => {
    // Create a custom config that will override the interceptor
    const response = await api.get('/api/auth/logout', {
      headers: {
        'Authorization': refreshToken
      },
      // Add a flag to bypass the automatic access token addition
      skipAuthInterceptor: true
    })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  getUserProfile: async () => {
    const response = await api.get('/api/auth/user')
    return response.data
  },

  uploadProfilePicture: async (formData) => {
    const response = await api.post('/api/auth/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  refreshToken: async (refreshToken) => {
    const response = await api.get('/api/auth/refresh', {
      headers: {
        'Authorization': refreshToken
      },
      // Add a flag to bypass the automatic access token addition
      skipAuthInterceptor: true
    })
    return response.data
  },
}
