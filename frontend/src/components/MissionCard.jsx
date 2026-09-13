import React from 'react'
import {
  Shield,
  Brain,
  Dumbbell,
  HeartPulse,
  Compass,
  FlameKindling,
  Sparkles,
  Coins,
  CheckCircle2,
  ChevronRight,
  Plus,
  Target,
  Trash2
} from 'lucide-react'
import { Badge } from './Badge'
import { ProgressBar } from './ProgressBar'
import { Button } from './Button'

export function MissionCard({
  mission,
  onSelectMission = () => {},
  onAddTask = null,
  onDelete = null,
  isSelected = false
}) {
  const tasks = mission.tasks || []
  const totalTasks = tasks.length
  // ONLY VERIFIED quests count toward mission progress!
  const verifiedTasks = tasks.filter(
    (t) => (t.status || '').toUpperCase() === 'VERIFIED' || (t.status || '').toUpperCase() === 'COMPLETED'
  ).length
  const progressPercent = totalTasks > 0 ? Math.round((verifiedTasks / totalTasks) * 100) : 0

  const totalXP = tasks.reduce((sum, t) => sum + (t.potentialXP || t.xpReward || 0), 0)
  const totalGold = tasks.reduce((sum, t) => sum + (t.potentialGold || t.goldReward || 0), 0)

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
        return Target
    }
  }

  const getCategoryThemeColors = (theme) => {
    switch (theme?.toLowerCase()) {
      case 'cyan':
      case 'intellect':
        return {
          glow: 'rgba(56, 189, 248, 0.25)',
          border: 'rgba(56, 189, 248, 0.45)',
          accent: '#38bdf8',
          badgeVariant: 'cyan'
        }
      case 'red':
      case 'strength':
        return {
          glow: 'rgba(244, 63, 94, 0.25)',
          border: 'rgba(244, 63, 94, 0.45)',
          accent: '#f43f5e',
          badgeVariant: 'red'
        }
      case 'green':
      case 'vitality':
        return {
          glow: 'rgba(52, 211, 153, 0.25)',
          border: 'rgba(52, 211, 153, 0.45)',
          accent: '#34d399',
          badgeVariant: 'green'
        }
      case 'purple':
      case 'wisdom':
        return {
          glow: 'rgba(168, 85, 247, 0.25)',
          border: 'rgba(168, 85, 247, 0.45)',
          accent: '#c084fc',
          badgeVariant: 'purple'
        }
      case 'gold':
      case 'discipline':
      default:
        return {
          glow: 'rgba(245, 158, 11, 0.25)',
          border: 'rgba(245, 158, 11, 0.45)',
          accent: '#fbbf24',
          badgeVariant: 'gold'
        }
    }
  }

  const themeColors = getCategoryThemeColors(mission.categoryTheme || mission.category)
  const CategoryIcon = getCategoryIcon(mission.category)

  return (
    <div
      style={{
        background: isSelected
          ? 'linear-gradient(180deg, rgba(20, 29, 48, 0.95) 0%, rgba(13, 19, 33, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(17, 24, 39, 0.85) 0%, rgba(10, 14, 24, 0.95) 100%)',
        border: isSelected
          ? `1.5px solid ${themeColors.accent}`
          : '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        position: 'relative',
        boxShadow: isSelected
          ? `0 0 25px ${themeColors.glow}, 0 10px 30px rgba(0, 0, 0, 0.7)`
          : '0 8px 30px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}
      className="mission-card-hover"
    >
      {/* Top Accent Strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${themeColors.accent}, transparent)`
        }}
      />

      {/* Header Badges & Category */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant={themeColors.badgeVariant} size="sm">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CategoryIcon size={13} />
              {mission.category}
            </span>
          </Badge>
          <Badge variant="gold" size="sm">
            {mission.difficulty}
          </Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.04em'
            }}
          >
            {totalTasks} {totalTasks === 1 ? 'QUEST' : 'QUESTS'}
          </span>

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(mission.id)
              }}
              title="Delete Mission"
              id={`delete-mission-btn-${mission.id}`}
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                borderRadius: '6px',
                color: '#fb7185',
                padding: '0.3rem 0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(244, 63, 94, 0.25)'
                e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(244, 63, 94, 0.12)'
                e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.35)'
              }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Mission Title and Description */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1.35rem',
            fontWeight: 900,
            letterSpacing: '0.03em',
            color: '#ffffff',
            lineHeight: 1.25,
            marginBottom: '0.6rem'
          }}
        >
          {mission.title}
        </h3>
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {mission.description}
        </p>
      </div>

      {/* Rewards and Progress Overview */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.55rem'
          }}
        >
          <span
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}
          >
            MISSION PROGRESS
          </span>
          <span
            style={{
              fontSize: '0.82rem',
              color: progressPercent === 100 ? '#34d399' : themeColors.accent,
              fontWeight: 800
            }}
          >
            {verifiedTasks} / {totalTasks} VERIFIED QUESTS ({progressPercent}%)
          </span>
        </div>

        <ProgressBar
          progress={progressPercent}
          color={progressPercent === 100 ? 'green' : themeColors.badgeVariant}
          height="7px"
          animated={progressPercent > 0 && progressPercent < 100}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Possible Rewards:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span
              style={{
                fontSize: '0.85rem',
                color: '#38bdf8',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Sparkles size={13} /> {totalXP} XP
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-gold)',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Coins size={13} /> {totalGold} Gold
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap'
        }}
      >
        <Button
          variant={isSelected ? 'gold' : 'outline'}
          size="sm"
          onClick={() => onSelectMission(mission)}
          style={{ flex: 1, justifyContent: 'center' }}
          icon={ChevronRight}
          id={`view-quest-btn-${mission.id}`}
        >
          {isSelected ? 'VIEWING QUEST' : 'VIEW QUEST'}
        </Button>

        {onAddTask && (
          <button
            type="button"
            onClick={() => onAddTask(mission)}
            title="Add Real-Life Quest"
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              fontFamily: 'var(--font-title)',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={14} /> Quest
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(mission.id)}
            title="Delete Mission"
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#fb7185',
              fontFamily: 'var(--font-title)',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>

      <style>{`
        .mission-card-hover:hover {
          transform: translateY(-3px);
          border-color: ${themeColors.accent};
        }
      `}</style>
    </div>
  )
}

export default MissionCard
