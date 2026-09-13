/**
 * Daily Streak & Local Progression Manager
 * Tracks daily user visits (24h cadence), increments streak on consecutive days,
 * and maintains clean progression states based on actual user interaction.
 */

const STORAGE_KEYS = {
  LAST_VISIT_DATE: 'life_rpg_last_visit_date',
  STREAK_COUNT: 'life_rpg_streak_count',
  LOCAL_PROGRESS: 'life_rpg_player_progress'
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Returns yesterday's date formatted as YYYY-MM-DD
 */
export function getYesterdayDateString() {
  const yesterday = new Date(Date.now() - 86400000)
  const year = yesterday.getFullYear()
  const month = String(yesterday.getMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Checks and updates daily website visit streak.
 * - +1 streak every 24h / consecutive calendar day the user enters the website.
 * - Same day visits keep current streak.
 * - Broken visits (>1 day gap) reset streak to 1.
 */
export function checkAndUpdateDailyStreak() {
  const todayStr = getTodayDateString()
  const yesterdayStr = getYesterdayDateString()
  const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT_DATE)
  const storedStreak = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK_COUNT) || '0', 10)

  // 1. First visit ever
  if (!lastVisit) {
    const initialStreak = 1
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT_DATE, todayStr)
    localStorage.setItem(STORAGE_KEYS.STREAK_COUNT, String(initialStreak))
    return {
      streak: initialStreak,
      isNewDay: true,
      streakIncreased: false,
      message: '⚔️ Welcome Vanguard! Day 1 Streak Started!'
    }
  }

  // 2. Same day visit
  if (lastVisit === todayStr) {
    return {
      streak: Math.max(1, storedStreak),
      isNewDay: false,
      streakIncreased: false,
      message: null
    }
  }

  // 3. Consecutive day visit (Yesterday was last visit)
  if (lastVisit === yesterdayStr) {
    const newStreak = (storedStreak > 0 ? storedStreak : 0) + 1
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT_DATE, todayStr)
    localStorage.setItem(STORAGE_KEYS.STREAK_COUNT, String(newStreak))
    return {
      streak: newStreak,
      isNewDay: true,
      streakIncreased: true,
      message: `🔥 Daily Streak Maintained! Streak: ${newStreak} Days!`
    }
  }

  // 4. Missed day(s) -> Reset streak to 1
  const resetStreak = 1
  localStorage.setItem(STORAGE_KEYS.LAST_VISIT_DATE, todayStr)
  localStorage.setItem(STORAGE_KEYS.STREAK_COUNT, String(resetStreak))
  return {
    streak: resetStreak,
    isNewDay: true,
    streakReset: true,
    message: '🔥 Daily Streak Reset to Day 1. Enter daily to maintain momentum!'
  }
}

/**
 * Gets current stored streak count (defaults to 1)
 */
export function getCurrentStreak() {
  const stored = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK_COUNT) || '1', 10)
  return Math.max(1, stored)
}
