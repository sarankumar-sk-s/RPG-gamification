import React from 'react'
import { Brain, Dumbbell, Heart, Eye, Target } from 'lucide-react'

const STAT_CONFIG = {
  intellect: {
    label: 'Intellect',
    icon: Brain,
    color: '#38bdf8',
    bg: 'rgba(6, 182, 212, 0.12)',
    border: 'rgba(6, 182, 212, 0.35)',
    glow: 'rgba(6, 182, 212, 0.3)',
    description: 'Knowledge, logic, and learning capacity',
  },
  strength: {
    label: 'Strength',
    icon: Dumbbell,
    color: '#f87171',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.35)',
    glow: 'rgba(239, 68, 68, 0.3)',
    description: 'Physical prowess, workout, and power',
  },
  vitality: {
    label: 'Vitality',
    icon: Heart,
    color: '#34d399',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    glow: 'rgba(16, 185, 129, 0.3)',
    description: 'Health, endurance, and energy recovery',
  },
  wisdom: {
    label: 'Wisdom',
    icon: Eye,
    color: '#c084fc',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.35)',
    glow: 'rgba(168, 85, 247, 0.3)',
    description: 'Insight, mindfulness, and mental clarity',
  },
  discipline: {
    label: 'Discipline',
    icon: Target,
    color: '#fbbf24',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    glow: 'rgba(245, 158, 11, 0.3)',
    description: 'Focus, consistency, and habit adherence',
  }
}

export function StatCard({
  category = 'intellect', // intellect | strength | vitality | wisdom | discipline
  value = 10,
  recentGain = null,
  className = '',
  style = {},
  ...props
}) {
  const catKey = (category || 'intellect').toLowerCase()
  const config = STAT_CONFIG[catKey] || STAT_CONFIG.intellect
  const Icon = config.icon

  return (
    <div
      className={`glass-panel ${className}`}
      style={{
        padding: '1.25rem',
        border: `1px solid ${config.border}`,
        boxShadow: `0 4px 20px ${config.glow}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      {...props}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          background: config.bg,
          border: `1px solid ${config.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: config.color
        }}>
          <Icon size={20} />
        </div>

        {/* Score Value & Recent Gain */}
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
          <span style={{
            fontSize: '1.6rem',
            fontFamily: 'var(--font-title)',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1
          }}>
            {value}
          </span>
          {recentGain && (
            <span style={{
              fontSize: '0.8rem',
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              color: '#34d399'
            }}>
              +{recentGain}
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h4 style={{
          fontSize: '1.05rem',
          fontFamily: 'var(--font-title)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: config.color,
          margin: 0
        }}>
          {config.label}
        </h4>
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginTop: '0.2rem',
          lineHeight: 1.3
        }}>
          {config.description}
        </p>
      </div>

      {/* Mini Progress Bar */}
      <div style={{
        width: '100%',
        height: '4px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${Math.min((value / 50) * 100, 100)}%`,
          height: '100%',
          background: config.color,
          boxShadow: `0 0 8px ${config.color}`
        }} />
      </div>
    </div>
  )
}
