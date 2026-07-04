import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
}

export const pdfAPI = {
  upload: (formData) => api.post('/pdf/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export const summaryAPI = {
  getMy: () => api.get('/summary/my'),
  getById: (id) => api.get(`/summary/${id}`),
  rate: (id, data) => api.post(`/summary/${id}/rate`, data),
  ask: (id, question) => api.post(`/summary/${id}/ask`, { question }),
  getAll: () => api.get('/summary/all'),
  getAnalytics: () => api.get('/summary/analytics'),
  toggleSave: (id) => api.patch(`/summary/${id}/save`),
  delete: (id) => api.delete(`/summary/${id}`),
}

export default api
