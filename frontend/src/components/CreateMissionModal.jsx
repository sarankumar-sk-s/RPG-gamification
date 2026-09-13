import React, { useState } from 'react'
import {
  X,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'

export function CreateMissionModal({
  isOpen,
  onClose,
  onCreateMission
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('HARD')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdMissionObj, setCreatedMissionObj] = useState(null)

  const difficultyOptions = [
    { label: 'EASY', color: 'green', desc: 'Entry-level objective' },
    { label: 'MEDIUM', color: 'blue', desc: 'Balanced operational challenge' },
    { label: 'HARD', color: 'purple', desc: 'Demands intense focus' },
    { label: 'EPIC', color: 'gold', desc: 'High-stake master project' },
    { label: 'LEGENDARY', color: 'red', desc: 'Transformational milestone' }
  ]

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('MISSION TITLE is required.')
      return
    }
    if (!description.trim()) {
      setError('MISSION DESCRIPTION is required.')
      return
    }

    const newMission = {
      id: `custom-mission-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      difficulty,
      category: 'INTELLECT',
      categoryTheme: 'gold',
      tasks: [],
      history: []
    }

    setCreatedMissionObj(newMission)
    setIsSuccess(true)

    if (onCreateMission) {
      onCreateMission(newMission)
    }
  }

  const handleResetAndClose = () => {
    setTitle('')
    setDescription('')
    setDifficulty('HARD')
    setError('')
    setIsSuccess(false)
    setCreatedMissionObj(null)
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
      onClick={handleResetAndClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          background: 'linear-gradient(180deg, #111827 0%, #0a0e1a 100%)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Stripe */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #ef4444)',
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
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24'
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  margin: 0
                }}
              >
                CREATE MISSION
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Turn your real-life actions and goals into quests
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
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

        {/* STAGE 1: FORM */}
        {!isSuccess ? (
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem' }}>
            {error && (
              <div
                style={{
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
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* MISSION TITLE */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.45rem'
                }}
              >
                MISSION TITLE *
              </label>
              <input
                type="text"
                placeholder="e.g. Become a Python Developer"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (error) setError('')
                }}
                id="create-mission-title-input"
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'var(--font-body)'
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--gold-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
              />
            </div>

            {/* MISSION DESCRIPTION */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.45rem'
                }}
              >
                MISSION DESCRIPTION *
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Build the skills required to become a software developer."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (error) setError('')
                }}
                id="create-mission-desc-input"
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  resize: 'none'
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--gold-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
              />
            </div>

            {/* DIFFICULTY Options: EASY, MEDIUM, HARD, EPIC, LEGENDARY */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem'
                }}
              >
                DIFFICULTY
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                  gap: '0.5rem'
                }}
              >
                {difficultyOptions.map((opt) => {
                  const isSelected = difficulty === opt.label
                  return (
                    <button
                      type="button"
                      key={opt.label}
                      onClick={() => setDifficulty(opt.label)}
                      id={`diff-opt-${opt.label.toLowerCase()}`}
                      style={{
                        background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.65rem 0.4rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-title)',
                          fontWeight: 800,
                          color: isSelected ? 'var(--gold-light)' : 'var(--text-secondary)'
                        }}
                      >
                        {opt.label}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <Button type="button" variant="outline" size="md" onClick={handleResetAndClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gold"
                size="md"
                icon={Sparkles}
                id="create-mission-submit-btn"
                style={{ minWidth: '160px' }}
              >
                CREATE MISSION
              </Button>
            </div>
          </form>
        ) : (
          /* STAGE 2: MISSION CREATED NOTIFICATION */
          <div
            style={{
              padding: '2.5rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(52, 211, 153, 0.15)',
                border: '2px solid #34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399',
                marginBottom: '1rem',
                boxShadow: '0 0 30px rgba(52, 211, 153, 0.4)'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.5rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#ffffff',
                margin: '0 0 0.5rem'
              }}
            >
              MISSION CREATED
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', lineHeight: 1.45, margin: '0 0 1.5rem' }}>
              Your mission <strong>"{createdMissionObj?.title}"</strong> has been created. You can now add real-life tasks to start leveling up.
            </p>

            <Button
              variant="gold"
              size="md"
              icon={Plus}
              onClick={handleResetAndClose}
              id="mission-created-continue-btn"
              style={{ minWidth: '180px' }}
            >
              ADD REAL-LIFE TASKS
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateMissionModal
