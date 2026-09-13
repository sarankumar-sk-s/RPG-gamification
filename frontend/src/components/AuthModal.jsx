import React, { useState } from 'react'
import {
  X,
  User,
  Lock,
  Mail,
  Sparkles,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Zap
} from 'lucide-react'
import { Button } from './Button'
import { useAuth } from '../context/AuthContext'

export function AuthModal({ isOpen, onClose, onSuccess }) {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }

    setIsLoading(true)
    try {
      if (mode === 'login') {
        await login(email.trim(), password)
      } else {
        await signup(email.trim(), password)
      }
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  // Quick Demo Login helper for easy testing
  const handleQuickDemoLogin = async () => {
    setIsLoading(true)
    setError('')
    const demoEmail = 'vanguard@liferpg.io'
    const demoPassword = 'password123'

    try {
      // Try login first
      try {
        await login(demoEmail, demoPassword)
      } catch (loginErr) {
        // If login fails, try signup then login
        await signup(demoEmail, demoPassword)
      }
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Demo initialization failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(180deg, #111827 0%, #0a0f1d 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.5)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Stripe */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #38bdf8, #f59e0b, #f43f5e)',
          width: '100%'
        }} />

        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 1.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#ffffff',
                margin: 0
              }}>
                {mode === 'login' ? 'OPERATOR LOGIN' : 'CREATE OPERATOR'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Access live FastAPI character stats & synchronization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(10, 14, 24, 0.6)'
        }}>
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setError('')
            }}
            style={{
              background: mode === 'login' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: mode === 'login' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              padding: '0.8rem',
              fontFamily: 'var(--font-title)',
              fontSize: '0.9rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: mode === 'login' ? 'var(--gold-light)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError('')
            }}
            style={{
              background: mode === 'signup' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: mode === 'signup' ? '2px solid var(--cyan-primary)' : '2px solid transparent',
              padding: '0.8rem',
              fontFamily: 'var(--font-title)',
              fontSize: '0.9rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: mode === 'signup' ? 'var(--cyan-light)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            SIGN UP
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem' }}>
          {error && (
            <div style={{
              marginBottom: '1.25rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#fb7185',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)',
              marginBottom: '0.45rem'
            }}>
              Operator Email
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.9rem'
            }}>
              <Mail size={16} color="var(--text-muted)" style={{ marginRight: '0.6rem' }} />
              <input
                type="email"
                placeholder="vanguard@liferpg.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)',
              marginBottom: '0.45rem'
            }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.9rem'
            }}>
              <Lock size={16} color="var(--text-muted)" style={{ marginRight: '0.6rem' }} />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant={mode === 'login' ? 'gold' : 'cyan'}
            size="lg"
            icon={ArrowRight}
            disabled={isLoading}
            id="auth-submit-btn"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}
          >
            {isLoading ? 'AUTHENTICATING...' : mode === 'login' ? 'SIGN IN TO CITADEL' : 'INITIALIZE NEW CHARACTER'}
          </Button>

          {/* Quick Demo One-Click Login */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1rem',
            textAlign: 'center'
          }}>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 1rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-title)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s'
              }}
            >
              <Zap size={16} /> ONE-CLICK TEST OPERATOR SIGN-IN
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthModal
