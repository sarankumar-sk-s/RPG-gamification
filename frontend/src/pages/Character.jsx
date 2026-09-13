import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  Button,
  Badge,
  ProgressBar,
  XPBar,
  SectionTitle
} from '../components'
import {
  User,
  Shield,
  Sword,
  Sparkles,
  Coins,
  Flame,
  Trophy,
  Brain,
  Dumbbell,
  HeartPulse,
  Compass,
  FlameKindling,
  Award,
  Zap,
  Target,
  Layers,
  Crown,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Activity,
  Edit3,
  Key,
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

// Assets & Mock Data
import heroAvatarImg from '../assets/hero_avatar.jpg'
import panoramaBg from '../assets/rpg_panorama_bg.jpg'
import { initialPlayerData, initialAttributes } from '../data/mockDashboardData'
import { getCurrentStreak } from '../utils/streakManager'

export function Character() {
  const navigate = useNavigate()
  const { user, character } = useAuth()
  const [player, setPlayer] = useState(initialPlayerData)
  const [attributes, setAttributes] = useState(initialAttributes)
  const [toastMessage, setToastMessage] = useState(null)
  const [selectedStat, setSelectedStat] = useState(initialAttributes[0])

  // Identity & Credentials Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [editError, setEditError] = useState('')

  // Sync Live Character Stats
  React.useEffect(() => {
    if (character && user) {
      const charLevel = character.level || 1
      const charXP = character.xp || 0
      const charRequired = charLevel * 100
      const currentStreak = character.streak || getCurrentStreak()
      const savedCustomName = localStorage.getItem('life_rpg_custom_name')

      const initialName = savedCustomName || (user.email ? user.email.split('@')[0].toUpperCase() : 'VANGUARD')

      setPlayer({
        name: initialName,
        title: charLevel >= 10 ? 'Ascendant Architect' : charLevel >= 5 ? 'Citadel Vanguard' : 'Initiate Operative',
        level: charLevel,
        currentXP: charXP,
        xpRequired: charRequired,
        gold: character.gold ?? 0,
        streak: currentStreak,
        rank: charLevel >= 5 ? 'A-Tier Operative' : 'Recruit',
        avatarUrl: null
      })
      setEditName(initialName)

      setAttributes([
        {
          id: 'intellect',
          name: 'INTELLECT',
          category: 'intellect',
          value: character.intellect ?? 10,
          maxValue: 30,
          progress: Math.min(100, Math.round(((character.intellect ?? 10) / 30) * 100)),
          color: 'cyan',
          accentColor: '#38bdf8',
          recentGain: 0,
          description: 'Logic, Coding, Technical Strategy & Analysis'
        },
        {
          id: 'strength',
          name: 'STRENGTH',
          category: 'strength',
          value: character.strength ?? 10,
          maxValue: 30,
          progress: Math.min(100, Math.round(((character.strength ?? 10) / 30) * 100)),
          color: 'red',
          accentColor: '#f43f5e',
          recentGain: 0,
          description: 'Physical Power, Resistance Training & Athletics'
        },
        {
          id: 'vitality',
          name: 'VITALITY',
          category: 'vitality',
          value: character.vitality ?? 10,
          maxValue: 30,
          progress: Math.min(100, Math.round(((character.vitality ?? 10) / 30) * 100)),
          color: 'green',
          accentColor: '#34d399',
          recentGain: 0,
          description: 'Endurance, Recovery, Nutrition & Energy'
        },
        {
          id: 'wisdom',
          name: 'WISDOM',
          category: 'wisdom',
          value: character.wisdom ?? 10,
          maxValue: 30,
          progress: Math.min(100, Math.round(((character.wisdom ?? 10) / 30) * 100)),
          color: 'purple',
          accentColor: '#c084fc',
          recentGain: 0,
          description: 'Mental Clarity, Mindfulness, Focus & Philosophy'
        },
        {
          id: 'discipline',
          name: 'DISCIPLINE',
          category: 'discipline',
          value: character.discipline ?? 10,
          maxValue: 30,
          progress: Math.min(100, Math.round(((character.discipline ?? 10) / 30) * 100)),
          color: 'gold',
          accentColor: '#f59e0b',
          recentGain: 0,
          description: 'Habit Consistency, Willpower & Streak Stamina'
        }
      ])
    }
  }, [character, user])

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  // Handle Save Operative Name & Password
  const handleSaveCredentials = (e) => {
    e.preventDefault()
    setEditError('')

    if (!editName.trim()) {
      setEditError('Operative Call-Sign / Name cannot be empty.')
      return
    }

    if (editPassword) {
      if (editPassword.length < 6) {
        setEditError('New security password must be at least 6 characters.')
        return
      }
      if (editPassword !== confirmPassword) {
        setEditError('Passwords do not match. Please verify.')
        return
      }
      localStorage.setItem('life_rpg_custom_password', editPassword)
    }

    const formattedName = editName.trim().toUpperCase()
    localStorage.setItem('life_rpg_custom_name', formattedName)

    setPlayer((prev) => ({
      ...prev,
      name: formattedName
    }))

    setIsEditModalOpen(false)
    setEditPassword('')
    setConfirmPassword('')

    triggerToast(
      editPassword
        ? `🔒 Call-Sign updated to "${formattedName}" & Password successfully changed!`
        : `⚡ Operative Call-Sign updated to "${formattedName}"!`
    )
  }

  // Calculate total attribute power
  const totalStatPoints = attributes.reduce((sum, a) => sum + a.value, 0)
  const maxPossiblePoints = attributes.reduce((sum, a) => sum + a.maxValue, 0)
  const overallMasteryPercent = Math.round((totalStatPoints / maxPossiblePoints) * 100)

  const getCategoryIcon = (category) => {
    switch (category?.toUpperCase()) {
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
        return Sparkles
    }
  }

  const getStatTheme = (color) => {
    switch (color?.toLowerCase()) {
      case 'cyan':
        return { accent: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.4)' }
      case 'red':
        return { accent: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.4)' }
      case 'green':
        return { accent: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.4)' }
      case 'purple':
        return { accent: '#c084fc', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.4)' }
      case 'gold':
      default:
        return { accent: '#fbbf24', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.4)' }
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundImage: `
          linear-gradient(180deg, rgba(6, 9, 16, 0.65) 0%, rgba(5, 7, 13, 0.82) 45%, rgba(4, 6, 10, 0.98) 100%),
          url(${panoramaBg})
        `,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center top',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay */}
      <div className="game-viewport-overlay" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '85px',
            right: '24px',
            zIndex: 999,
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

      {/* TOP HUD NAVIGATION */}
      <Navbar
        level={player.level}
        currentXP={player.currentXP}
        xpRequired={player.xpRequired}
        gold={player.gold}
        streak={player.streak}
        activeLink="character"
        onNavigate={(nav) => {
          if (nav === 'landing') {
            navigate('/')
          } else if (nav === 'dashboard') {
            navigate('/dashboard')
          } else if (nav === 'missions') {
            navigate('/missions')
          } else if (nav === 'story') {
            navigate('/story')
          } else if (nav === 'world') {
            navigate('/world')
          } else if (nav === 'character') {
            // current
          } else if (nav === 'shop') {
            navigate('/shop')
          } else if (nav === 'inventory') {
            navigate('/inventory')
          } else {
            navigate('/dashboard')
          }
        }}
        onProfileClick={() => navigate('/character')}
      />

      {/* MAIN CHARACTER PROFILE BODY */}
      <main style={{ flex: 1, padding: '2.5rem 0 5rem', position: 'relative', zIndex: 1 }}>
        <div className="container-custom">
          {/* Header Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: 'var(--text-gold)',
                  textTransform: 'uppercase'
                }}>
                  Operator Dossier
                </span>
                <span style={{ width: '30px', height: '1px', background: 'var(--gold-primary)' }} />
              </div>

              <h1 style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                margin: 0
              }} className="text-gradient-gold">
                CHARACTER PROFILE
              </h1>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button
                variant="outline"
                size="md"
                icon={Sword}
                onClick={() => navigate('/missions')}
              >
                Go to Missions
              </Button>
              <Button
                variant="gold"
                size="md"
                icon={Crown}
                onClick={() => triggerToast('Character Title: Citadel Vanguard - Active Multiplier x1.25')}
              >
                Vanguard Perks
              </Button>
            </div>
          </div>

          {/* TWO-COLUMN CINEMATIC PROFILE GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 380px) minmax(0, 1fr)',
            gap: '2.5rem',
            alignItems: 'start'
          }} className="character-grid-layout">
            {/* COLUMN 1: VISUAL AVATAR PORTRAIT & CORE VITALS */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* Avatar Frame Card */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(20, 28, 45, 0.95) 0%, rgba(10, 14, 24, 0.98) 100%)',
                border: '1.5px solid var(--gold-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                boxShadow: '0 0 40px rgba(245, 158, 11, 0.25), 0 15px 35px rgba(0, 0, 0, 0.8)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Decorative Top Rune Line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #38bdf8, #f59e0b, #f43f5e)'
                }} />

                {/* Avatar Image Container */}
                <div style={{
                  width: '100%',
                  maxWidth: '280px',
                  aspectRatio: '1 / 1',
                  margin: '0.5rem auto 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid rgba(56, 189, 248, 0.5)',
                  boxShadow: '0 0 30px rgba(56, 189, 248, 0.35)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img
                    src={heroAvatarImg}
                    alt="Player Avatar Portrait"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  {/* Glowing Overlay Rank Crest */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    right: '10px',
                    background: 'rgba(10, 14, 24, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.4rem 0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: 'var(--text-gold)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      CITADEL VANGUARD
                    </span>
                    <Badge variant="gold" size="sm">
                      LVL {player.level}
                    </Badge>
                  </div>
                </div>

                {/* Player Identity */}
                <h2 style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  color: '#ffffff',
                  margin: '0 0 0.25rem'
                }}>
                  {player.name}
                </h2>
                <div style={{
                  fontSize: '0.88rem',
                  color: 'var(--cyan-light)',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem'
                }}>
                  {player.title} • {player.rank}
                </div>

                {/* Core Stats Row: Level & Gold */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 0.5rem'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-title)', fontWeight: 700, textTransform: 'uppercase' }}>
                      HERO LEVEL
                    </div>
                    <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--text-gold)' }}>
                      LVL {player.level}
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(253, 224, 71, 0.1)',
                    border: '1px solid rgba(253, 224, 71, 0.35)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 0.5rem'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-title)', fontWeight: 700, textTransform: 'uppercase' }}>
                      TREASURY GOLD
                    </div>
                    <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#fde047', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                      <Coins size={18} /> {player.gold}
                    </div>
                  </div>
                </div>

                {/* STREAK SECTION: CURRENT & LONGEST STREAK */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  textAlign: 'left'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fb7185', fontSize: '0.75rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      <Flame size={14} /> CURRENT STREAK
                    </div>
                    <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#ffffff' }}>
                      🔥 {player.streak} DAYS
                    </div>
                  </div>

                  <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24', fontSize: '0.75rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      <Trophy size={14} /> LONGEST STREAK
                    </div>
                    <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#fbbf24' }}>
                      🏆 14 DAYS
                    </div>
                  </div>
                </div>

                {/* EDIT CALL-SIGN & SECURITY BUTTON */}
                <div style={{ marginTop: '1.25rem' }}>
                  <Button
                    variant="outline"
                    size="md"
                    icon={Edit3}
                    onClick={() => {
                      setEditName(player.name)
                      setEditPassword('')
                      setConfirmPassword('')
                      setEditError('')
                      setIsEditModalOpen(true)
                    }}
                    id="edit-identity-credentials-btn"
                    style={{ width: '100%', borderColor: 'rgba(245, 158, 11, 0.5)', color: 'var(--gold-light)' }}
                  >
                    EDIT CALL-SIGN & PASSWORD
                  </Button>
                </div>
              </div>
            </div>

            {/* COLUMN 2: STATS, PROGRESSION & MASTERY SUMMARY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* XP PROGRESSION BAR CARD */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.9) 0%, rgba(10, 14, 24, 0.95) 100%)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} color="#38bdf8" />
                    <span style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: '1.1rem', color: '#ffffff', letterSpacing: '0.04em' }}>
                      EXPERIENCE PROGRESSION
                    </span>
                  </div>
                  <Badge variant="cyan" size="sm">
                    {Math.round((player.currentXP / player.xpRequired) * 100)}% TO LEVEL {player.level + 1}
                  </Badge>
                </div>

                <XPBar
                  currentXP={player.currentXP}
                  xpRequired={player.xpRequired}
                  level={player.level}
                />
              </div>

              {/* CORE ATTRIBUTES / STATS SECTION */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.9) 0%, rgba(10, 14, 24, 0.95) 100%)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '1.35rem',
                      fontWeight: 900,
                      color: '#ffffff',
                      letterSpacing: '0.04em',
                      margin: 0
                    }}>
                      CORE STATS & REALM PILLARS
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                      Mastery points accumulated through verified real-world quest execution
                    </p>
                  </div>

                  <span style={{
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800,
                    color: 'var(--text-gold)',
                    background: 'rgba(245, 158, 11, 0.12)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(245, 158, 11, 0.35)'
                  }}>
                    {totalStatPoints} / {maxPossiblePoints} TOTAL POINTS ({overallMasteryPercent}%)
                  </span>
                </div>

                {/* 5 RPG Stat Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {attributes.map((attr) => {
                    const CategoryIcon = getCategoryIcon(attr.name)
                    const theme = getStatTheme(attr.color)
                    const isSelected = selectedStat?.id === attr.id

                    return (
                      <div
                        key={attr.id}
                        onClick={() => setSelectedStat(attr)}
                        style={{
                          background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.65)',
                          border: isSelected ? `1.5px solid ${theme.accent}` : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.15rem 1.35rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? `0 0 20px ${theme.bg}` : 'none'
                        }}
                      >
                        {/* Header: Icon, Name, Value / Max */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.65rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: theme.bg,
                              border: `1px solid ${theme.border}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: theme.accent
                            }}>
                              <CategoryIcon size={18} />
                            </div>
                            <div>
                              <div style={{
                                fontFamily: 'var(--font-title)',
                                fontSize: '1.05rem',
                                fontWeight: 800,
                                letterSpacing: '0.04em',
                                color: '#ffffff'
                              }}>
                                {attr.name}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {attr.description}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              fontFamily: 'var(--font-title)',
                              fontSize: '1.3rem',
                              fontWeight: 900,
                              color: theme.accent
                            }}>
                              {attr.value} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {attr.maxValue}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                              +{attr.recentGain} Recent Gain
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <ProgressBar
                          progress={attr.progress}
                          color={attr.color}
                          height="8px"
                          animated={true}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* EDIT OPERATIVE CREDENTIALS MODAL */}
      {isEditModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(3, 7, 18, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              background: 'linear-gradient(180deg, #111827 0%, #0a0f1d 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.5)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.25)',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Amber Stripe */}
            <div
              style={{
                height: '4px',
                background: 'linear-gradient(90deg, #38bdf8, #f59e0b, #ef4444)',
                width: '100%'
              }}
            />

            {/* Header */}
            <div
              style={{
                padding: '1.5rem 1.75rem 1rem',
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
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fbbf24'
                  }}
                >
                  <Edit3 size={20} />
                </div>
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '1.3rem',
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      color: '#ffffff',
                      margin: 0
                    }}
                  >
                    EDIT OPERATIVE DOSSIER
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Update call-sign identity and security password
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
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

            {/* Form */}
            <form onSubmit={handleSaveCredentials} style={{ padding: '1.5rem 1.75rem' }}>
              {editError && (
                <div
                  style={{
                    marginBottom: '1.25rem',
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
                  <span>{editError}</span>
                </div>
              )}

              {/* Call-Sign / Name Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-gold)',
                    marginBottom: '0.45rem'
                  }}
                >
                  OPERATIVE CALL-SIGN / NAME *
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1.5px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem'
                  }}
                >
                  <User size={18} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    placeholder="Enter Operative Name"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--cyan-light)',
                    marginBottom: '0.45rem'
                  }}
                >
                  NEW SECURITY PASSWORD (OPTIONAL)
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1.5px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem'
                  }}
                >
                  <Lock size={18} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-body)',
                      width: '100%'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Input */}
              {editPassword && (
                <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.2s ease-out' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-title)',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--cyan-light)',
                      marginBottom: '0.45rem'
                    }}
                  >
                    CONFIRM NEW PASSWORD
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1.5px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <Key size={18} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#ffffff',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-body)',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  icon={Save}
                  id="save-identity-credentials-btn"
                >
                  SAVE CHANGES
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .character-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Character
