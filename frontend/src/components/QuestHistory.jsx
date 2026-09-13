import React from 'react'
import { History, CheckCircle2, Clock, XCircle, Sparkles, Coins } from 'lucide-react'
import { VerificationStatus } from './VerificationStatus'

export function QuestHistory({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}
      >
        <History size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
        <div>No verified quest records in telemetry logs yet.</div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
      }}
    >
      {/* Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(160px, 2fr) minmax(90px, 1fr) minmax(130px, 1.2fr) minmax(120px, 1fr)',
          padding: '0.85rem 1.25rem',
          background: 'rgba(2, 6, 17, 0.8)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-title)',
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: 'var(--text-gold)',
          textTransform: 'uppercase'
        }}
      >
        <div>QUEST NAME</div>
        <div>DATE</div>
        <div>STATUS</div>
        <div style={{ textAlign: 'right' }}>REWARD</div>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {history.map((item, idx) => {
          const statusUpper = (item.status || 'VERIFIED').toUpperCase()
          const isVerified = statusUpper === 'VERIFIED'
          const isPending = statusUpper === 'PENDING VERIFICATION' || statusUpper === 'PENDING'
          const isRejected = statusUpper === 'REJECTED'

          return (
            <div
              key={item.id || idx}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(160px, 2fr) minmax(90px, 1fr) minmax(130px, 1.2fr) minmax(120px, 1fr)',
                padding: '0.9rem 1.25rem',
                borderBottom: idx !== history.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                alignItems: 'center',
                background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                transition: 'background 0.2s'
              }}
            >
              {/* QUEST NAME */}
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.88rem' }}>
                {item.questName || item.title}
              </div>

              {/* DATE */}
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                {item.date || '12 Sep 2026'}
              </div>

              {/* STATUS */}
              <div>
                <VerificationStatus status={statusUpper} size="sm" />
              </div>

              {/* REWARD */}
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  color: isVerified ? 'var(--text-gold)' : isPending ? '#fbbf24' : 'var(--text-muted)'
                }}
              >
                {isVerified ? item.reward || '+50 XP +20 GOLD' : isPending ? 'Pending Review' : '—'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuestHistory
