import { getCurrentStreak } from '../utils/streakManager'

export const initialPlayerData = {
  name: 'VANGUARD',
  title: 'Initiate Operative',
  level: 1,
  currentXP: 0,
  xpRequired: 100,
  gold: 0,
  streak: getCurrentStreak(),
  rank: 'Recruit',
  avatarUrl: null
}

export const initialAttributes = [
  {
    id: 'intellect',
    name: 'INTELLECT',
    category: 'intellect',
    value: 10,
    maxValue: 30,
    progress: 0,
    color: 'cyan',
    accentColor: '#38bdf8',
    recentGain: 0,
    description: 'Logic, Coding, Technical Strategy & Analysis'
  },
  {
    id: 'strength',
    name: 'STRENGTH',
    category: 'strength',
    value: 10,
    maxValue: 30,
    progress: 0,
    color: 'red',
    accentColor: '#f43f5e',
    recentGain: 0,
    description: 'Physical Power, Resistance Training & Athletics'
  },
  {
    id: 'vitality',
    name: 'VITALITY',
    category: 'vitality',
    value: 10,
    maxValue: 30,
    progress: 0,
    color: 'green',
    accentColor: '#34d399',
    recentGain: 0,
    description: 'Endurance, Recovery, Nutrition & Energy'
  },
  {
    id: 'wisdom',
    name: 'WISDOM',
    category: 'wisdom',
    value: 10,
    maxValue: 30,
    progress: 0,
    color: 'purple',
    accentColor: '#c084fc',
    recentGain: 0,
    description: 'Mental Clarity, Mindfulness, Focus & Philosophy'
  },
  {
    id: 'discipline',
    name: 'DISCIPLINE',
    category: 'discipline',
    value: 10,
    maxValue: 30,
    progress: 0,
    color: 'gold',
    accentColor: '#f59e0b',
    recentGain: 0,
    description: 'Habit Consistency, Willpower & Streak Stamina'
  }
]

export const initialQuests = []

export const initialRecentActivity = []

