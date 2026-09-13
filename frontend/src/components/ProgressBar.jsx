import React from 'react'

export function ProgressBar({
  value = 0,
  max = 100,
  variant = 'gold', // gold | red | cyan | purple | green
  size = 'md', // sm | md | lg
  showLabel = false,
  label,
  striped = true,
  glow = true,
  className = '',
  style = {},
}) {
  const percentage = Math.min(Math.max((value / (max || 1)) * 100, 0), 100)

  const heightStyles = {
    sm: '6px',
    md: '10px',
    lg: '16px',
  }

  const variantGradients = {
    gold: 'linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
    red: 'linear-gradient(90deg, #b91c1c 0%, #ef4444 50%, #f87171 100%)',
    cyan: 'linear-gradient(90deg, #0284c7 0%, #06b6d4 50%, #38bdf8 100%)',
    purple: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
    green: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%)',
  }

  const variantGlows = {
    gold: '0 0 14px rgba(245, 158, 11, 0.6)',
    red: '0 0 14px rgba(239, 68, 68, 0.6)',
    cyan: '0 0 14px rgba(6, 182, 212, 0.6)',
    purple: '0 0 14px rgba(168, 85, 247, 0.6)',
    green: '0 0 14px rgba(16, 185, 129, 0.6)',
  }

  return (
    <div className={`rpg-progress-container ${className}`} style={{ width: '100%', ...style }}>
      {/* Top Labels */}
      {(label || showLabel) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.35rem',
          fontSize: size === 'sm' ? '0.75rem' : '0.85rem',
          fontFamily: 'var(--font-title)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)'
        }}>
          {label && <span>{label}</span>}
          {showLabel && <span style={{ color: 'var(--text-main)' }}>{Math.round(percentage)}%</span>}
        </div>
      )}

      {/* Bar Track */}
      <div style={{
        width: '100%',
        height: heightStyles[size],
        background: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Fill Bar */}
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: variantGradients[variant],
          boxShadow: glow ? variantGlows[variant] : 'none',
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          backgroundImage: striped ?
            'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 16px)'
            : 'none'
        }} />
      </div>
    </div>
  )
}
