import React from 'react'
import { Loader2 } from 'lucide-react'

export function Button({
  children,
  variant = 'gold', // gold | cyan | red | green | purple | outline | outline-gold | outline-cyan | glass | ghost | dark | danger
  size = 'md', // sm | md | lg
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  style = {},
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.55rem',
    fontFamily: 'var(--font-title)',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    border: 'none',
    outline: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    userSelect: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || isLoading ? 0.55 : 1,
    borderRadius: '6px',
    lineHeight: 1,
    whiteSpace: 'nowrap'
  }

  const sizeStyles = {
    sm: { padding: '0.45rem 0.95rem', fontSize: '0.82rem' },
    md: { padding: '0.65rem 1.4rem', fontSize: '0.92rem' },
    lg: { padding: '0.85rem 1.85rem', fontSize: '1.05rem' },
  }

  const variantStyles = {
    gold: {
      background: 'linear-gradient(135deg, #fde047 0%, #f59e0b 50%, #d97706 100%)',
      color: '#080c14',
      border: '1px solid #fef08a',
      boxShadow: '0 0 20px rgba(245, 158, 11, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      textShadow: '0 1px 0 rgba(255, 255, 255, 0.4)',
    },
    cyan: {
      background: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 50%, #0284c7 100%)',
      color: '#04101d',
      border: '1px solid #bae6fd',
      boxShadow: '0 0 20px rgba(56, 189, 248, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      textShadow: '0 1px 0 rgba(255, 255, 255, 0.4)',
    },
    red: {
      background: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #be123c 100%)',
      color: '#ffffff',
      border: '1px solid #fda4af',
      boxShadow: '0 0 20px rgba(244, 63, 94, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
    },
    danger: {
      background: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #be123c 100%)',
      color: '#ffffff',
      border: '1px solid #fda4af',
      boxShadow: '0 0 20px rgba(244, 63, 94, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
    },
    green: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
      color: '#ffffff',
      border: '1px solid #6ee7b7',
      boxShadow: '0 0 25px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    },
    'outline-green': {
      background: 'rgba(16, 185, 129, 0.12)',
      color: '#34d399',
      border: '1.5px solid #10b981',
      boxShadow: '0 0 18px rgba(16, 185, 129, 0.3)',
      textShadow: '0 0 10px rgba(52, 211, 153, 0.5)'
    },
    purple: {
      background: 'linear-gradient(135deg, #d8b4fe 0%, #c084fc 50%, #9333ea 100%)',
      color: '#ffffff',
      border: '1px solid #f3e8ff',
      boxShadow: '0 0 20px rgba(192, 132, 252, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
    },
    outline: {
      background: 'rgba(245, 158, 11, 0.08)',
      color: '#fbbf24',
      border: '1.5px solid var(--gold-primary)',
      boxShadow: '0 0 16px rgba(245, 158, 11, 0.2)',
      textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
    },
    'outline-gold': {
      background: 'rgba(245, 158, 11, 0.08)',
      color: '#fbbf24',
      border: '1.5px solid var(--gold-primary)',
      boxShadow: '0 0 16px rgba(245, 158, 11, 0.2)',
      textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
    },
    'outline-cyan': {
      background: 'rgba(56, 189, 248, 0.08)',
      color: '#38bdf8',
      border: '1.5px solid var(--cyan-accent)',
      boxShadow: '0 0 16px rgba(56, 189, 248, 0.2)',
      textShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#ffffff',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.22)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
    },
    dark: {
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: '#f8fafc',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    }
  }

  const selectedVariantStyle = variantStyles[variant] || variantStyles.gold

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...selectedVariantStyle,
        ...style
      }}
      className={`rpg-btn rpg-btn-${variant} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 15 : size === 'lg' ? 20 : 17} />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 15 : size === 'lg' ? 20 : 17} />}
        </>
      )}
    </button>
  )
}

export default Button

