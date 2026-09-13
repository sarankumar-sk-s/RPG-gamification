import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  Button,
  Card,
  Badge,
  ProgressBar,
  XPBar,
  StatCard,
  SectionTitle,
  LevelUpModal,
  CompleteQuestModal
} from '../components'
import {
  Sword,
  Shield,
  Zap,
  Target,
  Trophy,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  Layers,
  Coins,
  Compass,
  Eye,
  Home,
  Check,
  Plus,
  Clock,
  Activity,
  Award,
  ChevronRight,
  User,
  HeartPulse,
  Brain,
  Dumbbell,
  Compass as CompassIcon,
  FlameKindling,
  Trash2
} from 'lucide-react'

// Background assets
import panoramaBg from '../assets/rpg_panorama_bg.jpg'
import townBg from '../assets/town_quest_bg.png'
import wallSkyBg from '../assets/wall_sky_bg.png'

import { useAuth } from '../context/AuthContext'
import { missionsApi, tasksApi, activityApi, authApi } from '../services/api'
import { AuthModal } from '../components/AuthModal'

// Initial Mock Data
import {
  initialPlayerData,
  initialAttributes,
  initialQuests,
  initialRecentActivity
} from '../data/mockDashboardData'
import { checkAndUpdateDailyStreak, getCurrentStreak } from '../utils/streakManager'

