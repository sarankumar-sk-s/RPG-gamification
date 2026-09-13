import React from 'react'

export function Card({
  title,
  subtitle,
  badge,
  action,
  children,
  footer,
  variant = 'default', // default | gold | red | glass
  glow = false,
  tactical = true,
  className = '',
  style = {},
  ...props
}) {
  const variantBorders = {
    default: '1px solid var(--border-subtle)',
    gold: '1px solid var(--border-gold)',
    red: '1px solid var(--border-red)',
    glass: '1px solid var(--border-highlight)',
  }

  const variantGlows = {
    default: glow ? 'var(--shadow-md)' : 'none',
    gold: '0 0 25px rgba(245, 158, 11, 0.2)',
    red: '0 0 25px rgba(239, 68, 68, 0.2)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.5)',
  }

  return (
    <div
      className={`glass-panel ${glow ? 'pulse-glow' : ''} ${className}`}
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: variantBorders[variant],
        boxShadow: variantGlows[variant],
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {/* Tactical Corner Accent Notch */}
      {tactical && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '24px',
          height: '24px',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            width: '24px',
            height: '24px',
            background: variant === 'red' ? 'var(--red-accent)' : 'var(--gold-primary)',
            transform: 'rotate(45deg)',
            opacity: 0.8
          }} />
        </div>
      )}

      {/* Card Header */}
      {(title || subtitle || badge || action) && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.85rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {title && (
                <h3 style={{
                  fontSize: '1.2rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-main)'
                }}>
                  {title}
                </h3>
              )}
              {badge && badge}
            </div>
            {subtitle && (
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                marginTop: '0.2rem'
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Card Content Body */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.85rem',
          marginTop: 'auto'
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}
