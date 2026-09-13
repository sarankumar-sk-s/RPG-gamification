import React, { useState, useEffect } from 'react'
import {
  X,
  Sparkles,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Send,
  Calendar
} from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'
import { EvidenceUpload } from './EvidenceUpload'
import { VerificationStatus } from './VerificationStatus'

export function QuestCompletionModal({
  isOpen,
  onClose,
  quest,
  onSubmitForVerification
}) {
  const [explanation, setExplanation] = useState('')
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0])
  const [evidenceImage, setEvidenceImage] = useState(null)
  const [evidenceFileName, setEvidenceFileName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset modal state on opening
  useEffect(() => {
    if (isOpen) {
      setExplanation('')
      setCompletionDate(new Date().toISOString().split('T')[0])
      setEvidenceImage(null)
      setEvidenceFileName('')
      setIsSubmitted(false)
      setValidationError('')
      setIsSubmitting(false)
    }
  }, [isOpen, quest])

  if (!isOpen || !quest) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!explanation.trim()) {
      setValidationError('Please explain what you actually did to complete this quest.')
      return
    }

    setIsSubmitting(true)
    setValidationError('')

    // Submit data to parent
    if (onSubmitForVerification) {
      onSubmitForVerification({
        questId: quest.id,
        explanation: explanation.trim(),
        evidenceImage,
        completionDate
      })
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 400)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(3, 7, 18, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={!isSubmitting ? onClose : undefined}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #111827 0%, #090e1a 100%)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glowing amber edge */}
        <div
          style={{
            height: '4px',
            background: isSubmitted
              ? 'linear-gradient(90deg, #f59e0b, #fbbf24, #38bdf8)'
              : 'linear-gradient(90deg, #38bdf8, #f59e0b, #eab308)',
            width: '100%'
          }}
        />

        {/* Header */}
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
              <FileText size={20} />
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
                QUEST COMPLETION
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                QUEST: <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>{quest.title}</span>
              </div>
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

        {/* CONTENT STAGE 1: SUBMISSION FORM */}
        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '1.5rem 1.75rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {/* Quest Brief Context */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <Badge variant={quest.category === 'INTELLECT' ? 'cyan' : quest.category === 'STRENGTH' ? 'red' : 'gold'} size="sm">
                  {quest.category}
                </Badge>
                <Badge variant="gold" size="sm">
                  {quest.difficulty}
                </Badge>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.2rem' }}>
                TARGET: <span style={{ color: 'var(--text-gold)' }}>{quest.target || 'Complete designated operational task'}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {quest.description}
              </div>
            </div>

            {/* Error Message */}
            {validationError && (
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
                <span>{validationError}</span>
              </div>
            )}

            {/* COMPLETION DATE Input */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--cyan-light)',
                  marginBottom: '0.45rem'
                }}
              >
                COMPLETION DATE *
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem'
                }}
              >
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

            {/* WHAT DID YOU DO? Section */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-gold)',
                  marginBottom: '0.35rem'
                }}
              >
                WHAT DID YOU DO? *
              </label>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>
                Tell us what you actually did to complete today's quest.
              </p>
              <textarea
                rows={4}
                value={explanation}
                onChange={(e) => {
                  setExplanation(e.target.value)
                  if (validationError) setValidationError('')
                }}
                placeholder="I learned about classes and objects, created 3 example classes, and solved 3 exercises..."
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.1rem',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.5
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--gold-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
              />
            </div>

            {/* ADD EVIDENCE Section */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem'
                }}
              >
                ADD EVIDENCE
              </label>
              <EvidenceUpload
                imagePreviewUrl={evidenceImage}
                onImageSelect={(dataUrl, fileName) => {
                  setEvidenceImage(dataUrl)
                  setEvidenceFileName(fileName)
                }}
                onImageRemove={() => {
                  setEvidenceImage(null)
                  setEvidenceFileName('')
                }}
                selectedFileName={evidenceFileName}
              />
            </div>

            {/* Form Action Buttons */}
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
                variant="gold"
                size="md"
                icon={Send}
                disabled={isSubmitting || !explanation.trim()}
                id="submit-verification-btn"
                style={{ minWidth: '220px' }}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT FOR VERIFICATION'}
              </Button>
            </div>
          </form>
        ) : (
          /* CONTENT STAGE 2: SUBMITTED FOR VERIFICATION SCREEN */
          <div
            style={{
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Ambient pending aura */}
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '2px solid var(--gold-primary)',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
                marginBottom: '1.25rem'
              }}
            >
              <Clock size={34} />
            </div>

            <div
              style={{
                fontSize: '0.85rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: 'var(--text-gold)',
                textTransform: 'uppercase',
                marginBottom: '0.35rem'
              }}
            >
              MISSION TRANSMISSION RECEIVED
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.85rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#ffffff',
                margin: '0 0 0.75rem'
              }}
            >
              SUBMITTED FOR VERIFICATION
            </h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                maxWidth: '460px',
                lineHeight: 1.5,
                margin: '0 0 1.5rem'
              }}
            >
              Your quest completion has been submitted. The system will review your action log and telemetry before unlocking rewards.
            </p>

            {/* STATUS BOX */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.5rem',
                width: '100%',
                maxWidth: '420px',
                marginBottom: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                CURRENT STATUS
              </div>
              <VerificationStatus status="PENDING VERIFICATION" size="lg" />
            </div>

            {/* Reminder Alert that Rewards are NOT unlocked yet */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                maxWidth: '480px',
                marginBottom: '1.75rem',
                lineHeight: 1.45
              }}
            >
              ⏳ <strong>Notice:</strong> XP (+{quest.potentialXP || 50} XP) and Gold (+{quest.potentialGold || 20} Gold) will be awarded to your profile only after this submission is verified.
            </div>

            <Button
              variant="gold"
              size="md"
              onClick={onClose}
              id="confirm-submitted-close-btn"
              style={{ minWidth: '180px' }}
            >
              RETURN TO MISSIONS
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestCompletionModal
