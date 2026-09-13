import React from 'react'
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Coins,
  Repeat,
  Brain,
  Dumbbell,
  HeartPulse,
  Compass,
  FlameKindling,
  Trash2,
  Check
} from 'lucide-react'
import { Badge } from './Badge'
import { Button } from './Button'

export function TaskCard({
  task,
  onToggleStatus = () => {},
  onDelete = null
}) {
  const isCompleted = task.status === 'Completed'
  const isInProgress = task.status === 'In Progress'

  const getCategoryIcon = (cat) => {
    switch (cat?.toUpperCase()) {
      case 'INTELLECT':
        return Brain
      case 'STRENGTH':
        return Dumbbell
      case 'VITALITY':
        return HeartPulse
      case 'WISDOM':
        return Compass
      case 'DISCIPLINE':
        return FlameKindling
      default:
        return Sparkles
    }
  }

  const getCategoryBadgeVariant = (cat) => {
    switch (cat?.toUpperCase()) {
      case 'INTELLECT':
        return 'cyan'
      case 'STRENGTH':
        return 'red'
      case 'VITALITY':
        return 'green'
      case 'WISDOM':
        return 'purple'
      case 'DISCIPLINE':
        return 'gold'
      default:
        return 'neutral'
    }
  }

  const getDifficultyBadgeVariant = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
      case 'beginner':
        return 'green'
      case 'medium':
      case 'intermediate':
        return 'blue'
      case 'hard':
      case 'adept':
        return 'purple'
      case 'epic':
      case 'master':
      case 'legendary':
        return 'red'
      default:
        return 'neutral'
    }
  }

  const CategoryIcon = getCategoryIcon(task.category)

  return (
    <div
      style={{
        background: isCompleted
          ? 'linear-gradient(135deg, rgba(16, 24, 39, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)'
          : 'linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(11, 15, 25, 0.95) 100%)',
        border: isCompleted
          ? '1px solid rgba(52, 211, 153, 0.3)'
          : isInProgress
          ? '1px solid rgba(56, 189, 248, 0.4)'
          : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1.15rem 1.35rem',
        position: 'relative',
        boxShadow: isCompleted
          ? '0 4px 14px rgba(0, 0, 0, 0.3)'
          : '0 8px 24px rgba(0, 0, 0, 0.45)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.9rem',
        opacity: isCompleted ? 0.75 : 1
      }}
      className="hover-lift"
    >
      {/* Top Header: Category & Difficulty Badges & Repeat type */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <Badge variant={getCategoryBadgeVariant(task.category)} size="sm">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CategoryIcon size={12} />
              {task.category}
            </span>
          </Badge>
          <Badge variant={getDifficultyBadgeVariant(task.difficulty)} size="sm">
            {task.difficulty}
          </Badge>
          {task.repeatType && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-title)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <Repeat size={11} /> {task.repeatType}
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-title)',
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            padding: '0.2rem 0.55rem',
            borderRadius: '4px',
            background: isCompleted
              ? 'rgba(52, 211, 153, 0.15)'
              : isInProgress
              ? 'rgba(56, 189, 248, 0.15)'
              : 'rgba(255, 255, 255, 0.05)',
            border: isCompleted
              ? '1px solid rgba(52, 211, 153, 0.4)'
              : isInProgress
              ? '1px solid rgba(56, 189, 248, 0.4)'
              : '1px solid var(--border-subtle)',
            color: isCompleted
              ? '#34d399'
              : isInProgress
              ? '#38bdf8'
              : 'var(--text-muted)'
          }}>
            {task.status}
          </span>

          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Title and Description */}
      <div>
        <h4 style={{
          fontFamily: 'var(--font-title)',
          fontSize: '1.05rem',
          fontWeight: 700,
          color: isCompleted ? 'var(--text-secondary)' : '#ffffff',
          textDecoration: isCompleted ? 'line-through' : 'none',
          marginBottom: '0.35rem',
          letterSpacing: '0.02em',
          lineHeight: 1.3
        }}>
          {task.title}
        </h4>
        {task.description && (
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.45,
            margin: 0
          }}>
            {task.description}
          </p>
        )}
      </div>

      {/* Bottom Bar: Rewards & Complete Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        marginTop: '0.25rem'
      }}>
        {/* Rewards */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#38bdf8'
          }}>
            <Sparkles size={14} /> +{task.xpReward} XP
          </span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--text-gold)'
          }}>
            <Coins size={14} /> +{task.goldReward} G
          </span>
        </div>

        {/* Completion Toggle Button */}
        <button
          onClick={() => onToggleStatus(task.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: isCompleted
              ? '1px solid rgba(52, 211, 153, 0.4)'
              : '1px solid var(--gold-primary)',
            background: isCompleted
              ? 'rgba(52, 211, 153, 0.15)'
              : 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(239, 68, 68, 0.25) 100%)',
            color: isCompleted ? '#34d399' : 'var(--text-gold)',
            fontFamily: 'var(--font-title)',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: isCompleted ? 'none' : '0 0 10px rgba(245, 158, 11, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {isCompleted ? (
            <>
              <Check size={14} /> COMPLETED
            </>
          ) : (
            <>
              <Circle size={14} /> COMPLETE
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default TaskCard
