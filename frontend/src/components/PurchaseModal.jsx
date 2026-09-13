import React, { useState } from 'react'
import {
  X,
  Sparkles,
  Coins,
  Shield,
  Zap,
  Award,
  HeartPulse,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'

export function PurchaseModal({
  isOpen,
  onClose,
  item,
  playerGold = 250,
  onConfirmPurchase
}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen || !item) return null

  const canAfford = playerGold >= item.price
  const remainingGold = playerGold - item.price

  const getItemIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles':
        return Sparkles
      case 'Zap':
        return Zap
      case 'Award':
        return Award
      case 'Shield':
        return Shield
      case 'HeartPulse':
        return HeartPulse
      case 'Compass':
        return Compass
      default:
        return Sparkles
    }
  }

  const ItemIcon = getItemIcon(item.icon)

  const handleConfirm = () => {
    if (!canAfford) return
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)

      setTimeout(() => {
        onConfirmPurchase(item)
        setIsSuccess(false)
        onClose()
      }, 800)
    }, 400)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={!isProcessing && !isSuccess ? onClose : undefined}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(180deg, #111827 0%, #0a0f1d 100%)',
          border: isSuccess
            ? '2px solid #34d399'
            : '1.5px solid rgba(245, 158, 11, 0.45)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(245, 158, 11, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Stripe */}
        <div style={{
          height: '4px',
          background: isSuccess
            ? '#34d399'
            : 'linear-gradient(90deg, #f59e0b, #ef4444, #38bdf8)',
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
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <Coins size={20} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#ffffff',
                margin: 0
              }}>
                PURCHASE ITEM?
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Citadel Tactical Armory Requisition
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing || isSuccess}
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

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {isSuccess ? (
            /* PURCHASED Success State */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(52, 211, 153, 0.15)',
                border: '2px solid #34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 30px rgba(52, 211, 153, 0.4)'
              }}>
                <CheckCircle2 size={34} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#34d399',
                letterSpacing: '0.06em',
                margin: '0 0 0.5rem'
              }}>
                PURCHASED!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
                {item.name} has been transferred to your inventory.
              </p>
            </div>
          ) : (
            /* Item Info & Confirmation */
            <div>
              {/* Item Card Preview */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: `1.5px solid ${item.accentColor}55`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.15rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: `${item.accentColor}22`,
                  border: `1.5px solid ${item.accentColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.accentColor,
                  flexShrink: 0,
                  boxShadow: `0 0 20px ${item.accentColor}44`
                }}>
                  <ItemIcon size={28} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Badge variant={item.color} size="sm">
                      {item.rarity}
                    </Badge>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {item.type}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    margin: '0 0 0.35rem',
                    letterSpacing: '0.03em'
                  }}>
                    {item.name}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Price & Balance Calculation Breakdown */}
              <div style={{
                background: 'rgba(10, 14, 24, 0.7)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Item Price:</span>
                  <span style={{ color: 'var(--text-gold)', fontWeight: 800, fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Coins size={15} /> {item.price} GOLD
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current Citadel Treasury:</span>
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>
                    {playerGold} Gold
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.6rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.92rem'
                }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Remaining Balance:</span>
                  <span style={{
                    color: canAfford ? '#34d399' : '#fb7185',
                    fontWeight: 900,
                    fontFamily: 'var(--font-title)'
                  }}>
                    {canAfford ? `${remainingGold} Gold` : 'Insufficient Gold'}
                  </span>
                </div>
              </div>

              {!canAfford && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  color: '#fb7185',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem'
                }}>
                  <AlertTriangle size={16} />
                  <span>You need {item.price - playerGold} more Gold. Complete daily quests to earn gold!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem'
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
                  type="button"
                  variant="gold"
                  size="md"
                  icon={Coins}
                  disabled={!canAfford || isProcessing}
                  onClick={handleConfirm}
                  id="confirm-purchase-btn"
                  style={{ minWidth: '180px' }}
                >
                  {isProcessing ? 'REQUISITIONING...' : 'CONFIRM PURCHASE'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseModal
