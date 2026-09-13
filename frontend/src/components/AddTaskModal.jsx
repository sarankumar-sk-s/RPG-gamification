import React, { useState } from 'react'
import {
  X,
  Plus,
  Zap,
  Brain,
  Dumbbell,
  HeartPulse,
  Compass,
  FlameKindling,
  Coins,
  Sparkles,
  Repeat,
  AlertCircle
} from 'lucide-react'
import { Button } from './Button'

export function AddTaskModal({ isOpen, onClose, onAddTask, missionTitle = 'Mission' }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('INTELLECT')
  const [difficulty, setDifficulty] = useState('Medium')
  const [repeatType, setRepeatType] = useState('Daily')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const categories = [
    { id: 'INTELLECT', label: 'Intellect', icon: Brain },
    { id: 'STRENGTH', label: 'Strength', icon: Dumbbell },
    { id: 'VITALITY', label: 'Vitality', icon: HeartPulse },
    { id: 'WISDOM', label: 'Wisdom', icon: Compass },
    { id: 'DISCIPLINE', label: 'Discipline', icon: FlameKindling }
  ]

  const difficultyMultipliers = {
    Easy: { xp: 30, gold: 15 },
    Medium: { xp: 55, gold: 25 },
    Hard: { xp: 90, gold: 45 },
    Epic: { xp: 140, gold: 70 }
  }

  const repeatOptions = ['Daily', 'Weekly', 'One-Time', 'Custom']

  const calculatedRewards = difficultyMultipliers[difficulty] || { xp: 50, gold: 20 }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Task Title is required.')
      return
    }

    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      description: description.trim() || 'Execute standard operating routine with precision.',
      category,
      difficulty,
      xpReward: calculatedRewards.xp,
      goldReward: calculatedRewards.gold,
      repeatType,
      status: 'Pending'
    }

    onAddTask(newTask)
    setTitle('')
    setDescription('')
    setError('')
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          background: 'linear-gradient(180deg, #111827 0%, #0b0f19 100%)',
          border: '1px solid rgba(56, 189, 248, 0.45)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(56, 189, 248, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing Top Cyan Stripe */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)',
          width: '100%'
        }} />

        {/* Modal Header */}
        <div style={{
          padding: '1.4rem 1.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Zap size={20} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.3rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#ffffff',
                margin: 0
              }}>
                ADD TASK
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Targeting: <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{missionTitle}</span>
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
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.4rem 1.75rem' }}>
          {error && (
            <div style={{
              marginBottom: '1rem',
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

          {/* Task Title */}
          <div style={{ marginBottom: '1.15rem' }}>
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
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Complete 45m Focused Code Sprint"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.7rem 1rem',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'var(--font-body)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--cyan-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.15rem' }}>
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
              Description (Optional)
            </label>
            <textarea
              placeholder="Describe the objective, constraints, or step-by-step checklist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 1rem',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                resize: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--cyan-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
            />
          </div>

          {/* Grid for Category, Difficulty, and Repeat */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* Category */}
            <div>
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
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.8rem',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} style={{ background: '#0f172a' }}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
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
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.8rem',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {Object.keys(difficultyMultipliers).map((d) => (
                  <option key={d} value={d} style={{ background: '#0f172a' }}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Repeat Type */}
            <div>
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
                Repeat Type
              </label>
              <select
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.8rem',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {repeatOptions.map((r) => (
                  <option key={r} value={r} style={{ background: '#0f172a' }}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reward Calculation Preview Card */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.4rem'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Estimated Bounty:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={15} /> +{calculatedRewards.xp} XP
              </span>
              <span style={{ color: 'var(--text-gold)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Coins size={15} /> +{calculatedRewards.gold} Gold
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '0.8rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="cyan"
              size="md"
              icon={Plus}
              id="submit-add-task-btn"
            >
              ADD TASK
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTaskModal
