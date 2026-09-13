import React from 'react'
import { Clock, CheckCircle2, XCircle, Shield } from 'lucide-react'

export function VerificationStatus({ status, size = 'md', showLabel = true }) {
  const normalized = (status || 'AVAILABLE').toUpperCase()

  const config = {
    AVAILABLE: {
      label: 'AVAILABLE',
      icon: Shield,
      bg: 'rgba(56, 189, 248, 0.1)',
      border: 'rgba(56, 189, 248, 0.4)',
      color: '#38bdf8',
      glow: '0 0 12px rgba(56, 189, 248, 0.3)'
    },
    'PENDING VERIFICATION': {
      label: '⏳ PENDING VERIFICATION',
      icon: Clock,
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.5)',
      color: '#fbbf24',
      glow: '0 0 15px rgba(245, 158, 11, 0.35)',
      pulse: true
    },
    PENDING: {
      label: '⏳ PENDING VERIFICATION',
      icon: Clock,
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.5)',
      color: '#fbbf24',
      glow: '0 0 15px rgba(245, 158, 11, 0.35)',
      pulse: true
    },
    VERIFIED: {
      label: '✓ VERIFIED',
      icon: CheckCircle2,
      bg: 'rgba(52, 211, 153, 0.15)',
      border: 'rgba(52, 211, 153, 0.5)',
      color: '#34d399',
      glow: '0 0 15px rgba(52, 211, 153, 0.35)'
    },
    COMPLETED: {
      label: '✓ VERIFIED',
      icon: CheckCircle2,
      bg: 'rgba(52, 211, 153, 0.15)',
      border: 'rgba(52, 211, 153, 0.5)',
      color: '#34d399',
      glow: '0 0 15px rgba(52, 211, 153, 0.35)'
    },
    REJECTED: {
      label: '✕ REJECTED',
      icon: XCircle,
      bg: 'rgba(244, 63, 94, 0.15)',
      border: 'rgba(244, 63, 94, 0.5)',
      color: '#fb7185',
      glow: '0 0 15px rgba(244, 63, 94, 0.35)'
    }
  }

  const current = config[normalized] || config.AVAILABLE
  const Icon = current.icon

  const paddingStyle = size === 'sm' ? '0.2rem 0.55rem' : size === 'lg' ? '0.5rem 1rem' : '0.35rem 0.75rem'
  const fontSize = size === 'sm' ? '0.72rem' : size === 'lg' ? '0.88rem' : '0.78rem'
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: paddingStyle,
        borderRadius: '20px',
        background: current.bg,
        border: `1px solid ${current.border}`,
        boxShadow: current.glow,
        color: current.color,
        fontFamily: 'var(--font-title)',
        fontWeight: 800,
        fontSize,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease',
        animation: current.pulse ? 'pulseGlow 2s infinite' : 'none'
      }}
    >
      <Icon size={iconSize} />
      {showLabel && <span>{current.label}</span>}
    </div>
  )
}

export default VerificationStatus
