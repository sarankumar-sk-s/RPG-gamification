import React from 'react'

export function Badge({
  children,
  variant = 'gold', // gold | red | purple | cyan | green | neutral
  size = 'md', // sm | md
  icon: Icon,
  pulse = false,
  className = '',
  style = {},
  ...props
}) {
  const variantStyles = {
    gold: {
      background: 'rgba(245, 158, 11, 0.12)',
      border: '1px solid rgba(245, 158, 11, 0.4)',
      color: '#fbbf24',
      glow: 'rgba(245, 158, 11, 0.4)',
    },
    red: {
      background: 'rgba(239, 68, 68, 0.12)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      color: '#f87171',
      glow: 'rgba(239, 68, 68, 0.4)',
    },
    purple: {
      background: 'rgba(168, 85, 247, 0.12)',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      color: '#c084fc',
      glow: 'rgba(168, 85, 247, 0.4)',
    },
    cyan: {
      background: 'rgba(6, 182, 212, 0.12)',
      border: '1px solid rgba(6, 182, 212, 0.4)',
      color: '#38bdf8',
      glow: 'rgba(6, 182, 212, 0.4)',
    },
    green: {
      background: 'rgba(16, 185, 129, 0.12)',
      border: '1px solid rgba(16, 185, 129, 0.4)',
      color: '#34d399',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
    neutral: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--text-secondary)',
      glow: 'transparent',
    }
  }

  const sizeStyles = {
    sm: { padding: '0.2rem 0.55rem', fontSize: '0.72rem' },
    md: { padding: '0.35rem 0.85rem', fontSize: '0.82rem' },
  }

  const v = variantStyles[variant] || variantStyles.gold

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontFamily: 'var(--font-title)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        borderRadius: 'var(--radius-full)',
        background: v.background,
        border: v.border,
        color: v.color,
        boxShadow: pulse ? `0 0 12px ${v.glow}` : 'none',
        lineHeight: 1,
        ...sizeStyles[size],
        ...style,
      }}
      className={`rpg-badge ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      {pulse && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: v.color,
          boxShadow: `0 0 8px ${v.color}`,
          display: 'inline-block'
        }} />
      )}
      <span>{children}</span>
    </span>
  )
}
