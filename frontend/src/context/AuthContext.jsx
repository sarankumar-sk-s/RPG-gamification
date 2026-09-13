import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, getToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [character, setCharacter] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch current user & character
  const refreshProfile = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setCharacter(null)
      setIsLoading(false)
      return null
    }

    try {
      setIsLoading(true)
      setError(null)
      const userData = await authApi.getMe()
      setUser(userData)
      setCharacter(userData?.character || null)
      return userData
    } catch (err) {
      console.warn('Auth check error:', err.message)
      setError(err.message)
      // If 401 unauthorized, clear token
      if (err.status === 401) {
        authApi.logout()
        setUser(null)
        setCharacter(null)
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  // Login
  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      await authApi.login(email, password)
      const userData = await refreshProfile()
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Signup
  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const newUser = await authApi.signup(email, password)
      // Auto login upon successful registration
      await authApi.login(email, password)
      await refreshProfile()
      return newUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = () => {
    authApi.logout()
    setUser(null)
    setCharacter(null)
  }

  const value = {
    user,
    character,
    isAuthenticated: !!user && !!getToken(),
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshProfile,
    setCharacter
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
