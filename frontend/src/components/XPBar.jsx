import React from 'react'
import { Sparkles, Shield } from 'lucide-react'
import { ProgressBar } from './ProgressBar'

export function XPBar({
  currentXP = 0,
  xpRequired = 100,
  level = 1,
  compact = false,
  className = '',
  style = {}
}) {
  const percentage = Math.min(Math.max((currentXP / (xpRequired || 1)) * 100, 0), 100)

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', ...style }} className={className}>
        <div style={{
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, #d97706, #f59e0b)',
          color: '#08090d',
          fontFamily: 'var(--font-title)',
          fontWeight: 800,
          fontSize: '0.8rem',
          lineHeight: 1,
          boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)'
        }}>
          LVL {level}
        </div>
        <div style={{ flex: 1 }}>
          <ProgressBar
            value={currentXP}
            max={xpRequired}
            variant="gold"
            size="sm"
            glow={true}
          />
        </div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-title)', color: 'var(--text-muted)' }}>
          {currentXP}/{xpRequired} XP
        </span>
      </div>
    )
  }

  return (
    <div
      className={`glass-panel ${className}`}
      style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        ...style
      }}
    >
      {/* Top Header info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Level Emblem */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.3) 100%)',
            border: '1px solid var(--gold-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.35)'
          }}>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-title)', color: 'var(--text-muted)', lineHeight: 1 }}>LVL</span>
            <span style={{ fontSize: '1.15rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>{level}</span>
          </div>

          <div>
            <div style={{
              fontSize: '1rem',
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span>Player Progression</span>
              <Sparkles size={14} color="#f59e0b" />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Complete tasks to earn XP and level up
            </p>
          </div>
        </div>

        {/* XP Fraction & Percentage */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '1.1rem',
            fontFamily: 'var(--font-title)',
            fontWeight: 800,
            color: '#fbbf24'
          }}>
            {currentXP} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/ {xpRequired} XP</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-title)', color: 'var(--text-secondary)' }}>
            {Math.round(percentage)}% TO LEVEL {level + 1}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        value={currentXP}
        max={xpRequired}
        variant="gold"
        size="md"
        glow={true}
      />
    </div>
  )
}
