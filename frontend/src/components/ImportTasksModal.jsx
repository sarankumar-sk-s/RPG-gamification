import React, { useState, useMemo } from 'react'
import {
  X,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  HelpCircle,
  Copy
} from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'

export function ImportTasksModal({ isOpen, onClose, onImportTasks, missionTitle = 'Mission' }) {
  const [rawText, setRawText] = useState('')
  const [formatMode, setFormatMode] = useState('lines') // 'lines' or 'json'
  const [error, setError] = useState('')

  const exampleLines = `[INTELLECT] Build FastAPI Async Endpoints (Hard) - Setup database session and endpoints
[STRENGTH] 50 Heavy Pushups & 30 Pullups (Medium) - Split into 4 strict sets
[VITALITY] 3 Liters Mineralized Water (Easy) - Hydration baseline
[WISDOM] 45 Minutes Distraction-Free Meditation (Medium) - Deep mental stillness
[DISCIPLINE] Complete Daily Priority Code Review (Hard) - Review team PRs`

  const exampleJson = `[
  {
    "title": "Master Docker Containerization",
    "description": "Create optimized multi-stage Dockerfile and docker-compose orchestration",
    "category": "INTELLECT",
    "difficulty": "Hard",
    "repeatType": "One-Time"
  },
  {
    "title": "Zone 2 Low-Impact Cardio",
    "description": "40 minutes continuous aerobic base training",
    "category": "VITALITY",
    "difficulty": "Medium",
    "repeatType": "Daily"
  }
]`

  // Parse lines or json into tasks
  const parsedTasks = useMemo(() => {
    if (!rawText.trim()) return []

    if (formatMode === 'json') {
      try {
        const parsed = JSON.parse(rawText)
        if (Array.isArray(parsed)) {
          return parsed.map((item, idx) => {
            const diff = item.difficulty || 'Medium'
            const xp = diff === 'Easy' ? 30 : diff === 'Hard' ? 90 : diff === 'Epic' ? 140 : 55
            const gold = diff === 'Easy' ? 15 : diff === 'Hard' ? 45 : diff === 'Epic' ? 70 : 25
            return {
              id: `imported-${Date.now()}-${idx}`,
              title: item.title || `Task #${idx + 1}`,
              description: item.description || 'Imported tactical directive.',
              category: (item.category || 'INTELLECT').toUpperCase(),
              difficulty: diff,
              xpReward: item.xpReward || xp,
              goldReward: item.goldReward || gold,
              repeatType: item.repeatType || 'Daily',
              status: 'Pending'
            }
          })
        }
      } catch (err) {
        return []
      }
    } else {
      // Line-based parsing
      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean)
      return lines.map((line, idx) => {
        let category = 'INTELLECT'
        let difficulty = 'Medium'
        let description = 'Direct operational objective.'
        let title = line

        // Extract [CATEGORY] if exists
        const catMatch = title.match(/^\[([A-Za-z]+)\]\s*(.*)/)
        if (catMatch) {
          const matchedCat = catMatch[1].toUpperCase()
          if (['INTELLECT', 'STRENGTH', 'VITALITY', 'WISDOM', 'DISCIPLINE'].includes(matchedCat)) {
            category = matchedCat
          }
          title = catMatch[2]
        }

        // Extract - description if exists
        if (title.includes(' - ')) {
          const parts = title.split(' - ')
          title = parts[0].trim()
          description = parts.slice(1).join(' - ').trim()
        }

        // Extract (Difficulty) if exists
        const diffMatch = title.match(/(.*)\s*\((Easy|Medium|Hard|Epic|Beginner|Master|Legendary)\)$/i)
        if (diffMatch) {
          title = diffMatch[1].trim()
          const matchedDiff = diffMatch[2]
          if (['Easy', 'Medium', 'Hard', 'Epic'].includes(matchedDiff)) {
            difficulty = matchedDiff
          } else if (matchedDiff.toLowerCase() === 'beginner') {
            difficulty = 'Easy'
          } else if (matchedDiff.toLowerCase() === 'master' || matchedDiff.toLowerCase() === 'legendary') {
            difficulty = 'Epic'
          }
        }

        const xp = difficulty === 'Easy' ? 30 : difficulty === 'Hard' ? 90 : difficulty === 'Epic' ? 140 : 55
        const gold = difficulty === 'Easy' ? 15 : difficulty === 'Hard' ? 45 : difficulty === 'Epic' ? 70 : 25

        return {
          id: `imported-${Date.now()}-${idx}`,
          title: title || `Task #${idx + 1}`,
          description,
          category,
          difficulty,
          xpReward: xp,
          goldReward: gold,
          repeatType: 'Daily',
          status: 'Pending'
        }
      })
    }
    return []
  }, [rawText, formatMode])

  if (!isOpen) return null

  const handleImport = () => {
    if (parsedTasks.length === 0) {
      setError('Please paste valid tasks to import.')
      return
    }
    onImportTasks(parsedTasks)
    setRawText('')
    setError('')
    onClose()
  }

  const loadTemplate = () => {
    if (formatMode === 'json') {
      setRawText(exampleJson)
    } else {
      setRawText(exampleLines)
    }
    setError('')
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
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #111827 0%, #0b0f19 100%)',
          border: '1px solid rgba(168, 85, 247, 0.45)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(168, 85, 247, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Purple Glowing Top Stripe */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)',
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
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc'
            }}>
              <Upload size={20} />
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
                IMPORT TASKS IN BULK
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

        {/* Scrollable Content */}
        <div style={{ padding: '1.25rem 1.75rem', overflowY: 'auto', flex: 1 }}>
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

          {/* Format Selector & Helper */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setFormatMode('lines')}
                style={{
                  background: formatMode === 'lines' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: formatMode === 'lines' ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  color: formatMode === 'lines' ? '#c084fc' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Line-by-Line List
              </button>
              <button
                type="button"
                onClick={() => setFormatMode('json')}
                style={{
                  background: formatMode === 'json' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: formatMode === 'json' ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  color: formatMode === 'json' ? '#c084fc' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                JSON Array
              </button>
            </div>

            <button
              type="button"
              onClick={loadTemplate}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--gold-light)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <Copy size={13} /> Load Sample Template
            </button>
          </div>

          {/* Text Area */}
          <textarea
            placeholder={
              formatMode === 'lines'
                ? `Paste tasks, one per line:\n[INTELLECT] Read Chapter 12 (Hard) - Deep systems\n[STRENGTH] 50 Pushups (Medium)\n[VITALITY] Morning Hydration (Easy)`
                : `Paste JSON array of tasks...`
            }
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value)
              if (error) setError('')
            }}
            rows={6}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontFamily: 'monospace',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '1rem'
            }}
            onFocus={(e) => e.target.style.borderColor = '#c084fc'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
          />

          {/* Parsed Tasks Preview */}
          {parsedTasks.length > 0 && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.65rem'
              }}>
                <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-title)', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  PREVIEW ({parsedTasks.length} TASKS READY TO IMPORT)
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: 600 }}>
                  Total Bounty: +{parsedTasks.reduce((acc, t) => acc + t.xpReward, 0)} XP
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                maxHeight: '160px',
                overflowY: 'auto',
                paddingRight: '0.35rem'
              }}>
                {parsedTasks.map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '0.45rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                      <CheckCircle2 size={15} color="#34d399" />
                      <span style={{
                        fontSize: '0.85rem',
                        color: '#ffffff',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '280px'
                      }}>
                        {t.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Badge variant={t.category === 'INTELLECT' ? 'cyan' : t.category === 'STRENGTH' ? 'red' : t.category === 'VITALITY' ? 'green' : t.category === 'WISDOM' ? 'purple' : 'gold'} size="sm">
                        {t.category}
                      </Badge>
                      <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
                        +{t.xpReward} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.75rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(10, 14, 24, 0.95)'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {parsedTasks.length} tasks detected
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="purple"
              size="md"
              icon={Upload}
              onClick={handleImport}
              disabled={parsedTasks.length === 0}
              id="confirm-import-tasks-btn"
            >
              IMPORT {parsedTasks.length > 0 ? `(${parsedTasks.length}) TASKS` : 'TASKS'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportTasksModal
