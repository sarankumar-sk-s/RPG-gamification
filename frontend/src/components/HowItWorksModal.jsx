import React, { useState } from 'react'
import {
  X,
  Target,
  Sparkles,
  Zap,
  Trophy,
  Flame,
  Shield,
  Coins,
  ChevronRight,
  CheckCircle2,
  Layers,
  Award
} from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'

export function HowItWorksModal({ isOpen, onClose, onEnterWorld }) {
  const [activeStep, setActiveStep] = useState(0)

  if (!isOpen) return null

  const steps = [
    {
      id: 'quests',
      number: '01',
      title: 'REAL-WORLD QUEST LOG',
      tag: 'OBJECTIVE CONVERSION',
      icon: Target,
      accent: 'gold',
      summary: 'Every real-world habit, project, or task becomes an actionable RPG Quest.',
      details: [
        'Daily Missions: Build consistent habits (morning workouts, meditation, reading).',
        'Epic Operations: Multi-stage real-world milestones (building software, passing exams).',
        'Dynamic Difficulty: Harder real-world challenges yield higher XP, Gold, and rare rewards.'
      ],
      badge: 'Step 1: Commit'
    },
    {
      id: 'attributes',
      number: '02',
      title: 'ATTRIBUTE PROGRESSION',
      tag: 'CHARACTER STATS',
      icon: Zap,
      accent: 'red',
      summary: 'Your character stats reflect your true human capabilities.',
      details: [
        'Intellect (INT): Earned through deep work, coding, writing, studying.',
        'Strength (STR) & Vitality (VIT): Built through fitness, nutrition, endurance.',
        'Discipline (DIS) & Wisdom (WIS): Honed by consistency, reflection, and habit streaks.'
      ],
      badge: 'Step 2: Train'
    },
    {
      id: 'economy',
      number: '03',
      title: 'STREAKS & GOLD ECONOMY',
      tag: 'COMPOUND MOMENTUM',
      icon: Coins,
      accent: 'gold',
      summary: 'Maintain daily discipline to unlock exponential multipliers and game loot.',
      details: [
        'Streak Combustion: Consecutive active days multiply all XP and Gold rewards.',
        'Guild Marketplace: Spend earned Gold to unlock real-life rewards or in-game titles.',
        'Loss Penalty Protection: Earn shield runes to protect against occasional off-days.'
      ],
      badge: 'Step 3: Compound'
    },
    {
      id: 'bosses',
      number: '04',
      title: 'CONQUER PROCRASTINATION',
      tag: 'LEVEL UP & EVOLVE',
      icon: Trophy,
      accent: 'purple',
      summary: 'Face formidable psychological bosses representing hesitation and self-doubt.',
      details: [
        'Overcome Resistance: Slay boss HP bars by executing high-leverage focus sessions.',
        'Level Up Tiers: Progress from Novice Recruit to Grandmaster Architect.',
        'Visual Progression: Watch your avatar and guild standing ascend over time.'
      ],
      badge: 'Step 4: Ascend'
    }
  ]

  const current = steps[activeStep]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        backgroundColor: 'rgba(3, 5, 9, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="tactical-border"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(10, 14, 24, 0.95)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.25)',
          overflow: 'hidden',
          border: '1px solid var(--border-gold)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-light)'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  color: 'var(--gold-light)',
                  fontWeight: 700
                }}
              >
                // PROTOCOL BRIEFING
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-title)',
                  margin: 0,
                  letterSpacing: '0.05em'
                }}
              >
                HOW LIFE RPG OPERATES
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = 'var(--gold-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Step Pills */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            padding: '1rem 1.75rem 0.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(6, 9, 15, 0.6)'
          }}
        >
          {steps.map((step, idx) => {
            const isActive = activeStep === idx
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1px solid var(--gold-primary)' : '1px solid transparent',
                  background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    opacity: isActive ? 1 : 0.6,
                    color: isActive ? 'var(--gold-primary)' : 'var(--text-dim)'
                  }}
                >
                  {step.number}
                </span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {step.title.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Content Body */}
        <div
          style={{
            flex: 1,
            padding: '1.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {/* Active Step Highlight Card */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(20, 28, 48, 0.85) 0%, rgba(12, 17, 28, 0.95) 100%)',
              border: '1px solid var(--border-highlight)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant={current.accent === 'red' ? 'red' : current.accent === 'purple' ? 'purple' : 'gold'}>
                  {current.badge}
                </Badge>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-title)' }}>
                  {current.tag}
                </span>
              </div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-light)'
                }}
              >
                <current.icon size={22} />
              </div>
            </div>

            <h2
              style={{
                fontSize: '1.6rem',
                fontFamily: 'var(--font-title)',
                letterSpacing: '0.04em',
                marginBottom: '0.5rem'
              }}
            >
              {current.title}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {current.summary}
            </p>

            {/* Tactical Bullet Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {current.details.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <CheckCircle2 size={18} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(6, 9, 15, 0.95)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: activeStep === 0 ? 'var(--text-dim)' : 'var(--text-main)',
                cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-title)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStep === steps.length - 1}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: activeStep === steps.length - 1 ? 'var(--text-dim)' : 'var(--text-main)',
                cursor: activeStep === steps.length - 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-title)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              Next Step
            </button>
          </div>

          <Button
            variant="gold"
            size="md"
            icon={ChevronRight}
            onClick={() => {
              onClose()
              if (onEnterWorld) onEnterWorld()
            }}
          >
            ENTER WORLD NOW
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksModal
