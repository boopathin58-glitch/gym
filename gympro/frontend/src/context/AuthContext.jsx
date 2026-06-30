import { createContext, useContext, useState, useCallback } from 'react'
import API from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gympro_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const saveSession = (data) => {
    localStorage.setItem('gympro_access', data.accessToken)
    localStorage.setItem('gympro_refresh', data.refreshToken)
    localStorage.setItem('gympro_user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const clearSession = useCallback(() => {
    localStorage.removeItem('gympro_access')
    localStorage.removeItem('gympro_refresh')
    localStorage.removeItem('gympro_user')
    setUser(null)
  }, [])

  const register = async (formData) => {
    setLoading(true)
    try {
      const { data } = await API.post('/auth/register', formData)
      saveSession(data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed.' }
    } finally { setLoading(false) }
  }

  const login = async (email, password, role) => {
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', { email, password, role })
      saveSession(data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed.' }
    } finally { setLoading(false) }
  }

  // Accepts access_token (from useGoogleLogin) OR credential (from One Tap)
  const googleLogin = async (tokenOrCredential, role, type = 'access_token') => {
    setLoading(true)
    try {
      const payload = type === 'credential'
        ? { credential: tokenOrCredential, role }
        : { access_token: tokenOrCredential, role }

      const { data } = await API.post('/auth/google', payload)
      saveSession(data)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Google login failed.' }
    } finally { setLoading(false) }
  }

  const logout = async () => {
    try { await API.post('/auth/logout') } catch {}
    clearSession()
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    localStorage.setItem('gympro_user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, googleLogin, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
