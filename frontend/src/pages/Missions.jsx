import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  Button,
  Badge,
  ProgressBar,
  MissionCard,
  QuestCard,
  CreateMissionModal,
  CreateQuestModal,
  ImportTasksModal,
  QuestCompletionModal,
  RewardModal,
  QuestHistory,
  AuthModal
} from '../components'
import {
  Globe,
  Shield,
  Plus,
  Sparkles,
  Coins,
  Flame,
  Search,
  CheckCircle2,
  Brain,
  Dumbbell,
  HeartPulse,
  Compass,
  FlameKindling,
  History,
  X,
  Target,
  Swords,
  Clock,
  Trash2,
  RotateCcw,
  Upload,
  Database,
  UserCheck
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { missionsApi, tasksApi } from '../services/api'

// Mock Data
import { demoWorldMissions, initialMyMissions } from '../data/mockMissionsData'
import { initialPlayerData } from '../data/mockDashboardData'
import { getCurrentStreak } from '../utils/streakManager'

// Background assets
import panoramaBg from '../assets/rpg_panorama_bg.jpg'
import townBg from '../assets/town_quest_bg.png'

export function Missions() {
  const navigate = useNavigate()
  const { user, character, isAuthenticated, refreshProfile } = useAuth()

  // State Management
  const [player, setPlayer] = useState(initialPlayerData)
  const [activeTab, setActiveTab] = useState('my') // 'my' or 'demo'
  const [demoMissions, setDemoMissions] = useState(demoWorldMissions)
  const [myMissions, setMyMissions] = useState(initialMyMissions)
  const [selectedMissionId, setSelectedMissionId] = useState(initialMyMissions[0]?.id || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [toastMessage, setToastMessage] = useState(null)
  const [isLoadingBackend, setIsLoadingBackend] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Modals state
  const [isCreateMissionOpen, setIsCreateMissionOpen] = useState(false)
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false)
  const [activeQuestForCompletion, setActiveQuestForCompletion] = useState(null)
  const [verifiedQuestForReward, setVerifiedQuestForReward] = useState(null)

  // Toast trigger
  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  // Synchronize Player HUD if authenticated
  React.useEffect(() => {
    if (character && user) {
      const charLevel = character.level || 1
      setPlayer((prev) => ({
        ...prev,
        name: user.email ? user.email.split('@')[0].toUpperCase() : 'VANGUARD',
        level: charLevel,
        currentXP: character.xp || 0,
        xpRequired: charLevel * 100,
        gold: character.gold ?? 0,
        streak: character.streak || getCurrentStreak()
      }))
    }
  }, [character, user])

  // Fetch Backend Missions & Tasks when authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingBackend(true)
      missionsApi.list()
        .then(async (backendMissions) => {
          if (Array.isArray(backendMissions)) {
            if (backendMissions.length === 0) {
              setMyMissions([])
              setSelectedMissionId(null)
            } else {
              const mappedMissions = []
              for (const bm of backendMissions) {
                const bmTasks = await tasksApi.listForMission(bm.id).catch(() => [])
                mappedMissions.push({
                  id: bm.id,
                  title: bm.title,
                  description: bm.description || 'Custom Tactical Campaign',
                  category: bmTasks?.[0]?.category?.toUpperCase() || 'INTELLECT',
                  difficulty: bm.difficulty?.toUpperCase() || 'MEDIUM',
                  categoryTheme: 'gold',
                  tasks: (bmTasks || []).map((t) => ({
                    id: t.id,
                    missionId: bm.id,
                    title: t.title,
                    description: t.description || 'Tactical directive',
                    target: t.description || 'Execute real-life task and submit evidence',
                    category: (t.category || 'INTELLECT').toUpperCase(),
                    difficulty: (t.difficulty || 'MEDIUM').toUpperCase(),
                    potentialXP: t.xp_reward,
                    potentialGold: t.gold_reward,
                    xpReward: t.xp_reward,
                    goldReward: t.gold_reward,
                    status: 'AVAILABLE',
                    completedAt: null,
                    explanation: '',
                    evidenceImage: null,
                    isBackendTask: true
                  })),
                  history: []
                })
              }
              setMyMissions(mappedMissions)
              if (mappedMissions.length > 0) {
                setSelectedMissionId(mappedMissions[0].id)
              }
            }
          }
        })
        .catch((err) => {
          console.warn('Backend missions load error, using local state:', err)
        })
        .finally(() => {
          setIsLoadingBackend(false)
        })
    }
  }, [isAuthenticated])

  // Active missions list based on current tab
  const currentMissions = activeTab === 'demo' ? demoMissions : myMissions

  // Filtered missions
  const filteredMissions = currentMissions.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory
    return matchesSearch && matchesCat
  })

  // Currently selected mission object
  const selectedMission =
    currentMissions.find((m) => m.id === selectedMissionId) ||
    (filteredMissions.length > 0 ? filteredMissions[0] : null)

  // Handlers for Mission Creation
  const handleCreateMission = async (newMission) => {
    if (isAuthenticated) {
      try {
        const created = await missionsApi.create({
          title: newMission.title,
          description: newMission.description,
          difficulty: newMission.difficulty
        })
        const formattedMission = {
          id: created.id,
          title: created.title,
          description: created.description || '',
          category: 'INTELLECT',
          difficulty: created.difficulty?.toUpperCase() || 'HARD',
          categoryTheme: 'gold',
          tasks: [],
          history: []
        }
        setMyMissions((prev) => [formattedMission, ...prev])
        setActiveTab('my')
        setSelectedMissionId(created.id)
        triggerToast(`Created Mission: ${created.title}!`)
        return
      } catch (err) {
        console.warn('Backend create mission failed, storing locally:', err)
      }
    }
    setMyMissions((prev) => [newMission, ...prev])
    setActiveTab('my')
    setSelectedMissionId(newMission.id)
    triggerToast(`Created Mission: ${newMission.title}!`)
  }

  // Delete Mission Handler
  const handleDeleteMission = async (missionId) => {
    if (typeof missionId === 'number' || !isNaN(Number(missionId))) {
      try {
        await missionsApi.delete(missionId)
      } catch (err) {
        console.warn('Backend delete mission error:', err)
      }
    }

    const updatedMy = myMissions.filter((m) => m.id !== missionId)
    const updatedDemo = demoMissions.filter((m) => m.id !== missionId)
    setMyMissions(updatedMy)
    setDemoMissions(updatedDemo)

    if (selectedMissionId === missionId) {
      const remaining = activeTab === 'demo' ? updatedDemo : updatedMy
      setSelectedMissionId(remaining.length > 0 ? remaining[0].id : null)
    }

    triggerToast('Mission deleted successfully.')
  }

  // Handlers for Adding Real-Life Quest
  const handleAddQuest = async (newQuest) => {
    const targetId = selectedMission?.id
    if (!targetId) return

    if (typeof targetId === 'number' || !isNaN(Number(targetId))) {
      try {
        const createdTask = await tasksApi.create(targetId, {
          title: newQuest.title,
          description: newQuest.target || newQuest.description,
          category: (newQuest.category || 'INTELLECT').toLowerCase(),
          difficulty: newQuest.difficulty,
          repeat_type: 'daily'
        })
        const formattedTask = {
          id: createdTask.id,
          missionId: targetId,
          title: createdTask.title,
          description: createdTask.description || newQuest.description,
          target: createdTask.description || newQuest.target,
          category: (createdTask.category || 'INTELLECT').toUpperCase(),
          difficulty: (createdTask.difficulty || 'MEDIUM').toUpperCase(),
          potentialXP: createdTask.xp_reward,
          potentialGold: createdTask.gold_reward,
          xpReward: createdTask.xp_reward,
          goldReward: createdTask.gold_reward,
          status: 'AVAILABLE',
          completedAt: null,
          explanation: '',
          evidenceImage: null,
          isBackendTask: true
        }

        const updateMissionList = (list) =>
          list.map((m) =>
            m.id === targetId ? { ...m, tasks: [formattedTask, ...(m.tasks || [])] } : m
          )

        setMyMissions((prev) => updateMissionList(prev))
        triggerToast(`⚔ Quest Added: "${formattedTask.title}"`)
        return
      } catch (err) {
        console.warn('Backend create task failed, storing locally:', err)
      }
    }

    const updateMissionList = (list) =>
      list.map((m) =>
        m.id === targetId ? { ...m, tasks: [newQuest, ...(m.tasks || [])] } : m
      )

    if (activeTab === 'demo') {
      setDemoMissions((prev) => updateMissionList(prev))
    } else {
      setMyMissions((prev) => updateMissionList(prev))
    }

    triggerToast(`⚔ Quest Added: "${newQuest.title}"`)
  }

  // Import Tasks State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  // Handle Import Tasks (Local & Backend)
  const handleImportTasks = async (importedTasksList) => {
    const targetId = selectedMission?.id
    if (!targetId || !importedTasksList || importedTasksList.length === 0) return

    if (typeof targetId === 'number' || !isNaN(Number(targetId))) {
      try {
        const payload = importedTasksList.map((t) => ({
          title: t.title,
          description: t.description || '',
          category: (t.category || 'INTELLECT').toLowerCase(),
          difficulty: t.difficulty || 'Medium',
          repeat_type: 'daily'
        }))

        const createdTasks = await tasksApi.importTasks(targetId, payload)
        if (createdTasks && createdTasks.length > 0) {
          const formatted = createdTasks.map((ct) => ({
            id: ct.id,
            missionId: targetId,
            title: ct.title,
            description: ct.description || 'Tactical directive',
            target: ct.description || 'Execute real-life task and submit evidence',
            category: (ct.category || 'INTELLECT').toUpperCase(),
            difficulty: (ct.difficulty || 'MEDIUM').toUpperCase(),
            potentialXP: ct.xp_reward,
            potentialGold: ct.gold_reward,
            xpReward: ct.xp_reward,
            goldReward: ct.gold_reward,
            status: 'AVAILABLE',
            completedAt: null,
            explanation: '',
            evidenceImage: null,
            isBackendTask: true
          }))

          const updateMissionList = (list) =>
            list.map((m) =>
              m.id === targetId ? { ...m, tasks: [...formatted, ...(m.tasks || [])] } : m
            )

          setMyMissions((prev) => updateMissionList(prev))
          triggerToast(`⚡ Successfully imported ${createdTasks.length} quests to mission!`)
          return
        }
      } catch (err) {
        console.warn('Backend import tasks failed, storing locally:', err)
        triggerToast(`Import error: ${err.message}`)
      }
    }

    const updateMissionList = (list) =>
      list.map((m) =>
        m.id === targetId ? { ...m, tasks: [...importedTasksList, ...(m.tasks || [])] } : m
      )

    if (activeTab === 'demo') {
      setDemoMissions((prev) => updateMissionList(prev))
    } else {
      setMyMissions((prev) => updateMissionList(prev))
    }

    triggerToast(`⚡ Imported ${importedTasksList.length} quests to mission!`)
  }

  // Handle Quest Submission -> Moves to PENDING VERIFICATION (NO XP/Gold awarded yet!)
  const handleSubmitForVerification = ({ questId, explanation, evidenceImage, completionDate }) => {
    const targetId = selectedMission?.id
    let dateFormatted = 'Today'
    if (completionDate) {
      try {
        dateFormatted = new Date(completionDate + 'T00:00:00').toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      } catch {
        dateFormatted = completionDate
      }
    }

    const updateTasks = (tasks = []) =>
      tasks.map((t) => {
        if (t.id === questId) {
          return {
            ...t,
            status: 'PENDING VERIFICATION',
            explanation,
            evidenceImage,
            completionDate,
            completedAt: dateFormatted
          }
        }
        return t
      })

    const updateMissionList = (list) =>
      list.map((m) =>
        m.id === targetId ? { ...m, tasks: updateTasks(m.tasks) } : m
      )

    if (activeTab === 'demo') {
      setDemoMissions((prev) => updateMissionList(prev))
    } else {
      setMyMissions((prev) => updateMissionList(prev))
    }

    triggerToast(`⏳ Quest submitted for verification (${dateFormatted})! Awaiting evaluation.`)
  }

  // Handle Mock Verification -> State becomes VERIFIED -> Triggers Reward Unlocking
  const handleMockVerifyQuest = async (quest) => {
    const targetId = selectedMission?.id
    const isBackend = quest.isBackendTask || typeof quest.id === 'number' || !isNaN(Number(quest.id))
    let backendResult = null

    if (isBackend) {
      try {
        backendResult = await tasksApi.completeTask(quest.id, {
          what_you_did: quest.explanation || 'Completed designated real-world objective.',
          evidence_image_url: quest.evidenceImage || null
        })

        // Refresh character profile with authoritative backend state
        await refreshProfile()
      } catch (err) {
        console.warn('Backend task completion error:', err)
        triggerToast(`✕ Verification Error: ${err.message}`)
        return
      }
    }

    const xp = backendResult?.xp_earned ?? (quest.potentialXP || quest.xpReward || 50)
    const gold = backendResult?.gold_earned ?? (quest.potentialGold || quest.goldReward || 20)
    const dateStr = quest.completedAt || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

    const updateTasks = (tasks = []) =>
      tasks.map((t) => (t.id === quest.id ? { ...t, status: 'VERIFIED' } : t))

    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      questName: quest.title,
      date: dateStr,
      status: 'VERIFIED',
      reward: `+${xp} XP +${gold} GOLD`,
      category: quest.category
    }

    const updateMissionList = (list) =>
      list.map((m) => {
        if (m.id === targetId) {
          return {
            ...m,
            tasks: updateTasks(m.tasks),
            history: [newHistoryItem, ...(m.history || [])]
          }
        }
        return m
      })

    if (activeTab === 'demo') {
      setDemoMissions((prev) => updateMissionList(prev))
    } else {
      setMyMissions((prev) => updateMissionList(prev))
    }

    // Open Reward Modal with backend authoritative rewards
    setVerifiedQuestForReward({
      ...quest,
      potentialXP: xp,
      potentialGold: gold,
      xpReward: xp,
      goldReward: gold,
      backendResult
    })
  }

  // Handle Mock Rejection
  const handleMockRejectQuest = (quest) => {
    const targetId = selectedMission?.id
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

    const updateTasks = (tasks = []) =>
      tasks.map((t) => (t.id === quest.id ? { ...t, status: 'REJECTED' } : t))

    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      questName: quest.title,
      date: dateStr,
      status: 'REJECTED',
      reward: 'Submission Rejected',
      category: quest.category
    }

    const updateMissionList = (list) =>
      list.map((m) => {
        if (m.id === targetId) {
          return {
            ...m,
            tasks: updateTasks(m.tasks),
            history: [newHistoryItem, ...(m.history || [])]
          }
        }
        return m
      })

    if (activeTab === 'demo') {
      setDemoMissions((prev) => updateMissionList(prev))
    } else {
      setMyMissions((prev) => updateMissionList(prev))
    }

    triggerToast(`✕ Quest submission rejected. Evidence insufficient.`)
  }

  // Handle Reset Status
  const handleResetQuestStatus = (questId) => {
    const targetId = selectedMission?.id
    const updateTasks = (tasks = []) =>
      tasks.map((t) =>
        t.id === questId
          ? { ...t, status: 'AVAILABLE', explanation: '', evidenceImage: null }
          : t
      )

    const updateMissionList = (list) =>
      list.map((m) =>
        m.id === targetId ? { ...m, tasks: updateTasks(m.tasks) } : m
      )

    if (activeTab === 'demo') {
      setDemoMissions((prev) => updateMissionList(prev))
    } else {
      setMyMissions((prev) => updateMissionList(prev))
    }

    triggerToast('Quest reset to AVAILABLE.')
  }

  // Handle Claiming Verified Rewards
  const handleClaimVerifiedRewards = ({ xp, gold, isLevelUp }) => {
    setPlayer((prev) => {
      const nextXP = prev.currentXP + xp
      const nextLevel = isLevelUp ? prev.level + 1 : prev.level
      const nextXpReq = isLevelUp ? (nextLevel * 100 + 100) : prev.xpRequired
      const adjustedXP = isLevelUp ? (nextXP - prev.xpRequired) : nextXP

      return {
        ...prev,
        currentXP: adjustedXP,
        xpRequired: nextXpReq,
        level: nextLevel,
        gold: prev.gold + gold,
        streak: prev.streak + 1
      }
    })

    triggerToast(`🎉 REWARD CLAIMED: +${xp} XP • +${gold} GOLD • 🔥 STREAK +1!`)
  }

  // Delete quest from mission (Local & Backend)
  const handleDeleteQuest = async (questId) => {
    if (typeof questId === 'number' || !isNaN(Number(questId))) {
      try {
        await tasksApi.delete(questId)
      } catch (err) {
        console.warn('Backend delete task error:', err)
      }
    }

    const updateTasks = (tasks) => tasks.filter((t) => t.id !== questId)
    const updateMissionList = (list) =>
      list.map((m) =>
        m.id === selectedMission?.id ? { ...m, tasks: updateTasks(m.tasks) } : m
      )

    if (activeTab === 'demo') {
      setDemoMissions((prev) => updateMissionList(prev))
    } else {
      setMyMissions((prev) => updateMissionList(prev))
    }
    triggerToast('Quest removed from mission.')
  }

  // Category Filters
  const categoryFilters = [
    { id: 'ALL', label: 'All Realms' },
    { id: 'INTELLECT', label: 'Intellect', icon: Brain },
    { id: 'STRENGTH', label: 'Strength', icon: Dumbbell },
    { id: 'VITALITY', label: 'Vitality', icon: HeartPulse },
    { id: 'WISDOM', label: 'Wisdom', icon: Compass },
    { id: 'DISCIPLINE', label: 'Discipline', icon: FlameKindling }
  ]

  // Aggregated Stats
  const totalVerifiedQuests = currentMissions.reduce(
    (acc, m) =>
      acc +
      (m.tasks?.filter((t) => (t.status || '').toUpperCase() === 'VERIFIED').length || 0),
    0
  )
  const totalQuestsCount = currentMissions.reduce(
    (acc, m) => acc + (m.tasks?.length || 0),
    0
  )
  const totalPoolXP = currentMissions.reduce(
    (acc, m) =>
      acc +
      (m.tasks?.reduce((tAcc, t) => tAcc + (t.potentialXP || t.xpReward || 0), 0) || 0),
    0
  )

  // Selected mission verified metrics
  const selectedMissionQuests = selectedMission?.tasks || []
  const selectedMissionVerified = selectedMissionQuests.filter(
    (t) => (t.status || '').toUpperCase() === 'VERIFIED'
  ).length
  const selectedMissionProgress =
    selectedMissionQuests.length > 0
      ? Math.round((selectedMissionVerified / selectedMissionQuests.length) * 100)
      : 0

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundImage: `
          linear-gradient(180deg, rgba(6, 9, 16, 0.65) 0%, rgba(5, 7, 13, 0.85) 45%, rgba(4, 6, 10, 0.98) 100%),
          url(${townBg})
        `,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center top',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.5s ease-in-out'
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

      {/* Top Navigation Bar */}
      <Navbar
        level={player.level}
        currentXP={player.currentXP}
        xpRequired={player.xpRequired}
        gold={player.gold}
        streak={player.streak}
        activeLink="missions"
        onNavigate={(nav) => {
          if (nav === 'landing') navigate('/')
          else if (nav === 'dashboard') navigate('/dashboard')
          else if (nav === 'missions') navigate('/missions')
          else if (nav === 'story') navigate('/story')
          else if (nav === 'character') navigate('/character')
          else if (nav === 'world') navigate('/world')
          else if (nav === 'shop') navigate('/shop')
          else if (nav === 'inventory') navigate('/inventory')
          else navigate('/dashboard')
        }}
        onProfileClick={() => {
          navigate('/character')
        }}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2.5rem 0 5rem', position: 'relative', zIndex: 1 }}>
        <div className="container-custom">
          {/* Header Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: 'var(--text-gold)',
                    textTransform: 'uppercase'
                  }}
                >
                  REAL-LIFE ACTION PROTOCOL
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
                  margin: 0,
                  marginBottom: '0.4rem'
                }}
                className="text-gradient-gold"
              >
                MISSIONS
              </h1>

              <p
                style={{
                  color: '#fbbf24',
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}
              >
                TURN YOUR REAL-LIFE ACTIONS INTO QUESTS.
              </p>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '650px', lineHeight: 1.5, margin: 0 }}>
                Every real-world effort is submitted for review and verified before XP, Gold, attributes, and streak multipliers are unlocked.
              </p>
            </div>

            {/* Top Action & Stat Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {!isAuthenticated ? (
                  <Button
                    variant="cyan"
                    size="sm"
                    icon={UserCheck}
                    onClick={() => setIsAuthModalOpen(true)}
                    id="missions-auth-btn"
                  >
                    SIGN IN / SYNC DB
                  </Button>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-title)',
                      fontWeight: 800
                    }}
                  >
                    <Database size={13} /> DB: ONLINE (POSTGRESQL)
                  </div>
                )}

                <Button
                  variant="gold"
                  size="lg"
                  icon={Plus}
                  onClick={() => setIsCreateMissionOpen(true)}
                  id="create-mission-header-btn"
                  style={{ boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)' }}
                >
                  CREATE MISSION
                </Button>
              </div>

              {/* Summary Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(52, 211, 153, 0.1)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    color: '#34d399',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800
                  }}
                >
                  {totalVerifiedQuests} / {totalQuestsCount} VERIFIED QUESTS
                </div>
                <div
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: 'var(--text-gold)',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800
                  }}
                >
                  +{totalPoolXP} XP POTENTIAL
                </div>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION: MY MISSIONS vs DEMO WORLD */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-medium)',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* MY MISSIONS TAB */}
              <button
                id="tab-my-missions"
                onClick={() => {
                  setActiveTab('my')
                  setSelectedMissionId(myMissions[0]?.id || null)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '0.9rem 1.4rem',
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: activeTab === 'my' ? 'var(--gold-light)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  transition: 'all 0.2s'
                }}
              >
                <Shield size={19} color={activeTab === 'my' ? '#fbbf24' : 'var(--text-muted)'} />
                <span>MY MISSIONS</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '10px',
                    background: activeTab === 'my' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: activeTab === 'my' ? '1px solid #fbbf24' : '1px solid var(--border-subtle)',
                    color: activeTab === 'my' ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  {myMissions.length}
                </span>
                {activeTab === 'my' && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                      boxShadow: '0 0 12px rgba(245, 158, 11, 0.8)'
                    }}
                  />
                )}
              </button>

              {/* DEMO WORLD TAB */}
              <button
                id="tab-demo-world"
                onClick={() => {
                  setActiveTab('demo')
                  setSelectedMissionId(demoMissions[0]?.id || null)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '0.9rem 1.4rem',
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: activeTab === 'demo' ? 'var(--cyan-light)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  transition: 'all 0.2s'
                }}
              >
                <Globe size={19} color={activeTab === 'demo' ? '#38bdf8' : 'var(--text-muted)'} />
                <span>DEMO WORLD</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '10px',
                    background: activeTab === 'demo' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: activeTab === 'demo' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                    color: activeTab === 'demo' ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  {demoMissions.length}
                </span>
                {activeTab === 'demo' && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                      boxShadow: '0 0 12px rgba(56, 189, 248, 0.8)'
                    }}
                  />
                )}
              </button>
            </div>

            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem 0.85rem',
                width: '100%',
                maxWidth: '280px'
              }}
            >
              <Search size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
              <input
                type="text"
                placeholder="Search missions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  width: '100%'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.75rem',
              marginBottom: '2rem'
            }}
          >
            {categoryFilters.map((cat) => {
              const isSelected = selectedCategory === cat.id
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    background: isSelected ? 'rgba(245, 158, 11, 0.18)' : 'rgba(15, 23, 42, 0.6)',
                    border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: '20px',
                    padding: '0.4rem 0.9rem',
                    color: isSelected ? 'var(--gold-light)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {Icon && <Icon size={14} />}
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* Two-Column Responsive Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '2rem',
              alignItems: 'start'
            }}
          >
            {/* COLUMN 1: MISSION CARDS LIST */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem'
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    margin: 0
                  }}
                >
                  {activeTab === 'my' ? 'MY MISSIONS' : 'DEMO WORLD MISSIONS'} ({filteredMissions.length})
                </h3>
              </div>

              {/* Empty state when no missions exist */}
              {filteredMissions.length === 0 ? (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px dashed var(--border-medium)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '3.5rem 2rem',
                    textAlign: 'center'
                  }}
                >
                  <Shield size={44} color="var(--text-muted)" style={{ margin: '0 auto 1.25rem' }} />
                  <h4
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '1.3rem',
                      fontWeight: 900,
                      color: '#ffffff',
                      marginBottom: '0.5rem',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {activeTab === 'demo' ? 'NO DEMO MISSIONS' : 'NO MISSIONS YET'}
                  </h4>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.95rem',
                      maxWidth: '440px',
                      margin: '0 auto 1.75rem',
                      lineHeight: 1.5
                    }}
                  >
                    {activeTab === 'demo'
                      ? 'All demo missions have been removed. Switch to MY MISSIONS to create or manage your real-life quests.'
                      : 'Create your first real-life mission and turn your actions into quests.'}
                  </p>
                  <Button
                    variant="gold"
                    size="md"
                    icon={Plus}
                    onClick={() => {
                      if (activeTab === 'demo') setActiveTab('my')
                      setIsCreateMissionOpen(true)
                    }}
                    id="create-first-mission-empty-btn"
                  >
                    CREATE MISSION
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {filteredMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      isSelected={selectedMission?.id === mission.id}
                      onSelectMission={(m) => setSelectedMissionId(m.id)}
                      onAddTask={(m) => {
                        setSelectedMissionId(m.id)
                        setIsCreateQuestOpen(true)
                      }}
                      onDelete={handleDeleteMission}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* COLUMN 2: SELECTED MISSION & TODAY'S QUESTS */}
            {selectedMission && (
              <div
                style={{
                  position: 'sticky',
                  top: '90px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.75rem'
                }}
              >
                {/* Mission Header Card */}
                <div
                  style={{
                    background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.95) 0%, rgba(10, 14, 24, 0.98) 100%)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.75rem',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Badge variant={selectedMission.categoryTheme || 'cyan'} size="md">
                        {selectedMission.category}
                      </Badge>
                      <Badge variant="gold" size="sm">
                        {selectedMission.difficulty}
                      </Badge>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteMission(selectedMission.id)}
                      title="Delete This Mission"
                      id="delete-selected-mission-top-btn"
                      style={{
                        background: 'rgba(244, 63, 94, 0.12)',
                        border: '1px solid rgba(244, 63, 94, 0.35)',
                        borderRadius: '6px',
                        color: '#fb7185',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-title)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(244, 63, 94, 0.25)'
                        e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.6)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(244, 63, 94, 0.12)'
                        e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.35)'
                      }}
                    >
                      <Trash2 size={13} /> Delete Mission
                    </button>
                  </div>

                  <h2
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '1.6rem',
                      fontWeight: 900,
                      color: '#ffffff',
                      letterSpacing: '0.03em',
                      lineHeight: 1.25,
                      marginBottom: '0.65rem'
                    }}
                  >
                    {selectedMission.title}
                  </h2>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {selectedMission.description}
                  </p>

                  {/* Mission Overall Progress (VERIFIED QUESTS ONLY) */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1.1rem',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-title)', fontWeight: 800 }}>
                        MISSION PROGRESS
                      </span>
                      <span style={{ color: selectedMissionProgress === 100 ? '#34d399' : 'var(--gold-light)', fontWeight: 800 }}>
                        {selectedMissionVerified} / {selectedMissionQuests.length} VERIFIED QUESTS ({selectedMissionProgress}%)
                      </span>
                    </div>
                    <ProgressBar
                      progress={selectedMissionProgress}
                      color={selectedMissionProgress === 100 ? 'green' : 'gold'}
                      height="8px"
                      animated={selectedMissionProgress > 0 && selectedMissionProgress < 100}
                    />
                  </div>

                  {/* Section Title & Action: TODAY'S QUESTS + ADD QUEST */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '1.25rem',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Swords size={18} color="var(--gold-primary)" />
                      <h3
                        style={{
                          fontFamily: 'var(--font-title)',
                          fontSize: '1.1rem',
                          fontWeight: 900,
                          color: '#ffffff',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          margin: 0
                        }}
                      >
                        TODAY'S QUESTS ({selectedMissionQuests.length})
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Upload}
                        onClick={() => setIsImportModalOpen(true)}
                        id="import-today-tasks-btn"
                        style={{ fontSize: '0.78rem' }}
                      >
                        IMPORT TASKS
                      </Button>
                      <Button
                        variant="cyan"
                        size="sm"
                        icon={Plus}
                        onClick={() => setIsCreateQuestOpen(true)}
                        id="add-today-quest-btn"
                      >
                        ADD QUEST
                      </Button>
                    </div>
                  </div>

                  {/* TODAY'S QUEST CARDS LIST */}
                  {selectedMissionQuests.length === 0 ? (
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px dashed var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '2rem 1.5rem',
                        textAlign: 'center'
                      }}
                    >
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        No real-life quests added to this mission yet.
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                        <Button
                          variant="gold"
                          size="sm"
                          icon={Plus}
                          onClick={() => setIsCreateQuestOpen(true)}
                        >
                          ADD QUEST
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Upload}
                          onClick={() => setIsImportModalOpen(true)}
                        >
                          IMPORT TASKS
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                      {selectedMissionQuests.map((quest) => (
                        <QuestCard
                          key={quest.id}
                          quest={quest}
                          onCompleteClick={(q) => setActiveQuestForCompletion(q)}
                          onMockVerify={handleMockVerifyQuest}
                          onMockReject={handleMockRejectQuest}
                          onResetStatus={handleResetQuestStatus}
                          onDelete={handleDeleteQuest}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* QUEST HISTORY SECTION */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <History size={18} color="var(--text-gold)" />
                    <h3
                      style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: '1.1rem',
                        fontWeight: 900,
                        color: '#ffffff',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        margin: 0
                      }}
                    >
                      QUEST HISTORY
                    </h3>
                  </div>

                  <QuestHistory history={selectedMission.history || []} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CREATE MISSION MODAL */}
      <CreateMissionModal
        isOpen={isCreateMissionOpen}
        onClose={() => setIsCreateMissionOpen(false)}
        onCreateMission={handleCreateMission}
      />

      {/* CREATE QUEST MODAL (+ ADD QUEST) */}
      <CreateQuestModal
        isOpen={isCreateQuestOpen}
        onClose={() => setIsCreateQuestOpen(false)}
        onAddQuest={handleAddQuest}
        missionTitle={selectedMission?.title || 'Mission'}
      />

      {/* IMPORT TASKS MODAL */}
      <ImportTasksModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportTasks={handleImportTasks}
        missionTitle={selectedMission?.title || 'Mission'}
      />

      {/* QUEST COMPLETION / "WHAT DID YOU DO?" MODAL */}
      <QuestCompletionModal
        isOpen={!!activeQuestForCompletion}
        onClose={() => setActiveQuestForCompletion(null)}
        quest={activeQuestForCompletion}
        onSubmitForVerification={handleSubmitForVerification}
      />

      {/* REWARD CELEBRATION MODAL */}
      <RewardModal
        isOpen={!!verifiedQuestForReward}
        onClose={() => setVerifiedQuestForReward(null)}
        quest={verifiedQuestForReward}
        player={player}
        onClaim={handleClaimVerifiedRewards}
      />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}

export default Missions
