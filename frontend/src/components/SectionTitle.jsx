import React from 'react'

export function SectionTitle({
  kicker, // e.g. "CHAPTER 01: PROGRESSION" or "MISSION BRIEFING"
  title, // e.g. "ATTRIBUTES & STATS"
  highlight, // optional highlighted keyword e.g. "STATS"
  subtitle,
  align = 'left', // left | center | right
  action,
  className = '',
  style = {}
}) {
  const alignStyles = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  }

  const textAlignStyles = {
    left: 'left',
    center: 'center',
    right: 'right',
  }

  return (
    <div
      className={`rpg-section-title ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignStyles[align],
        textAlign: textAlignStyles[align],
        gap: '0.4rem',
        marginBottom: '1.75rem',
        width: '100%',
        ...style
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: alignStyles[align]
        }}>
          {/* Chapter / Narrative Kicker */}
          {kicker && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-title)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--red-accent)',
              marginBottom: '0.2rem'
            }}>
              <span style={{
                width: '12px',
                height: '2px',
                background: 'var(--red-accent)',
                display: 'inline-block'
              }} />
              <span>{kicker}</span>
            </div>
          )}

          {/* Main Title */}
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontFamily: 'var(--font-title)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            margin: 0
          }}>
            {title} {highlight && <span className="text-gradient-gold">{highlight}</span>}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              marginTop: '0.4rem',
              maxWidth: '650px'
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Action button if present */}
        {action && <div>{action}</div>}
      </div>

      {/* Cinematic Divider Line */}
      <div style={{
        width: '100%',
        height: '1px',
        background: 'linear-gradient(90deg, var(--gold-primary) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 100%)',
        marginTop: '0.5rem',
        opacity: 0.6
      }} />
    </div>
  )
}