export function Dashboard() {
  const navigate = useNavigate()
  const { user, character, isAuthenticated, refreshProfile } = useAuth()

  // State Management
  const [player, setPlayer] = useState(initialPlayerData)
  const [attributes, setAttributes] = useState(initialAttributes)
  const [quests, setQuests] = useState(initialQuests)
  const [recentActivity, setRecentActivity] = useState(initialRecentActivity)
  const [activeNav, setActiveNav] = useState('missions')
  const [activeScene, setActiveScene] = useState('panorama')
  const [toastMessage, setToastMessage] = useState(null)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)
  const [completingQuest, setCompletingQuest] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [isLoadingBackend, setIsLoadingBackend] = useState(false)

  const scenes = {
    panorama: {
      name: 'Panoramic Citadel',
      image: panoramaBg
    },
    town: {
      name: 'Guild Town',
      image: townBg
    },
    wall: {
      name: 'Titan Sky Wall',
      image: wallSkyBg
    }
  }

  // Show floating reward notification toast
  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3800)
  }

  // Check & Update Daily 24h Website Visit Streak
  React.useEffect(() => {
    const result = checkAndUpdateDailyStreak()
    setPlayer((prev) => ({
      ...prev,
      streak: result.streak
    }))
    if (result.isNewDay && result.message) {
      triggerToast(result.message)
    }
  }, [])

  // Sync Live Backend Character Stats when available
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

      // Sync 5 Attributes
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

      // Fetch live activity feed
      activityApi.getRecent(10)
        .then((items) => {
          if (items && items.length > 0) {
            setRecentActivity(items.map((act) => ({
              id: `act-${act.id}`,
              title: act.task_title ? `Completed ${act.task_title}` : 'Completed Quest',
              xp: act.xp_earned,
              gold: act.gold_earned,
              timestamp: act.completed_date || 'Today',
              category: 'INTELLECT',
              icon: 'CheckCircle2'
            })))
          }
        })
        .catch(() => {})

      // Fetch user missions & tasks for Today's Quests
      missionsApi.list()
        .then(async (userMissions) => {
          if (userMissions && userMissions.length > 0) {
            const savedCompletions = JSON.parse(localStorage.getItem('life_rpg_completed_quests_map') || '{}')
            const now = Date.now()
            const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

            const allBackendTasks = []
            for (const m of userMissions) {
              const mTasks = await tasksApi.listForMission(m.id).catch(() => [])
              if (mTasks && mTasks.length > 0) {
                mTasks.forEach(t => {
                  const saved = savedCompletions[t.id]
                  const isCompleted = !!saved
                  const completedAt = saved?.completedAt || null
                  const isExpired = isCompleted && completedAt && (now - completedAt) >= TWENTY_FOUR_HOURS

                  if (!isExpired) {
                    allBackendTasks.push({
                      id: t.id,
                      title: t.title,
                      description: t.description || `Tactical directive for ${m.title}`,
                      category: t.category,
                      difficulty: t.difficulty,
                      xpReward: t.xp_reward,
                      goldReward: t.gold_reward,
                      attributeGain: { id: t.category.toLowerCase(), amount: 1 },
                      completed: isCompleted,
                      completedAt: completedAt,
                      isBackendTask: true
                    })
                  }
                })
              }
            }
            if (allBackendTasks.length > 0) {
              setQuests(allBackendTasks)
            }
          }
        })
        .catch(() => {})
    }
  }, [character, user])

  // Periodic 24-Hour Expiration Check
  React.useEffect(() => {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000
    const interval = setInterval(() => {
      const now = Date.now()
      setQuests((prev) =>
        prev.filter((q) => {
          if (!q.completed || !q.completedAt) return true
          return (now - q.completedAt) < TWENTY_FOUR_HOURS
        })
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Submit quest directly to backend
  const handleBackendQuestSubmit = async ({ questId, reflection, evidenceImage, completionDate }) => {
    // If quest has numeric ID or is a backend task, call API
    if (typeof questId === 'number' || !isNaN(Number(questId))) {
      try {
        const response = await tasksApi.completeTask(questId, {
          what_you_did: reflection,
          evidence_image_url: evidenceImage
        })

        // Refresh live character profile
        await refreshProfile().catch(() => {})
        return response
      } catch (err) {
        console.warn('Backend task completion notice:', err)
        if (err?.message?.toLowerCase().includes('already completed') || err?.status === 400) {
          throw new Error('This quest was already completed in the Citadel database today.')
        }
        throw new Error(err.message || 'Error communicating with Citadel server.')
      }
    }
    return null
  }

  // Handle Quest Completion Confirmation from Modal
  const handleCompleteQuestFromModal = (completionData) => {
    const quest = quests.find((q) => q.id === completionData.questId)
    if (!quest) return

    const now = Date.now()

    // 1. Format user-selected completion date
    let formattedDate = 'Today'
    if (completionData.completionDate) {
      try {
        formattedDate = new Date(completionData.completionDate + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      } catch {
        formattedDate = completionData.completionDate
      }
    }

    // 2. Persist completion in localStorage map
    try {
      const savedCompletions = JSON.parse(localStorage.getItem('life_rpg_completed_quests_map') || '{}')
      savedCompletions[completionData.questId] = {
        completedAt: now,
        completionDate: formattedDate
      }
      localStorage.setItem('life_rpg_completed_quests_map', JSON.stringify(savedCompletions))
    } catch (e) {
      console.warn('Could not save completion map:', e)
    }

    // 3. Mark quest as completed in state (turns green, expires in 24h)
    setQuests((prev) =>
      prev.map((q) =>
        q.id === completionData.questId
          ? {
              ...q,
              completed: true,
              completedAt: now,
              completionDate: formattedDate
            }
          : q
      )
    )

    // 4. Add to Recent Activity feed
    const newActivityItem = {
      id: `act-${now}`,
      title: `Completed ${quest.title}`,
      xp: completionData.xp,
      gold: completionData.gold,
      timestamp: formattedDate,
      category: quest.category || 'INTELLECT',
      icon: 'CheckCircle2'
    }
    setRecentActivity((prev) => [newActivityItem, ...prev])

    if (completionData.leveledUp) {
      triggerToast(`⭐ LEVEL UP! Verified by Citadel Telemetry!`)
    } else {
      triggerToast(`⚔️ Quest Completed on ${formattedDate}! +${completionData.xp} XP | +${completionData.gold} Gold (Active for 24h)`)
    }
  }

  // Handle Delete Quest (Local & Backend)
  const handleDeleteQuest = async (questId) => {
    const questToDelete = quests.find((q) => q.id === questId)
    if (questToDelete?.isBackendTask || typeof questId === 'number' || !isNaN(Number(questId))) {
      try {
        await tasksApi.delete(questId)
      } catch (err) {
        console.warn('Backend delete failed, removing locally:', err)
      }
    }
    setQuests((prev) => prev.filter((q) => q.id !== questId))
    triggerToast(`🗑️ Quest deleted: "${questToDelete?.title || 'Tactical Directive'}"`)
  }

  // Attribute category icons lookup
  const getCategoryIcon = (category) => {
    switch (category?.toUpperCase()) {
      case 'INTELLECT':
        return Brain
      case 'STRENGTH':
        return Dumbbell
      case 'VITALITY':
        return HeartPulse
      case 'WISDOM':
        return CompassIcon
      case 'DISCIPLINE':
        return FlameKindling
      default:
        return Target
    }
  }

  // Category Badge Colors
  const getCategoryBadgeVariant = (category) => {
    switch (category?.toUpperCase()) {
      case 'INTELLECT':
        return 'cyan'
      case 'STRENGTH':
        return 'red'
      case 'VITALITY':
        return 'green'
      case 'WISDOM':
        return 'purple'
      case 'DISCIPLINE':
        return 'gold'
      default:
        return 'neutral'
    }
  }

  // Filtered Quests
  const filteredQuests = filterCategory === 'ALL'
    ? quests
    : quests.filter((q) => q.category === filterCategory)

  const completedCount = quests.filter((q) => q.completed).length

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundImage: `
          linear-gradient(180deg, rgba(6, 9, 16, 0.55) 0%, rgba(5, 7, 13, 0.75) 45%, rgba(4, 6, 10, 0.94) 100%),
          url(${scenes[activeScene].image})
        `,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center top',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.5s ease-in-out'
      }}
    >
      {/* Background Ambient Glow Viewport */}
      <div className="game-viewport-overlay" />

      {/* Floating Level Up / Reward Toast Notification */}
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
            fontSize: '1rem',
            fontWeight: 700,
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <Sparkles size={20} color="#fde047" />
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
        activeLink="dashboard"
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
            navigate('/character')
          } else if (nav === 'shop') {
            navigate('/shop')
          } else if (nav === 'inventory') {
            navigate('/inventory')
          } else {
            navigate('/dashboard')
          }
        }}
        onProfileClick={() => {
          navigate('/character')
        }}
      />

      {/* MAIN HUB BODY */}
      <main style={{ flex: 1, paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
        
        {/* MAIN HERO SECTION */}
        <section
          style={{
            position: 'relative',
            padding: '2.5rem 0 2rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'linear-gradient(180deg, rgba(8, 12, 22, 0.7) 0%, rgba(6, 8, 14, 0.4) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <div className="container-custom">
            {/* Top Scene Chooser & Breadcrumbs */}
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
              {/* Back to Story & Active District */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.3rem 0.8rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold-primary)'
                    e.currentTarget.style.color = 'var(--text-gold)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  <Home size={14} />
                  <span>Story Intro</span>
                </button>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase'
                  }}
                >
                  <span>// DISTRICT: CITADEL SECTOR 7</span>
                </div>
              </div>

              {/* Scenery Selector */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(10, 14, 24, 0.75)',
                  border: '1px solid var(--border-highlight)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.2rem 0.5rem'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
                  <Eye size={13} /> ATMOSPHERE:
                </span>
                {Object.keys(scenes).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveScene(key)}
                    style={{
                      background: activeScene === key ? 'var(--gold-primary)' : 'transparent',
                      color: activeScene === key ? '#000' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-title)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {scenes[key].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Card Banner */}
            <div
              className="tactical-border"
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 2.25rem',
                background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.9) 0%, rgba(8, 12, 22, 0.95) 100%)',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.75), 0 0 25px rgba(245, 158, 11, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.75rem'
              }}
            >
              {/* Top Banner Row: Greeting, Level & Stat Chips */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.5rem'
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      marginBottom: '0.25rem'
                    }}
                  >
                    OPERATIVE STATUS: ONLINE
                  </div>
                  <h1
                    style={{
                      fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                      fontFamily: 'var(--font-title)',
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      lineHeight: 1.1,
                      margin: 0
                    }}
                  >
                    WELCOME BACK, <span className="text-gradient-gold">{player.name}</span>
                  </h1>
                </div>

                {/* Hero Stat Badges (Level, Streak, Gold) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.85rem'
                  }}
                >
                  {/* LEVEL 5 BADGE */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1.5px solid var(--gold-primary)',
                      boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <Trophy size={20} color="var(--gold-light)" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-title)', fontWeight: 700, textTransform: 'uppercase' }}>
                        RANK TIER
                      </div>
                      <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--text-gold)', lineHeight: 1 }}>
                        LEVEL {player.level}
                      </div>
                    </div>
                  </div>

                  {/* STREAK 7 DAYS */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(244, 63, 94, 0.15)',
                      border: '1.5px solid var(--red-accent)',
                      boxShadow: '0 0 20px rgba(244, 63, 94, 0.25)'
                    }}
                  >
                    <Flame size={22} color="#f43f5e" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-title)', fontWeight: 700, textTransform: 'uppercase' }}>
                        MOMENTUM
                      </div>
                      <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#f87171', lineHeight: 1 }}>
                        STREAK 🔥 {player.streak} DAYS
                      </div>
                    </div>
                  </div>

                  {/* GOLD 250 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(253, 224, 71, 0.1)',
                      border: '1.5px solid var(--gold-light)',
                      boxShadow: '0 0 20px rgba(253, 224, 71, 0.2)'
                    }}
                  >
                    <Coins size={22} color="#fde047" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-title)', fontWeight: 700, textTransform: 'uppercase' }}>
                        CITADEL TREASURY
                      </div>
                      <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#fde047', lineHeight: 1 }}>
                        GOLD {player.gold}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* XP PROGRESS BAR SECTION */}
              <div>
                <XPBar
                  currentXP={player.currentXP}
                  xpRequired={player.xpRequired}
                  level={player.level}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ATTRIBUTE SUMMARY SECTION */}
        <section style={{ padding: '3rem 0 1.5rem' }}>
          <div className="container-custom">
            <SectionTitle
              kicker="// CORE ATTRIBUTE PROGRESSION"
              title="CHARACTER"
              highlight="ATTRIBUTES"
              subtitle="Real-world mastery quantified across 5 foundational pillars of mental, physical, and tactical performance."
              action={
                <Badge variant="gold" pulse={true} icon={Sparkles}>
                  5 Core Stats Active
                </Badge>
              }
            />

            {/* Responsive Grid for StatCards & Progress Bars */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {attributes.map((attr) => {
                const CategoryIcon = getCategoryIcon(attr.name)
                return (
                  <div
                    key={attr.id}
                    className="glass-panel"
                    style={{
                      padding: '1.35rem',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Header: Icon, Category Name, Gain Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: 'var(--radius-sm)',
                            background: `rgba(255, 255, 255, 0.06)`,
                            border: `1px solid ${attr.accentColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: attr.accentColor
                          }}
                        >
                          <CategoryIcon size={18} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontFamily: 'var(--font-title)',
                              fontSize: '1.05rem',
                              fontWeight: 800,
                              letterSpacing: '0.06em',
                              color: 'var(--text-main)'
                            }}
                          >
                            {attr.name}
                          </div>
                        </div>
                      </div>

                      {attr.recentGain > 0 && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-title)',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(52, 211, 153, 0.15)',
                            border: '1px solid rgba(52, 211, 153, 0.4)',
                            color: '#34d399'
                          }}
                        >
                          +{attr.recentGain} TODAY
                        </span>
                      )}
                    </div>

                    {/* Value Big Display */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '2.2rem',
                          fontFamily: 'var(--font-title)',
                          fontWeight: 900,
                          color: attr.accentColor,
                          lineHeight: 1
                        }}
                      >
                        {attr.value}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
                        / {attr.maxValue} TIER CAP
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                      {attr.description}
                    </p>

                    {/* Stat Progress Bar */}
                    <ProgressBar
                      value={attr.value}
                      max={attr.maxValue}
                      variant={attr.color}
                      size="sm"
                      label={`${attr.progress}% Mastery`}
                      showLabel={true}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* TWO-COLUMN LAYOUT: TODAY'S QUESTS + RECENT ACTIVITY */}
        <section style={{ padding: '2rem 0 3rem' }}>
          <div className="container-custom">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
                gap: '2rem',
                alignItems: 'start'
              }}
              className="dashboard-main-grid"
            >
              {/* LEFT COLUMN: TODAY'S QUESTS */}
              <div>
                {/* Header with Filter Pills */}
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
                  <SectionTitle
                    kicker="// ACTIVE COMBAT DIRECTIVES"
                    title="TODAY'S"
                    highlight="QUESTS"
                    subtitle={`${completedCount} of ${quests.length} completed today`}
                  />

                  {/* Filter Pills */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      background: 'rgba(10, 14, 24, 0.75)',
                      padding: '0.3rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {['ALL', 'INTELLECT', 'STRENGTH', 'VITALITY', 'WISDOM', 'DISCIPLINE'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        style={{
                          background: filterCategory === cat ? 'var(--gold-primary)' : 'transparent',
                          color: filterCategory === cat ? '#000' : 'var(--text-muted)',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.3rem 0.65rem',
                          fontFamily: 'var(--font-title)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quest Cards List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {filteredQuests.length === 0 ? (
                    <div
                      style={{
                        background: 'rgba(15, 23, 42, 0.65)',
                        border: '1px dashed var(--border-medium)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '3rem 2rem',
                        textAlign: 'center'
                      }}
                    >
                      <Target size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.85rem' }} />
                      <h4
                        style={{
                          fontFamily: 'var(--font-title)',
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: '#ffffff',
                          marginBottom: '0.4rem',
                          letterSpacing: '0.04em'
                        }}
                      >
                        NO ACTIVE QUESTS
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                        {filterCategory === 'ALL'
                          ? 'All today\'s tactical quests have been cleared or removed.'
                          : `No quests found in the ${filterCategory} category.`}
                      </p>
                    </div>
                  ) : (
                    filteredQuests.map((quest) => {
                      const CategoryIcon = getCategoryIcon(quest.category)
                      const badgeVariant = getCategoryBadgeVariant(quest.category)
                      const isDone = quest.completed

                      return (
                        <div
                          key={quest.id}
                          className="glass-panel"
                          style={{
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            border: isDone ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                            background: isDone
                              ? 'linear-gradient(135deg, rgba(6, 44, 28, 0.92) 0%, rgba(4, 26, 17, 0.98) 100%)'
                              : 'var(--bg-card)',
                            boxShadow: isDone
                              ? '0 0 30px rgba(16, 185, 129, 0.3), 0 8px 25px rgba(0, 0, 0, 0.75)'
                              : '0 8px 24px rgba(0, 0, 0, 0.5)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {/* Top Card Meta: Category, Difficulty, Rewards */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '0.75rem',
                              marginBottom: '0.85rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Badge variant={isDone ? 'green' : badgeVariant} icon={CategoryIcon}>
                                {quest.category}
                              </Badge>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontFamily: 'var(--font-title)',
                                  fontWeight: 700,
                                  color: isDone ? '#34d399' : quest.difficulty === 'Epic' ? '#f43f5e' : quest.difficulty === 'Hard' ? '#f59e0b' : 'var(--text-dim)',
                                  textTransform: 'uppercase'
                                }}
                              >
                                • {quest.difficulty} DIFFICULTY
                              </span>
                            </div>

                            {/* XP & Gold Reward Pill */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <span
                                style={{
                                  fontSize: '0.85rem',
                                  color: isDone ? '#34d399' : 'var(--cyan-accent)',
                                  fontFamily: 'var(--font-title)',
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <Sparkles size={14} /> +{quest.xpReward} XP
                              </span>
                              <span
                                style={{
                                  fontSize: '0.85rem',
                                  color: isDone ? '#fbbf24' : 'var(--text-gold)',
                                  fontFamily: 'var(--font-title)',
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <Coins size={14} /> +{quest.goldReward} GOLD
                              </span>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <h3
                            style={{
                              fontSize: '1.25rem',
                              fontFamily: 'var(--font-title)',
                              fontWeight: 800,
                              letterSpacing: '0.04em',
                              margin: '0 0 0.5rem',
                              textDecoration: isDone ? 'line-through' : 'none',
                              color: isDone ? '#34d399' : 'var(--text-main)'
                            }}
                          >
                            {quest.title}
                          </h3>

                          <p
                            style={{
                              fontSize: '0.92rem',
                              color: isDone ? 'rgba(255, 255, 255, 0.75)' : 'var(--text-secondary)',
                              lineHeight: 1.5,
                              margin: '0 0 1.25rem'
                            }}
                          >
                            {quest.description}
                          </p>

                          {/* Card Footer: Complete Button & Delete Button */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderTop: isDone ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid var(--border-subtle)',
                              paddingTop: '1rem',
                              flexWrap: 'wrap',
                              gap: '0.75rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  color: isDone ? '#34d399' : 'var(--text-dim)',
                                  fontFamily: 'var(--font-title)',
                                  fontWeight: 700
                                }}
                              >
                                STATUS:
                              </span>
                              {isDone ? (
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    fontFamily: 'var(--font-title)',
                                    fontWeight: 800,
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    border: '1px solid #10b981',
                                    color: '#34d399',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.35)'
                                  }}
                                >
                                  <CheckCircle2 size={13} color="#34d399" /> COMPLETED (EXPIRES IN 24H)
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: '0.78rem',
                                    color: 'var(--text-dim)',
                                    fontFamily: 'var(--font-title)',
                                    fontWeight: 600
                                  }}
                                >
                                  READY TO CLAIM
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <button
                                type="button"
                                onClick={() => handleDeleteQuest(quest.id)}
                                title="Delete Quest"
                                id={`delete-quest-${quest.id}`}
                                style={{
                                  background: 'rgba(244, 63, 94, 0.1)',
                                  border: '1px solid rgba(244, 63, 94, 0.35)',
                                  borderRadius: 'var(--radius-sm)',
                                  color: '#fb7185',
                                  padding: '0.45rem 0.85rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-title)',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  transition: 'all 0.2s',
                                  lineHeight: 1
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'rgba(244, 63, 94, 0.25)'
                                  e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.65)'
                                  e.currentTarget.style.color = '#ffffff'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'
                                  e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.35)'
                                  e.currentTarget.style.color = '#fb7185'
                                }}
                              >
                                <Trash2 size={14} />
                                <span>DELETE</span>
                              </button>

                              {isDone ? (
                                <button
                                  type="button"
                                  disabled
                                  id={`completed-quest-${quest.id}`}
                                  style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    border: '1.5px solid #34d399',
                                    borderRadius: 'var(--radius-md)',
                                    color: '#ffffff',
                                    padding: '0.5rem 1.25rem',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-title)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
                                    cursor: 'default',
                                    letterSpacing: '0.04em'
                                  }}
                                >
                                  <CheckCircle2 size={16} />
                                  <span>COMPLETED</span>
                                </button>
                              ) : (
                                <Button
                                  variant="gold"
                                  size="sm"
                                  icon={CheckCircle2}
                                  onClick={() => setCompletingQuest(quest)}
                                  id={`complete-quest-${quest.id}`}
                                >
                                  Complete Quest
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: RECENT ACTIVITY */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <SectionTitle
                  kicker="// AUDIT TRAIL"
                  title="RECENT"
                  highlight="ACTIVITY"
                  subtitle="Chronological log of completed operations and progression"
                />

                <div
                  className="tactical-border"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    background: 'rgba(10, 14, 25, 0.88)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {recentActivity.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(245, 158, 11, 0.12)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--gold-light)',
                          flexShrink: 0
                        }}
                      >
                        <CheckCircle2 size={16} color="var(--gold-primary)" />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            lineHeight: 1.3,
                            marginBottom: '0.25rem'
                          }}
                        >
                          {act.title}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.6rem',
                            fontSize: '0.78rem',
                            fontFamily: 'var(--font-title)',
                            fontWeight: 700
                          }}
                        >
                          <span style={{ color: 'var(--cyan-accent)' }}>+{act.xp} XP</span>
                          <span style={{ color: 'var(--text-gold)' }}>+{act.gold} Gold</span>
                          <span style={{ color: 'var(--text-dim)', marginLeft: 'auto' }}>
                            {act.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Quick Action: Level Up Preview Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Trophy}
                    onClick={() => setIsLevelUpModalOpen(true)}
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    Preview Level Up Modal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(6, 8, 14, 0.95)',
          padding: '1.75rem 0',
          marginTop: 'auto'
        }}
      >
        <div
          className="container-custom"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sword size={18} color="#f59e0b" />
            <span
              style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: '1.1rem' }}
              className="text-gradient-gold"
            >
              LIFE RPG
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: 0 }}>
            Command Hub v1.0 • Reality Gamification Framework
          </p>
        </div>
      </footer>

      {/* REUSABLE LEVEL UP MODAL */}
      <LevelUpModal
        isOpen={isLevelUpModalOpen}
        level={player.level + (player.currentXP >= player.xpRequired ? 1 : 0)}
        onClose={() => setIsLevelUpModalOpen(false)}
      />

      {/* CINEMATIC COMPLETE QUEST MODAL & REWARD EXPERIENCE */}
      <CompleteQuestModal
        isOpen={!!completingQuest}
        onClose={() => setCompletingQuest(null)}
        quest={completingQuest}
        player={player}
        onSubmitQuest={handleBackendQuestSubmit}
        onConfirmCompletion={handleCompleteQuestFromModal}
      />

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => triggerToast('Operator Authenticated with FastAPI Service!')}
      />

      {/* Embedded CSS for main grid responsiveness */}
      <style>{`
        @media (max-width: 980px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
