import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, setToken, getToken } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    // try restore from token
    (async () => {
      try {
        const t = getToken()
        if (t) {
          const me = await api.get('/api/auth/me')
          setUser(me.user)
        }
      } catch (e) {
        setToken(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    else localStorage.removeItem('auth_user')
  }, [user])

  const login = async ({ email, password }) => {
    if (!email || !password) throw new Error('Email and password required')
    setError('')
    const res = await api.post('/api/auth/login', { email, password })
    setToken(res.token)
    setUser(res.user)
    return res.user
  }

  const register = async ({ name, email, password, role = 'user' }) => {
    if (!name || !email || !password) throw new Error('All fields required')
    setError('')
    const res = await api.post('/api/auth/register', { name, email, password, role })
    setToken(res.token)
    setUser(res.user)
    return res.user
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, error, login, register, logout }), [user, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
