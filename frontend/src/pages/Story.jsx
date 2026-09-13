import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  Button,
  Badge,
  ProgressBar
} from '../components'
import {
  BookOpen,
  Lock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Shield,
  Sword,
  CheckCircle2,
  Play,
  X,
  MapPin,
  Clock,
  Compass,
  Check,
  AlertCircle,
  Flag
} from 'lucide-react'

// Assets & Data
import panoramaBg from '../assets/rpg_panorama_bg.jpg'
import { storyChaptersData, comingSoonStoryChapters } from '../data/mockWorldStoryData'
import { initialPlayerData } from '../data/mockDashboardData'
import { useAuth } from '../context/AuthContext'

export function Story() {
  const navigate = useNavigate()
  const { character } = useAuth()
  const [player, setPlayer] = useState(initialPlayerData)

  // Sync live character stats if available
  React.useEffect(() => {
    if (character) {
      setPlayer((prev) => ({
        ...prev,
        gold: character.gold ?? prev.gold,
        level: character.level ?? prev.level,
        currentXP: character.current_xp ?? prev.currentXP,
        xpRequired: character.xp_required ?? prev.xpRequired,
        streak: character.streak ?? prev.streak
      }))
    }
  }, [character])

  // Playable chapters state (Chapters 1 to 4)
  const [chapters, setChapters] = useState(storyChaptersData)
  // Reading view modal state
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false)
  const [readingChapterIndex, setReadingChapterIndex] = useState(0)
  const [toastMessage, setToastMessage] = useState(null)

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  // Calculate progression
  const completedCount = chapters.filter((c) => c.status === 'COMPLETED').length
  const progressPercentage = Math.round((completedCount / chapters.length) * 100)

  // Open Story Reading View for a given playable chapter
  const handleOpenReading = (chapterIdx) => {
    if (chapterIdx < 0 || chapterIdx >= chapters.length) return
    setReadingChapterIndex(chapterIdx)
    setIsReadingModalOpen(true)
  }

  // Navigate within reading modal
  const handleNextInModal = () => {
    if (readingChapterIndex < chapters.length - 1) {
      setReadingChapterIndex((prev) => prev + 1)
    }
  }

  const handlePrevInModal = () => {
    if (readingChapterIndex > 0) {
      setReadingChapterIndex((prev) => prev - 1)
    }
  }

  // Toggle chapter completion state
  const toggleChapterCompletion = (idx) => {
    setChapters((prev) => {
      const updated = [...prev]
      const current = updated[idx]
      const newStatus = current.status === 'COMPLETED' ? 'AVAILABLE' : 'COMPLETED'
      updated[idx] = { ...current, status: newStatus }
      return updated
    })
    const isNowCompleted = chapters[idx].status !== 'COMPLETED'
    triggerToast(
      isNowCompleted
        ? `✓ ${chapters[idx].chapterNumber} marked as COMPLETED!`
        : `▶ ${chapters[idx].chapterNumber} marked as AVAILABLE.`
    )
  }

  // Handle clicking a locked chapter card
  const handleLockedChapterClick = (ch) => {
    triggerToast(`🔒 ${ch.chapterNumber} is locked. More chapters coming soon in future updates!`)
  }

  const activeReadingChapter = chapters[readingChapterIndex] || chapters[0]

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundImage: `
          linear-gradient(180deg, rgba(6, 9, 16, 0.72) 0%, rgba(5, 7, 13, 0.88) 45%, rgba(4, 6, 10, 0.98) 100%),
          url(${panoramaBg})
        `,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center top',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Viewport Overlay */}
      <div className="game-viewport-overlay" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '85px',
            right: '24px',
            zIndex: 1200,
            background: 'rgba(15, 23, 42, 0.96)',
            border: '1px solid var(--gold-primary)',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.5), 0 8px 24px rgba(0,0,0,0.8)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--text-gold)',
            fontFamily: 'var(--font-title)',
            fontSize: '0.95rem',
            fontWeight: 700,
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <Sparkles size={18} color="#fde047" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION */}
      <Navbar
        level={player.level}
        currentXP={player.currentXP}
        xpRequired={player.xpRequired}
        gold={player.gold}
        streak={player.streak}
        activeLink="story"
        onNavigate={(nav) => {
          if (nav === 'landing') navigate('/')
          else if (nav === 'dashboard') navigate('/dashboard')
          else if (nav === 'missions') navigate('/missions')
          else if (nav === 'world') navigate('/world')
          else if (nav === 'character') navigate('/character')
          else if (nav === 'shop') navigate('/shop')
          else if (nav === 'inventory') navigate('/inventory')
          else navigate('/dashboard')
        }}
        onProfileClick={() => navigate('/character')}
      />

      {/* MAIN STORY CAMPAIGN HUB */}
      <main style={{ flex: 1, padding: '2.5rem 0 5rem', position: 'relative', zIndex: 1 }}>
        <div className="container-custom">
          {/* Header Banner */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: 'var(--text-gold)',
                  textTransform: 'uppercase'
                }}
              >
                Attack on Titan • Campaign Chronicles
              </span>
              <span style={{ width: '30px', height: '1px', background: 'var(--gold-primary)' }} />
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                margin: '0 0 0.5rem'
              }}
              className="text-gradient-gold"
            >
              THE STORY CAMPAIGN
            </h1>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                maxWidth: '720px',
                lineHeight: 1.5,
                margin: 0
              }}
            >
              Step into the world of Attack on Titan. Each chapter is an episode in humanity's fight for survival.
              Unlock and conquer story chapters as you advance your Life RPG discipline.
            </p>
          </div>

          {/* LIFE RPG PROGRESSION BAR & CAMPAIGN STATUS */}
          <div
            id="story-progress-card"
            style={{
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.92) 0%, rgba(10, 14, 26, 0.96) 100%)',
              border: '1.5px solid var(--border-gold)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem 2rem',
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.15), 0 10px 30px rgba(0, 0, 0, 0.8)',
              marginBottom: '2.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Accent Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f43f5e)'
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                marginBottom: '1rem'
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    color: 'var(--text-gold)',
                    textTransform: 'uppercase',
                    marginBottom: '0.2rem'
                  }}
                >
                  LIFE RPG PROGRESSION
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <span>STORY PROGRESS</span>
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid var(--gold-primary)',
                      color: 'var(--text-gold)',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.75rem',
                      borderRadius: 'var(--radius-md)'
                    }}
                    id="story-progress-text"
                  >
                    Chapter {completedCount} / 4
                  </span>
                </div>
              </div>

              {/* State Legend */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  background: 'rgba(15, 23, 42, 0.65)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#34d399', fontWeight: 700 }}>
                  <CheckCircle2 size={14} />
                  <span>✓ COMPLETED</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#fde047', fontWeight: 700 }}>
                  <Play size={14} fill="#fde047" />
                  <span>▶ AVAILABLE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#fb7185', fontWeight: 700 }}>
                  <Lock size={14} />
                  <span>🔒 LOCKED</span>
                </div>
              </div>
            </div>

            {/* Glowing Progress Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.4rem',
                  fontWeight: 600
                }}
              >
                <span>Campaign Milestones Accomplished</span>
                <span style={{ color: 'var(--text-gold)', fontWeight: 800 }}>{progressPercentage}%</span>
              </div>
              <div
                style={{
                  height: '10px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPercentage}%`,
                    background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 60%, #34d399 100%)',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.6)',
                    transition: 'width 0.4s ease-in-out'
                  }}
                  id="story-progress-bar-fill"
                />
              </div>
            </div>

            {/* Campaign Map Trail Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '0.75rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {chapters.map((ch, idx) => {
                const isCompleted = ch.status === 'COMPLETED'
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleOpenReading(idx)}
                    style={{
                      background: isCompleted
                        ? 'rgba(52, 211, 153, 0.12)'
                        : 'rgba(245, 158, 11, 0.09)',
                      border: isCompleted
                        ? '1px solid rgba(52, 211, 153, 0.45)'
                        : '1px solid rgba(245, 158, 11, 0.35)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    title={`Click to read ${ch.chapterNumber}`}
                  >
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        {ch.episodeNumber}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
                        {ch.chapterNumber}
                      </div>
                    </div>
                    {isCompleted ? (
                      <CheckCircle2 size={16} color="#34d399" />
                    ) : (
                      <Play size={14} fill="#fde047" color="#fde047" />
                    )}
                  </button>
                )
              })}

              {/* Locked Node Indicator */}
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.07)',
                  border: '1px dashed rgba(244, 63, 94, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: 0.8
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>EPISODE 5-8</div>
                  <div style={{ fontSize: '0.82rem', color: '#fb7185', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
                    COMING SOON
                  </div>
                </div>
                <Lock size={15} color="#fb7185" />
              </div>
            </div>
          </div>

          {/* SECTION TITLE: CURRENT CHAPTERS */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Compass size={18} color="#f59e0b" />
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: 'var(--text-gold)',
                    textTransform: 'uppercase'
                  }}
                >
                  Playable Episodes
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  margin: 0,
                  letterSpacing: '0.03em',
                  color: '#ffffff'
                }}
              >
                ACTIVE STORY CHAPTERS
              </h2>
            </div>

            <Badge variant="gold" size="md">
              4 PLAYABLE CHAPTERS
            </Badge>
          </div>

          {/* PLAYABLE CHAPTERS GRID (EXACTLY 4 CHAPTERS) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
              marginBottom: '4.5rem'
            }}
            id="playable-chapters-grid"
          >
            {chapters.map((ch, idx) => {
              const isCompleted = ch.status === 'COMPLETED'
              const statusDisplay = isCompleted ? 'COMPLETED' : 'AVAILABLE'

              return (
                <div
                  key={ch.id}
                  id={`chapter-card-${idx + 1}`}
                  style={{
                    background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.92) 0%, rgba(10, 14, 26, 0.97) 100%)',
                    border: isCompleted
                      ? '1.5px solid rgba(52, 211, 153, 0.45)'
                      : '1.5px solid var(--border-gold)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.75rem',
                    boxShadow: isCompleted
                      ? '0 0 25px rgba(52, 211, 153, 0.15), 0 8px 24px rgba(0, 0, 0, 0.7)'
                      : '0 0 25px rgba(245, 158, 11, 0.18), 0 8px 24px rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {/* Top Card Accent */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: isCompleted
                        ? 'linear-gradient(90deg, #34d399, #10b981)'
                        : 'linear-gradient(90deg, #f59e0b, #fde047)'
                    }}
                  />

                  {/* Top Meta Details */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        marginBottom: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-title)',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            color: 'var(--text-gold)',
                            textTransform: 'uppercase'
                          }}
                        >
                          {ch.chapterNumber}
                        </span>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>•</span>
                        <span
                          style={{
                            fontFamily: 'var(--font-title)',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {ch.episodeNumber}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-title)',
                          fontWeight: 800,
                          letterSpacing: '0.06em',
                          background: isCompleted ? 'rgba(52, 211, 153, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isCompleted ? '#34d399' : '#fde047',
                          border: isCompleted ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)'
                        }}
                      >
                        {isCompleted ? <CheckCircle2 size={12} /> : <Play size={11} fill="#fde047" />}
                        <span>{isCompleted ? '✓ COMPLETED' : '▶ AVAILABLE'}</span>
                      </span>
                    </div>

                    {/* Official Episode Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: '1.28rem',
                        fontWeight: 900,
                        letterSpacing: '0.02em',
                        color: '#ffffff',
                        lineHeight: 1.25,
                        margin: '0 0 0.85rem',
                        minHeight: '2.5rem'
                      }}
                    >
                      {ch.title}
                    </h3>

                    {/* Concise Summary */}
                    <p
                      style={{
                        fontSize: '0.92rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                        margin: '0 0 1.25rem',
                        minHeight: '4.8rem'
                      }}
                    >
                      {ch.shortSummary}
                    </p>

                    {/* Meta info strip */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        padding: '0.5rem 0',
                        borderTop: '1px solid var(--border-subtle)',
                        marginBottom: '1.25rem'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} color="#f59e0b" />
                        <span>{ch.location}</span>
                      </span>
                      <span style={{ color: 'var(--text-gold)', fontWeight: 700 }}>
                        STATUS: {statusDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div>
                    <Button
                      variant="gold"
                      size="md"
                      icon={BookOpen}
                      onClick={() => handleOpenReading(idx)}
                      id={`read-story-btn-${idx + 1}`}
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-title)',
                        fontWeight: 800,
                        letterSpacing: '0.08em'
                      }}
                    >
                      READ STORY
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* COMING SOON SECTION (AFTER CHAPTER 4) */}
          <div style={{ marginTop: '3.5rem' }} id="more-chapters-coming-soon-section">
            {/* Section Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Lock size={18} color="#fb7185" />
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-title)',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      color: '#fb7185',
                      textTransform: 'uppercase'
                    }}
                  >
                    Uncharted Territory
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 900,
                    margin: 0,
                    letterSpacing: '0.04em',
                    color: '#ffffff'
                  }}
                  id="more-chapters-heading"
                >
                  MORE CHAPTERS COMING SOON
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.35rem 0 0' }}>
                  The Scout Regiment reconnaissance continues deeper into Titan territory. These chapters are currently locked.
                </p>
              </div>

              <Badge variant="red" size="md">
                LOCKED CONTENT
              </Badge>
            </div>

            {/* LOCKED CHAPTER CARDS (CHAPTERS 5 TO 8) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem'
              }}
              id="locked-chapters-grid"
            >
              {comingSoonStoryChapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => handleLockedChapterClick(ch)}
                  style={{
                    background: 'rgba(10, 14, 24, 0.75)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'not-allowed',
                    opacity: 0.85,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
                    transition: 'all 0.2s ease'
                  }}
                  id={`locked-chapter-${ch.id}`}
                  title={`${ch.chapterNumber} is locked. Coming soon!`}
                >
                  {/* Subtle Diagonal Locked Watermark */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(244, 63, 94, 0.18)',
                      border: '1px solid rgba(244, 63, 94, 0.4)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.2rem 0.55rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#fb7185',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-title)',
                      fontWeight: 800,
                      letterSpacing: '0.06em'
                    }}
                  >
                    <span>{ch.badgeText}</span>
                  </div>

                  <div style={{ marginBottom: '0.75rem' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: 'var(--text-muted)',
                        letterSpacing: '0.08em',
                        marginBottom: '0.2rem'
                      }}
                    >
                      {ch.chapterNumber}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-dim)',
                        fontFamily: 'var(--font-title)',
                        fontWeight: 700
                      }}
                    >
                      {ch.episodeNumber}
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.3,
                      margin: '0 0 0.75rem'
                    }}
                  >
                    {ch.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      margin: '0 0 1.25rem'
                    }}
                  >
                    {ch.shortSummary}
                  </p>

                  <div
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(244, 63, 94, 0.08)',
                      border: '1px solid rgba(244, 63, 94, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: '#fb7185',
                      fontWeight: 700
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Lock size={14} />
                      <span>STATUS: LOCKED</span>
                    </span>
                    <span>COMING SOON</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* CINEMATIC STORY READING VIEW MODAL */}
      {isReadingModalOpen && (
        <div
          id="story-reading-modal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(2, 6, 17, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setIsReadingModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '780px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'linear-gradient(180deg, #111827 0%, #090e1a 100%)',
              border: '1.5px solid var(--gold-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              boxShadow: '0 0 60px rgba(0,0,0,0.95), 0 0 35px rgba(245, 158, 11, 0.35)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsReadingModalOpen(false)}
              id="close-reading-modal-btn"
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Close story view"
            >
              <X size={20} />
            </button>

            {/* Modal Header: Chapter & Episode Info */}
            <div style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <Badge variant="gold" size="md">
                  <span id="reading-modal-chapter">{activeReadingChapter.chapterNumber}</span>
                </Badge>
                <Badge variant="glass" size="md">
                  <span id="reading-modal-episode">{activeReadingChapter.episodeNumber}</span>
                </Badge>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800,
                    background: activeReadingChapter.status === 'COMPLETED' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: activeReadingChapter.status === 'COMPLETED' ? '#34d399' : '#fde047',
                    border: activeReadingChapter.status === 'COMPLETED' ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)'
                  }}
                >
                  {activeReadingChapter.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : <Play size={11} fill="#fde047" />}
                  <span>{activeReadingChapter.status === 'COMPLETED' ? '✓ COMPLETED' : '▶ AVAILABLE'}</span>
                </span>
              </div>

              {/* Title & Japanese Subtitle */}
              <h2
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  margin: '0.5rem 0 0.35rem'
                }}
                id="reading-modal-title"
              >
                {activeReadingChapter.title}
              </h2>

              <div
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-gold)',
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <span>{activeReadingChapter.japaneseTitle}</span>
                <span>•</span>
                <span style={{ color: 'var(--text-muted)' }}>{activeReadingChapter.location}</span>
              </div>
            </div>

            {/* Thematic Accent Divider */}
            <div
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, var(--gold-primary), rgba(245, 158, 11, 0.1), transparent)',
                marginBottom: '1.75rem'
              }}
            />

            {/* Short Story Summary (Cinematic Body) */}
            <div style={{ marginBottom: '2rem' }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: 'var(--text-gold)',
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem'
                }}
              >
                EPISODE SUMMARY
              </div>
              <p
                style={{
                  fontSize: '1.08rem',
                  color: '#ffffff',
                  lineHeight: 1.75,
                  margin: '0 0 1.5rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  borderLeft: '4px solid var(--gold-primary)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                }}
                id="reading-modal-summary"
              >
                {activeReadingChapter.synopsis || activeReadingChapter.shortSummary}
              </p>

              {/* Iconic Quote */}
              {activeReadingChapter.quote && (
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    color: 'var(--text-gold)',
                    fontStyle: 'italic',
                    fontSize: '0.94rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <Sparkles size={18} color="#fde047" style={{ flexShrink: 0 }} />
                  <span>{activeReadingChapter.quote}</span>
                </div>
              )}

              {/* Key Narrative Moments */}
              {activeReadingChapter.keyMoments && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-title)',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem'
                    }}
                  >
                    KEY EPISODE CHRONICLES
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
                    {activeReadingChapter.keyMoments.map((moment, mIdx) => (
                      <div
                        key={mIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.88rem',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <Check size={15} color="#f59e0b" />
                        <span>{moment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Life RPG Milestone Action */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                marginBottom: '2rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  LIFE RPG CAMPAIGN MILESTONE
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-gold)', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
                  {activeReadingChapter.rewardsGranted}
                </div>
              </div>

              <button
                onClick={() => toggleChapterCompletion(readingChapterIndex)}
                style={{
                  background: activeReadingChapter.status === 'COMPLETED'
                    ? 'rgba(52, 211, 153, 0.2)'
                    : 'rgba(245, 158, 11, 0.2)',
                  border: activeReadingChapter.status === 'COMPLETED'
                    ? '1.5px solid #34d399'
                    : '1.5px solid var(--gold-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: activeReadingChapter.status === 'COMPLETED' ? '#34d399' : 'var(--text-gold)',
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                id="toggle-completion-btn"
              >
                {activeReadingChapter.status === 'COMPLETED' ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>COMPLETED ✓</span>
                  </>
                ) : (
                  <>
                    <Flag size={16} />
                    <span>MARK AS COMPLETED</span>
                  </>
                )}
              </button>
            </div>

            {/* NAVIGATION FOOTER */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              {/* ← PREVIOUS Button (Disabled for Chapter 1) */}
              <Button
                variant="outline"
                size="md"
                icon={ChevronLeft}
                onClick={handlePrevInModal}
                disabled={readingChapterIndex === 0}
                id="modal-prev-btn"
                style={{
                  opacity: readingChapterIndex === 0 ? 0.4 : 1,
                  cursor: readingChapterIndex === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                ← PREVIOUS
              </Button>

              {/* Progress Indicator */}
              <div
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em'
                }}
              >
                CHAPTER {readingChapterIndex + 1} OF {chapters.length}
              </div>

              {/* NEXT → or MORE CHAPTERS COMING SOON */}
              {readingChapterIndex < chapters.length - 1 ? (
                <Button
                  variant="gold"
                  size="md"
                  onClick={handleNextInModal}
                  id="modal-next-btn"
                >
                  <span>NEXT →</span>
                </Button>
              ) : (
                <div
                  id="modal-coming-soon-indicator"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 1rem',
                    color: '#fb7185',
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    cursor: 'not-allowed'
                  }}
                  title="Chapter 5 and beyond are coming soon in future updates"
                >
                  <Lock size={15} />
                  <span>MORE CHAPTERS COMING SOON</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Story
