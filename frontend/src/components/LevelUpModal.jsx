import React from 'react'
import { Trophy, Sparkles, Zap, Award, ArrowRight, ShieldCheck, Star } from 'lucide-react'
import { Button } from './Button'

export function LevelUpModal({
  isOpen,
  level = 6,
  onClose,
  unlockedPerks = [
    '+100 Gold Citadel Bonus',
    '+2 Available Stat Allocation Points',
    'Unlocked: Advanced Tier Quests in Guild Hub'
  ]
}) {
  if (!isOpen) return null

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
        backgroundColor: 'rgba(3, 5, 9, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="tactical-border pulse-glow"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'rgba(10, 14, 25, 0.96)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--gold-primary)',
          boxShadow: '0 0 50px rgba(245, 158, 11, 0.5), 0 20px 60px rgba(0,0,0,0.95)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Radiant Flare */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '320px',
            height: '140px',
            background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Level Up Emblem Icon */}
        <div
          style={{
            width: '84px',
            height: '84px',
            margin: '0 auto 1.25rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fde047 0%, #f59e0b 50%, #b45309 100%)',
            border: '3px solid #ffffff',
            boxShadow: '0 0 35px rgba(245, 158, 11, 0.8), 0 4px 20px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06080e',
            animation: 'floatSlow 4s ease-in-out infinite'
          }}
        >
          <Trophy size={42} />
        </div>

        {/* Kicker */}
        <div
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.9rem',
            fontWeight: 800,
            letterSpacing: '0.25em',
            color: 'var(--gold-light)',
            textTransform: 'uppercase',
            marginBottom: '0.25rem'
          }}
        >
          // ASCENSION PROTOCOL
        </div>

        {/* Big Title */}
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            margin: '0 0 0.5rem'
          }}
        >
          LEVEL UP <span className="text-gradient-gold">REACHED!</span>
        </h2>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--gold-primary)',
            color: 'var(--text-gold)',
            fontFamily: 'var(--font-title)',
            fontSize: '1.1rem',
            fontWeight: 800,
            marginBottom: '1.5rem'
          }}
        >
          <Star size={16} fill="var(--gold-light)" color="var(--gold-light)" />
          <span>YOU ARE NOW LEVEL {level}</span>
          <Star size={16} fill="var(--gold-light)" color="var(--gold-light)" />
        </div>

        {/* Unlocked Bonuses List */}
        <div
          style={{
            textAlign: 'left',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--text-dim)',
              textTransform: 'uppercase'
            }}
          >
            Ascension Rewards Acquired:
          </div>
          {unlockedPerks.map((perk, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                fontWeight: 600
              }}
            >
              <ShieldCheck size={18} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
              <span>{perk}</span>
            </div>
          ))}
        </div>

        {/* Claim Action Button */}
        <Button
          variant="gold"
          size="lg"
          icon={ArrowRight}
          onClick={onClose}
          id="claim-level-up-btn"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          CLAIM REWARDS & CONTINUE
        </Button>
      </div>
    </div>
  )
}

export default LevelUpModal
