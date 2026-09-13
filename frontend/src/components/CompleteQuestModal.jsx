import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Coins,
  Flame,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Shield,
  Zap,
  Info,
  Trash2,
  Star,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'
import { ProgressBar } from './ProgressBar'

export function CompleteQuestModal({
  isOpen,
  onClose,
  quest,
  player,
  onConfirmCompletion,
  onSubmitQuest
}) {
  // Modal Stages: 'form' (input & evidence) -> 'celebration' (rewards & level-up animations)
  const [stage, setStage] = useState('form')
  const [reflectionText, setReflectionText] = useState('')
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [backendResult, setBackendResult] = useState(null)
  const fileInputRef = useRef(null)

  // Animated reward counters state
  const [animatedXP, setAnimatedXP] = useState(0)
  const [animatedGold, setAnimatedGold] = useState(0)
  const [animatedAttrGain, setAnimatedAttrGain] = useState(0)
  const [showLevelUpSection, setShowLevelUpSection] = useState(false)
  const [progressFill, setProgressFill] = useState(0)

  // Calculate rewards and level up logic
  const xpReward = backendResult?.xp_earned ?? (quest?.xpReward || 50)
  const goldReward = backendResult?.gold_earned ?? (quest?.goldReward || 20)
  const attributeGainAmount = backendResult?.updated_attribute?.gained ?? (quest?.attributeGain?.amount || 2)
  const attributeName = backendResult?.updated_attribute?.attribute?.toUpperCase() || (quest?.category || 'INTELLECT')
  const currentXP = player?.currentXP ?? 0
  const xpRequired = backendResult?.xp_required ?? (player?.xpRequired || 100)
  const currentLevel = backendResult?.old_level ?? (player?.level || 1)
  const nextLevel = backendResult?.new_level ?? (currentLevel + 1)
  const isLevelUp = backendResult?.level_up ?? ((currentXP + xpReward) >= xpRequired)

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setStage('form')
      setReflectionText('')
      setCompletionDate(new Date().toISOString().split('T')[0])
      setSelectedImage(null)
      setImagePreviewUrl(null)
      setIsSubmitting(false)
      setSubmissionError('')
      setBackendResult(null)
      setShowLevelUpSection(false)
      setAnimatedXP(0)
      setAnimatedGold(0)
      setAnimatedAttrGain(0)
      const initialPercent = Math.min(100, Math.round((currentXP / xpRequired) * 100))
      setProgressFill(initialPercent)
    }
  }, [isOpen, quest, currentXP, xpRequired])

  // Handle Image File Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle Quest Submission & trigger rewarding animation
  const handleSubmitQuest = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionError('')

    try {
      let result = null
      if (onSubmitQuest) {
        result = await onSubmitQuest({
          questId: quest.id,
          reflection: reflectionText,
          evidenceImage: imagePreviewUrl,
          completionDate: completionDate
        })
        setBackendResult(result)
      }

      setIsSubmitting(false)
      setStage('celebration')

      // Start ticker animations
      animateRewardCounters(result)
    } catch (err) {
      setIsSubmitting(false)
      setSubmissionError(err.message || 'Failed to submit quest to backend.')
    }
  }

  // Counter & Progress animation sequencer
  const animateRewardCounters = () => {
    // XP ticker
    let startXP = 0
    const xpStep = Math.ceil(xpReward / 20)
    const xpInterval = setInterval(() => {
      startXP += xpStep
      if (startXP >= xpReward) {
        setAnimatedXP(xpReward)
        clearInterval(xpInterval)
      } else {
        setAnimatedXP(startXP)
      }
    }, 30)

    // Gold ticker
    let startGold = 0
    const goldStep = Math.ceil(goldReward / 20)
    const goldInterval = setInterval(() => {
      startGold += goldStep
      if (startGold >= goldReward) {
        setAnimatedGold(goldReward)
        clearInterval(goldInterval)
      } else {
        setAnimatedGold(startGold)
      }
    }, 30)

    // Attribute ticker
    let startAttr = 0
    const attrInterval = setInterval(() => {
      startAttr += 1
      if (startAttr >= attributeGainAmount) {
        setAnimatedAttrGain(attributeGainAmount)
        clearInterval(attrInterval)
      } else {
        setAnimatedAttrGain(startAttr)
      }
    }, 100)

    // Progress Bar Fill Animation
    setTimeout(() => {
      const targetPercent = isLevelUp ? 100 : Math.min(100, Math.round(((currentXP + xpReward) / xpRequired) * 100))
      setProgressFill(targetPercent)
    }, 400)

    // Level up reveal after progress fills
    if (isLevelUp) {
      setTimeout(() => {
        setShowLevelUpSection(true)
      }, 1000)
    }
  }

  // Confirm and close
  const handleClaimAndClose = () => {
    if (onConfirmCompletion && quest) {
      onConfirmCompletion({
        questId: quest.id,
        reflection: reflectionText,
        evidenceImage: imagePreviewUrl,
        completionDate: completionDate,
        xp: xpReward,
        gold: goldReward,
        attributeGain: { name: attributeName, amount: attributeGainAmount },
        leveledUp: isLevelUp
      })
    }
    onClose()
  }

  if (!isOpen || !quest) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(2, 6, 17, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={stage === 'form' ? onClose : undefined}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #111827 0%, #080d1a 100%)',
          border: stage === 'celebration' && isLevelUp
            ? '2px solid var(--gold-primary)'
            : '1px solid rgba(245, 158, 11, 0.45)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: stage === 'celebration'
            ? '0 0 60px rgba(245, 158, 11, 0.4), 0 20px 50px rgba(0, 0, 0, 0.9)'
            : '0 0 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(245, 158, 11, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glowing Gradient Bar */}
        <div style={{
          height: '4px',
          background: stage === 'celebration' && isLevelUp
            ? 'linear-gradient(90deg, #f59e0b, #ef4444, #38bdf8, #fbbf24)'
            : 'linear-gradient(90deg, #38bdf8, #f59e0b, #34d399)',
          width: '100%'
        }} />

        {/* STAGE 1: COMPLETION FORM & EVIDENCE UPLOAD */}
        {stage === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            {/* Header */}
            <div style={{
              padding: '1.5rem 1.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
                  border: '1px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24',
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
                }}>
                  <Trophy size={22} />
                </div>
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    color: '#ffffff',
                    margin: 0
                  }}>
                    QUEST COMPLETE?
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Verify mission execution & claim real-world experience
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmitQuest} style={{ padding: '1.5rem 1.75rem', flex: 1 }}>
              {/* Quest Summary Header Banner */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.4rem',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <Badge variant={quest.category === 'INTELLECT' ? 'cyan' : quest.category === 'STRENGTH' ? 'red' : quest.category === 'VITALITY' ? 'green' : quest.category === 'WISDOM' ? 'purple' : 'gold'} size="sm">
                    {quest.category}
                  </Badge>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Sparkles size={13} /> +{xpReward} XP
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Coins size={13} /> +{goldReward} Gold
                    </span>
                  </div>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '0 0 0.35rem'
                }}>
                  {quest.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {quest.description}
                </p>
              </div>

              {/* COMPLETION DATE Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--cyan-light)',
                  marginBottom: '0.45rem'
                }}>
                  COMPLETION DATE *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem'
                }}>
                  <Calendar size={18} color="var(--gold-primary)" style={{ marginRight: '0.75rem', flexShrink: 0 }} />
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    required
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      width: '100%',
                      colorScheme: 'dark'
                    }}
                  />
                </div>
              </div>

              {/* "What did you do today?" Textarea */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-gold)',
                  marginBottom: '0.5rem'
                }}>
                  What did you do today? *
                </label>
                <textarea
                  placeholder="Tell us what you learned or accomplished..."
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  rows={4}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1.1rem',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.5,
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--gold-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                />
              </div>

              {/* UPLOAD EVIDENCE SECTION */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <label style={{
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}>
                    UPLOAD EVIDENCE (IMAGE)
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Optional Supporting File
                  </span>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="evidence-file-input"
                />

                {!imagePreviewUrl ? (
                  /* Upload Dropzone Box */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '1.5px dashed var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(15, 23, 42, 0.5)',
                      padding: '1.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--gold-primary)'
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.04)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)'
                      e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8'
                    }}>
                      <Upload size={19} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                        Click to upload screenshot or photo
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        PNG, JPG, WEBP up to 10MB
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Image Preview Box */
                  <div style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-medium)',
                    background: '#0a0f1d'
                  }}>
                    <img
                      src={imagePreviewUrl}
                      alt="Quest Evidence Preview"
                      style={{
                        width: '100%',
                        maxHeight: '180px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    {/* Overlay info & remove action */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          background: 'rgba(0, 0, 0, 0.75)',
                          border: '1px solid rgba(244, 63, 94, 0.6)',
                          borderRadius: '6px',
                          color: '#fb7185',
                          padding: '0.35rem 0.6rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                    <div style={{
                      padding: '0.5rem 0.85rem',
                      background: 'rgba(8, 12, 22, 0.95)',
                      fontSize: '0.78rem',
                      color: '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <CheckCircle2 size={14} /> Supporting image attached: {selectedImage?.name || 'evidence.jpg'}
                    </div>
                  </div>
                )}

                {/* Important Disclaimer Notice */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  marginTop: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(56, 189, 248, 0.06)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.4
                }}>
                  <Info size={15} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>Supporting Evidence Note:</strong> Uploaded images serve as reference telemetry. Rewards and achievements are verified through system progression heuristics.
                  </span>
                </div>

                {/* Submission Error Banner */}
                {submissionError && (
                  <div style={{
                    marginTop: '1rem',
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
                    <span>{submissionError}</span>
                  </div>
                )}
              </div>

              {/* Form Actions / SUBMIT QUEST */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                paddingTop: '1rem',
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
                  variant="gold"
                  size="md"
                  icon={Sparkles}
                  disabled={isSubmitting || !reflectionText.trim()}
                  id="submit-quest-btn"
                  style={{ minWidth: '160px' }}
                >
                  {isSubmitting ? 'VERIFYING...' : 'SUBMIT QUEST'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* STAGE 2: CINEMATIC REWARD & LEVEL-UP CELEBRATION */}
        {stage === 'celebration' && (
          <div style={{
            padding: '2.5rem 2rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ambient Burst Ray Animation */}
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(239, 68, 68, 0.1) 40%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
              {/* Trophy & Badge Icon */}
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(239, 68, 68, 0.3) 100%)',
                border: '2px solid var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 35px rgba(245, 158, 11, 0.6)'
              }}>
                <Award size={38} />
              </div>

              {/* Main Title */}
              <div style={{
                fontSize: '0.85rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: 'var(--text-gold)',
                textTransform: 'uppercase',
                marginBottom: '0.35rem'
              }}>
                MISSION VERIFIED & ARCHIVED
              </div>

              <h2 style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(2rem, 5vw, 2.7rem)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                margin: '0 0 1.75rem'
              }} className="text-gradient-gold">
                QUEST COMPLETE
              </h2>

              {/* REWARDS GRID: +50 XP, +20 GOLD, ATTRIBUTE +2, STREAK 7 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))',
                gap: '0.85rem',
                width: '100%',
                marginBottom: '1.75rem'
              }}>
                {/* XP Reward Box */}
                <div style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1.5px solid rgba(56, 189, 248, 0.45)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 0.5rem',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#38bdf8', marginBottom: '0.25rem' }}>
                    <Sparkles size={16} />
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase' }}>XP GAIN</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#38bdf8' }}>
                    +{animatedXP} XP
                  </div>
                </div>

                {/* Gold Reward Box */}
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1.5px solid rgba(245, 158, 11, 0.45)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 0.5rem',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--text-gold)', marginBottom: '0.25rem' }}>
                    <Coins size={16} />
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase' }}>TREASURY</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--text-gold)' }}>
                    +{animatedGold} GOLD
                  </div>
                </div>

                {/* Attribute Reward Box */}
                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1.5px solid rgba(168, 85, 247, 0.45)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 0.5rem',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#c084fc', marginBottom: '0.25rem' }}>
                    <Zap size={16} />
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase' }}>{attributeName}</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#c084fc' }}>
                    +{animatedAttrGain}
                  </div>
                </div>

                {/* Streak Box */}
                <div style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1.5px solid rgba(244, 63, 94, 0.45)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 0.5rem',
                  boxShadow: '0 0 20px rgba(244, 63, 94, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#fb7185', marginBottom: '0.25rem' }}>
                    <Flame size={16} />
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase' }}>STREAK</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#fb7185' }}>
                    🔥 {player?.streak || 7}
                  </div>
                </div>
              </div>

              {/* Progress Bar Animation */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
                    LEVEL {currentLevel} PROGRESSION
                  </span>
                  <span style={{ color: '#38bdf8', fontWeight: 800 }}>
                    {Math.min(xpRequired, currentXP + animatedXP)} / {xpRequired} XP ({progressFill}%)
                  </span>
                </div>
                <ProgressBar
                  progress={progressFill}
                  color={isLevelUp ? 'gold' : 'cyan'}
                  height="10px"
                  animated={true}
                />
              </div>

              {/* LEVEL UP CELEBRATION BOX (If Level Up Occurs) */}
              {showLevelUpSection && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)',
                  border: '2px solid var(--gold-primary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 0 35px rgba(245, 158, 11, 0.5)',
                  animation: 'scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    color: '#fbbf24',
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    marginBottom: '0.35rem'
                  }}>
                    <Star size={22} fill="#fbbf24" />
                    <span>LEVEL UP!</span>
                    <Star size={22} fill="#fbbf24" />
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.04em'
                  }}>
                    LEVEL {currentLevel} <span style={{ color: 'var(--gold-primary)' }}>→</span> LEVEL {nextLevel}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-gold)', marginTop: '0.35rem' }}>
                    +All Core Stats Scaled • Health & Energy Fully Restored
                  </div>
                </div>
              )}

              {/* CLAIM REWARDS BUTTON */}
              <Button
                variant="gold"
                size="lg"
                icon={ArrowRight}
                onClick={handleClaimAndClose}
                id="claim-quest-rewards-btn"
                style={{ width: '100%', justifyContent: 'center', boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)' }}
              >
                CLAIM REWARDS & CONTINUE
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompleteQuestModal
