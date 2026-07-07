import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restaurer la session depuis le token JWT stocké
  useEffect(() => {
    const token = localStorage.getItem('dmg_token')
    if (token) {
      authAPI.me()
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('dmg_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('dmg_token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('dmg_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
