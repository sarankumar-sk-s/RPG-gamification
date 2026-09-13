import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Sparkles } from 'lucide-react'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #060910 0%, #030408 100%)',
          color: '#ffffff',
          fontFamily: 'var(--font-title)'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '2px solid var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            boxShadow: '0 0 35px rgba(245, 158, 11, 0.4)',
            marginBottom: '1.5rem',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}
        >
          <Shield size={32} />
        </div>
        <div
          style={{
            fontSize: '1.1rem',
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: 'var(--text-gold)',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Sparkles size={18} /> CITADEL TELEMETRY LINKING...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
