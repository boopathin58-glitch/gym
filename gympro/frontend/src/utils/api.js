import axios from 'axios'

// In production (Render), use the full backend URL via env var
// In development, use Vite proxy (just /api)
const baseURL = import.meta.env.VITE_API_URL || '/api'

const API = axios.create({ baseURL, withCredentials: true })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('gympro_access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('gympro_refresh')
        if (!refresh) throw new Error('No refresh token')
        const { data } = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken: refresh })
        localStorage.setItem('gympro_access', data.accessToken)
        localStorage.setItem('gympro_refresh', data.refreshToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return API(original)
      } catch {
        localStorage.removeItem('gympro_access')
        localStorage.removeItem('gympro_refresh')
        localStorage.removeItem('gympro_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default API
