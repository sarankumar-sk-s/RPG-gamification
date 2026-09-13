import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Coins,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide-react'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'

export function RewardModal({
  isOpen,
  onClose,
  quest,
  player,
  onClaim
}) {
  const [animatedXP, setAnimatedXP] = useState(0)
  const [animatedGold, setAnimatedGold] = useState(0)
  const [animatedAttr, setAnimatedAttr] = useState(0)
  const [progressFill, setProgressFill] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)

  const xpReward = quest?.potentialXP || quest?.xpReward || 50
  const goldReward = quest?.potentialGold || quest?.goldReward || 20
  const attrReward = 2
  const attrName = quest?.category || 'INTELLECT'

  const currentXP = player?.currentXP ?? 0
  const xpRequired = player?.xpRequired ?? 100
  const currentLevel = player?.level ?? 1
  const isLevelUp = (currentXP + xpReward) >= xpRequired

  useEffect(() => {
    if (isOpen) {
      setAnimatedXP(0)
      setAnimatedGold(0)
      setAnimatedAttr(0)
      setShowLevelUp(false)

      const initialPercent = Math.min(100, Math.round((currentXP / xpRequired) * 100))
      setProgressFill(initialPercent)

      // XP ticker
      let currXp = 0
      const stepXp = Math.ceil(xpReward / 15)
      const intervalXp = setInterval(() => {
        currXp += stepXp
        if (currXp >= xpReward) {
          setAnimatedXP(xpReward)
          clearInterval(intervalXp)
        } else {
          setAnimatedXP(currXp)
        }
      }, 30)

      // Gold ticker
      let currGold = 0
      const stepGold = Math.ceil(goldReward / 15)
      const intervalGold = setInterval(() => {
        currGold += stepGold
        if (currGold >= goldReward) {
          setAnimatedGold(goldReward)
          clearInterval(intervalGold)
        } else {
          setAnimatedGold(currGold)
        }
      }, 30)

      // Attribute ticker
      let currAttr = 0
      const intervalAttr = setInterval(() => {
        currAttr += 1
        if (currAttr >= attrReward) {
          setAnimatedAttr(attrReward)
          clearInterval(intervalAttr)
        } else {
          setAnimatedAttr(currAttr)
        }
      }, 100)

      // Progress bar fill
      setTimeout(() => {
        const nextPercent = isLevelUp ? 100 : Math.min(100, Math.round(((currentXP + xpReward) / xpRequired) * 100))
        setProgressFill(nextPercent)
      }, 400)

      if (isLevelUp) {
        setTimeout(() => {
          setShowLevelUp(true)
        }, 800)
      }

      return () => {
        clearInterval(intervalXp)
        clearInterval(intervalGold)
        clearInterval(intervalAttr)
      }
    }
  }, [isOpen, quest, currentXP, xpRequired, xpReward, goldReward, isLevelUp])

  if (!isOpen || !quest) return null

  const handleClaim = () => {
    if (onClaim) {
      onClaim({
        xp: xpReward,
        gold: goldReward,
        attribute: attrName,
        attributeGain: attrReward,
        isLevelUp
      })
    }
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(2, 6, 17, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
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
          maxWidth: '580px',
          background: 'linear-gradient(180deg, #111827 0%, #070c18 100%)',
          border: '2px solid var(--gold-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 0 60px rgba(245, 158, 11, 0.45), 0 25px 60px rgba(0, 0, 0, 0.95)',
          padding: '2.5rem 2rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #38bdf8, #f59e0b, #34d399, #f59e0b)'
          }}
        />

        {/* Award Emblem */}
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(52, 211, 153, 0.3) 100%)',
            border: '2px solid var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            margin: '0 auto 1.25rem',
            boxShadow: '0 0 35px rgba(245, 158, 11, 0.6)'
          }}
        >
          <Award size={40} />
        </div>

        {/* Verification Subtitle */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            background: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.5)',
            color: '#34d399',
            fontFamily: 'var(--font-title)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginBottom: '0.75rem'
          }}
        >
          <CheckCircle2 size={16} /> QUEST VERIFIED ✓
        </div>

        {/* Main Title */}
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            margin: '0 0 0.5rem'
          }}
          className="text-gradient-gold"
        >
          REWARD UNLOCKED
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Telemetry validated for: <strong style={{ color: '#ffffff' }}>{quest.title}</strong>
        </p>

        {/* Rewards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '0.75rem',
            width: '100%',
            marginBottom: '1.75rem'
          }}
        >
          {/* XP Box */}
          <div
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1.5px solid rgba(56, 189, 248, 0.45)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 0.5rem',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#38bdf8', marginBottom: '0.2rem' }}>
              <Sparkles size={15} />
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-title)', fontWeight: 800 }}>XP GAIN</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#38bdf8' }}>
              +{animatedXP} XP
            </div>
          </div>

          {/* Gold Box */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1.5px solid rgba(245, 158, 11, 0.45)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 0.5rem',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--text-gold)', marginBottom: '0.2rem' }}>
              <Coins size={15} />
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-title)', fontWeight: 800 }}>GOLD</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--text-gold)' }}>
              +{animatedGold} GOLD
            </div>
          </div>

          {/* Attribute Box */}
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1.5px solid rgba(168, 85, 247, 0.45)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 0.5rem',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#c084fc', marginBottom: '0.2rem' }}>
              <Zap size={15} />
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-title)', fontWeight: 800 }}>{attrName}</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#c084fc' }}>
              +{animatedAttr}
            </div>
          </div>

          {/* Streak Box */}
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1.5px solid rgba(244, 63, 94, 0.45)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 0.5rem',
              boxShadow: '0 0 15px rgba(244, 63, 94, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#fb7185', marginBottom: '0.2rem' }}>
              <Flame size={15} />
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-title)', fontWeight: 800 }}>STREAK</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#fb7185' }}>
              🔥 +1
            </div>
          </div>
        </div>

        {/* Progress Bar Animation */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
              LEVEL {currentLevel} PROGRESSION
            </span>
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>
              {Math.min(xpRequired, currentXP + animatedXP)} / {xpRequired} XP ({progressFill}%)
            </span>
          </div>
          <ProgressBar progress={progressFill} color={isLevelUp ? 'gold' : 'cyan'} height="9px" animated={true} />
        </div>

        {/* LEVEL UP! BANNER */}
        {showLevelUp && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(239, 68, 68, 0.25) 100%)',
              border: '2px solid var(--gold-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              marginBottom: '1.5rem',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)',
              animation: 'scaleUp 0.35s ease-out'
            }}
          >
            <div style={{ color: '#fbbf24', fontFamily: 'var(--font-title)', fontSize: '1.3rem', fontWeight: 900 }}>
              🌟 LEVEL UP!
            </div>
            <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '0.2rem' }}>
              You advanced to <strong style={{ color: 'var(--gold-light)' }}>LEVEL {currentLevel + 1}</strong>!
            </div>
          </div>
        )}

        <Button
          variant="gold"
          size="lg"
          onClick={handleClaim}
          id="claim-rewards-btn"
          style={{ width: '100%', boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)' }}
        >
          CLAIM REWARDS & CONTINUE
        </Button>
      </div>
    </div>
  )
}

export default RewardModal
