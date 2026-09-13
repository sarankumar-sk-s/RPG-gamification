import React, { useState } from 'react'
import {
  X,
  Swords,
  Sparkles,
  Target,
  Brain,
  Dumbbell,
  HeartPulse,
  Compass,
  FlameKindling,
  Coins,
  AlertCircle,
  Info
} from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'

export function CreateQuestModal({
  isOpen,
  onClose,
  onAddQuest,
  missionTitle = 'Mission'
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [target, setTarget] = useState('')
  const [category, setCategory] = useState('INTELLECT')
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [error, setError] = useState('')

  const categories = [
    { id: 'INTELLECT', label: 'INTELLECT', icon: Brain, color: 'cyan' },
    { id: 'STRENGTH', label: 'STRENGTH', icon: Dumbbell, color: 'red' },
    { id: 'VITALITY', label: 'VITALITY', icon: HeartPulse, color: 'green' },
    { id: 'WISDOM', label: 'WISDOM', icon: Compass, color: 'purple' },
    { id: 'DISCIPLINE', label: 'DISCIPLINE', icon: FlameKindling, color: 'gold' }
  ]

  const difficultyRewardMap = {
    EASY: { xp: 30, gold: 15 },
    MEDIUM: { xp: 50, gold: 20 },
    HARD: { xp: 80, gold: 35 },
    EPIC: { xp: 120, gold: 50 },
    LEGENDARY: { xp: 180, gold: 80 }
  }

  const difficulties = ['EASY', 'MEDIUM', 'HARD', 'EPIC', 'LEGENDARY']

  if (!isOpen) return null

  const potentialXP = difficultyRewardMap[difficulty]?.xp || 50
  const potentialGold = difficultyRewardMap[difficulty]?.gold || 20

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('QUEST TITLE is required.')
      return
    }
    if (!target.trim()) {
      setError("TODAY'S TARGET is required.")
      return
    }

    const newQuest = {
      id: `quest-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      description: description.trim() || 'Execute daily operational habit.',
      target: target.trim(),
      category,
      difficulty,
      potentialXP,
      potentialGold,
      xpReward: potentialXP,
      goldReward: potentialGold,
      status: 'AVAILABLE',
      completedAt: null,
      explanation: '',
      evidenceImage: null
    }

    if (onAddQuest) {
      onAddQuest(newQuest)
    }

    // Reset
    setTitle('')
    setDescription('')
    setTarget('')
    setCategory('INTELLECT')
    setDifficulty('MEDIUM')
    setError('')
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        background: 'rgba(3, 7, 18, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #111827 0%, #080d1a 100%)',
          border: '1px solid rgba(56, 189, 248, 0.45)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(56, 189, 248, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glowing Cyan/Gold Stripe */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #38bdf8, #818cf8, #f59e0b)',
            width: '100%'
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '1.35rem 1.75rem 1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}
            >
              <Swords size={20} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  margin: 0
                }}
              >
                ADD TODAY'S QUEST
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Mission: <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{missionTitle}</span>
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
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '1.4rem 1.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem'
          }}
        >
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#fb7185',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Core Philosophy Reminder */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              padding: '0.65rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45
            }}
          >
            <Info size={15} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Real-Life Action Requirement:</strong> This quest represents something you must actually DO. It is not completed simply because it exists.
            </span>
          </div>

          {/* QUEST TITLE */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem'
              }}
            >
              QUEST TITLE *
            </label>
            <input
              type="text"
              placeholder="e.g. Learn Python Classes"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              id="create-quest-title-input"
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.7rem 1rem',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'var(--font-body)'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--cyan-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
            />
          </div>

          {/* TODAY'S TARGET */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-gold)',
                marginBottom: '0.4rem'
              }}
            >
              TODAY'S TARGET *
            </label>
            <input
              type="text"
              placeholder="e.g. Complete 3 Python class exercises."
              value={target}
              onChange={(e) => {
                setTarget(e.target.value)
                if (error) setError('')
              }}
              id="create-quest-target-input"
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '0.7rem 1rem',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'var(--font-body)'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--gold-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(245, 158, 11, 0.4)')}
            />
          </div>

          {/* QUEST DESCRIPTION */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem'
              }}
            >
              QUEST DESCRIPTION
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Study Python classes and objects and practice with examples."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="create-quest-desc-input"
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 1rem',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                resize: 'none'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--cyan-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
            />
          </div>

          {/* CATEGORY (INTELLECT, STRENGTH, VITALITY, WISDOM, DISCIPLINE) */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem'
              }}
            >
              CATEGORY
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))',
                gap: '0.45rem'
              }}
            >
              {categories.map((cat) => {
                const Icon = cat.icon
                const isSelected = category === cat.id
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.55rem 0.3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={16} color={isSelected ? '#38bdf8' : 'var(--text-muted)'} />
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-title)',
                        fontWeight: 800,
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)'
                      }}
                    >
                      {cat.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* DIFFICULTY (EASY, MEDIUM, HARD, EPIC, LEGENDARY) */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem'
              }}
            >
              DIFFICULTY
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))',
                gap: '0.45rem'
              }}
            >
              {difficulties.map((diff) => {
                const isSelected = difficulty === diff
                return (
                  <button
                    type="button"
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    style={{
                      background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.55rem 0.3rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-title)',
                        fontWeight: 800,
                        color: isSelected ? 'var(--gold-light)' : 'var(--text-secondary)'
                      }}
                    >
                      {diff}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Potential Reward Preview */}
          <div
            style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
              Potential Reward:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={14} /> +{potentialXP} XP
              </span>
              <span style={{ color: 'var(--text-gold)', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Coins size={14} /> +{potentialGold} GOLD
              </span>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="cyan"
              size="md"
              icon={Swords}
              id="create-quest-submit-btn"
              style={{ minWidth: '160px' }}
            >
              CREATE QUEST
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateQuestModal
