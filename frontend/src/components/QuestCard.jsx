import React from 'react'
import {
  Swords,
  Sparkles,
  Coins,
  Clock,
  CheckCircle2,
  XCircle,
  Brain,
  Dumbbell,
  HeartPulse,
  Compass,
  FlameKindling,
  Target,
  Trash2,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'
import { VerificationStatus } from './VerificationStatus'

export function QuestCard({
  quest,
  onCompleteClick,
  onMockVerify,
  onMockReject,
  onResetStatus,
  onDelete
}) {
  if (!quest) return null

  const categoryIcons = {
    INTELLECT: Brain,
    STRENGTH: Dumbbell,
    VITALITY: HeartPulse,
    WISDOM: Compass,
    DISCIPLINE: FlameKindling
  }

  const categoryThemes = {
    INTELLECT: 'cyan',
    STRENGTH: 'red',
    VITALITY: 'green',
    WISDOM: 'purple',
    DISCIPLINE: 'gold'
  }

  const Icon = categoryIcons[quest.category] || Swords
  const theme = categoryThemes[quest.category] || 'gold'
  const status = (quest.status || 'AVAILABLE').toUpperCase()

  const xpAmount = quest.potentialXP || quest.xpReward || 50
  const goldAmount = quest.potentialGold || quest.goldReward || 20

  const isVerified = status === 'VERIFIED' || status === 'COMPLETED'
  const isPending = status === 'PENDING VERIFICATION' || status === 'PENDING'
  const isRejected = status === 'REJECTED'
  const isAvailable = status === 'AVAILABLE'

  return (
    <div
      style={{
        background: isVerified
          ? 'linear-gradient(180deg, rgba(16, 32, 28, 0.9) 0%, rgba(8, 18, 16, 0.95) 100%)'
          : isPending
          ? 'linear-gradient(180deg, rgba(30, 24, 12, 0.9) 0%, rgba(18, 14, 8, 0.95) 100%)'
          : isRejected
          ? 'linear-gradient(180deg, rgba(32, 14, 18, 0.9) 0%, rgba(18, 8, 10, 0.95) 100%)'
          : 'linear-gradient(180deg, rgba(17, 24, 39, 0.9) 0%, rgba(10, 14, 24, 0.95) 100%)',
        border: isVerified
          ? '1px solid rgba(52, 211, 153, 0.4)'
          : isPending
          ? '1px solid rgba(245, 158, 11, 0.5)'
          : isRejected
          ? '1px solid rgba(244, 63, 94, 0.4)'
          : '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.4rem',
        boxShadow: isPending
          ? '0 0 25px rgba(245, 158, 11, 0.2), 0 8px 24px rgba(0,0,0,0.6)'
          : isVerified
          ? '0 0 25px rgba(52, 211, 153, 0.2), 0 8px 24px rgba(0,0,0,0.6)'
          : '0 8px 24px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Top Banner Tag: ⚔ TODAY'S QUEST */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Swords size={16} color="var(--gold-primary)" />
          <span
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '0.8rem',
              fontWeight: 900,
              letterSpacing: '0.1em',
              color: 'var(--text-gold)',
              textTransform: 'uppercase'
            }}
          >
            ⚔ TODAY'S QUEST
          </span>
        </div>

        {/* Verification Status Pill */}
        <VerificationStatus status={status} size="sm" />
      </div>

      {/* Title & Description */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '0.03em',
            color: '#ffffff',
            margin: '0 0 0.4rem',
            lineHeight: 1.3
          }}
        >
          {quest.title}
        </h3>
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            margin: 0
          }}
        >
          {quest.description}
        </p>
      </div>

      {/* TARGET Box */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-title)',
            fontWeight: 800,
            color: 'var(--text-gold)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.25rem'
          }}
        >
          <Target size={14} /> TARGET
        </div>
        <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600 }}>
          {quest.target || 'Execute real-life task and submit evidence'}
        </div>
      </div>

      {/* Category & Difficulty Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Badge variant={theme} size="sm">
          {quest.category}
        </Badge>
        <Badge variant="gold" size="sm">
          {quest.difficulty}
        </Badge>
      </div>

      {/* Potential Reward or Reward Unlocked */}
      <div
        style={{
          background: isVerified ? 'rgba(52, 211, 153, 0.08)' : 'rgba(15, 23, 42, 0.5)',
          border: isVerified ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontFamily: 'var(--font-title)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: isVerified ? '#34d399' : 'var(--text-muted)'
          }}
        >
          {isVerified ? '✓ Reward Unlocked' : 'Potential Reward'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span
            style={{
              color: '#38bdf8',
              fontWeight: 800,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Sparkles size={14} /> +{xpAmount} XP
          </span>
          <span
            style={{
              color: 'var(--text-gold)',
              fontWeight: 800,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Coins size={14} /> +{goldAmount} GOLD
          </span>
        </div>
      </div>

      {/* Submitted Explanation Preview (if pending or rejected) */}
      {(isPending || isRejected) && quest.explanation && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            borderLeft: isRejected ? '3px solid #fb7185' : '3px solid #fbbf24',
            padding: '0.6rem 0.85rem',
            borderRadius: '0 6px 6px 0',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            lineHeight: 1.4
          }}
        >
          <strong style={{ color: '#ffffff', fontStyle: 'normal' }}>User Log: </strong>
          "{quest.explanation}"
        </div>
      )}

      {/* Primary Action Button or Status States */}
      <div>
        {isAvailable && (
          <Button
            variant="gold"
            size="md"
            onClick={() => onCompleteClick && onCompleteClick(quest)}
            id={`quest-complete-btn-${quest.id}`}
            style={{ width: '100%', boxShadow: '0 0 20px rgba(245, 158, 11, 0.35)' }}
          >
            [ I COMPLETED THIS ]
          </Button>
        )}

        {isPending && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div
              style={{
                textAlign: 'center',
                padding: '0.5rem',
                fontSize: '0.82rem',
                color: '#fbbf24',
                fontFamily: 'var(--font-title)',
                fontWeight: 700
              }}
            >
              ⏳ Awaiting Verification (No rewards given yet)
            </div>

            {/* Mock Verification Controls for Testing */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="cyan"
                size="sm"
                icon={CheckCircle2}
                onClick={() => onMockVerify && onMockVerify(quest)}
                id={`mock-verify-btn-${quest.id}`}
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                Mock Verify ✓
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={XCircle}
                onClick={() => onMockReject && onMockReject(quest)}
                id={`mock-reject-btn-${quest.id}`}
                style={{
                  flex: 1,
                  fontSize: '0.78rem',
                  borderColor: 'rgba(244, 63, 94, 0.5)',
                  color: '#fb7185'
                }}
              >
                Mock Reject ✕
              </Button>
            </div>
          </div>
        )}

        {isVerified && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              background: 'rgba(52, 211, 153, 0.1)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(52, 211, 153, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.82rem', fontWeight: 800 }}>
              <ShieldCheck size={16} /> Verified & Added to Progress
            </div>
            {onResetStatus && (
              <button
                onClick={() => onResetStatus(quest.id)}
                title="Reset Quest to Available"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.2rem'
                }}
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        )}

        {isRejected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ color: '#fb7185', fontSize: '0.8rem', textAlign: 'center', fontWeight: 600 }}>
              Submission was not accepted. Please revise your explanation and evidence.
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={() => onResetStatus ? onResetStatus(quest.id) : onCompleteClick(quest)}
              style={{ width: '100%' }}
            >
              Try Again / Re-Submit
            </Button>
          </div>
        )}
      </div>

      {/* Delete button (if user created) */}
      {onDelete && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
          <button
            onClick={() => onDelete(quest.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fb7185')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Trash2 size={13} /> Remove Quest
          </button>
        </div>
      )}
    </div>
  )
}

export default QuestCard
