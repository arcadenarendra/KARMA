import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '../types'
import { api, setToken } from '../services/api'

interface AuthContextType {
  user: User | null
  ready: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, location?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('karm_token')) {
      setReady(true)
      return
    }
    api.me()
      .then(setUser)
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  const login = async (email: string, password: string) => {
    const result = await api.login({ email, password })
    setToken(result.token)
    setUser(result.user)
  }

  const register = async (name: string, email: string, password: string, location?: string) => {
    const result = await api.register({ name, email, password, location })
    setToken(result.token)
    setUser(result.user)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
