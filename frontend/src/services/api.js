/**
 * Centralized API Client for Life RPG Backend (FastAPI)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://rpg-gamification-4.onrender.com'

// Token Management
export const TOKEN_KEY = 'life_rpg_auth_token'
export const USER_KEY = 'life_rpg_user_profile'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Core HTTP Request Wrapper
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }

  const config = {
    ...options,
    headers
  }

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, config)

    // Handle 204 No Content
    if (response.status === 204) {
      return null
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      let errorMessage = 'An error occurred during request.'
      if (data?.detail) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((err) => err.msg || JSON.stringify(err)).join(', ')
        } else {
          errorMessage = JSON.stringify(data.detail)
        }
      }
      const error = new Error(errorMessage)
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      const connError = new Error('Cannot connect to backend service. Please verify FastAPI backend is running.')
      connError.status = 503
      throw connError
    }
    throw err
  }
}

/**
 * AUTH API SERVICE
 */
export const authApi = {
  signup: async (email, password) => {
    return await apiRequest('/api/v1/auth/signup', {
      method: 'POST',
      body: { email, password }
    })
  },

  login: async (email, password) => {
    const data = await apiRequest('/api/v1/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    if (data?.access_token) {
      setToken(data.access_token)
    }
    return data
  },

  getMe: async () => {
    const user = await apiRequest('/api/v1/auth/me', {
      method: 'GET'
    })
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
    return user
  },

  logout: () => {
    removeToken()
  },

  isAuthenticated: () => {
    return !!getToken()
  }
}

/**
 * MISSIONS API SERVICE
 */
export const missionsApi = {
  list: async () => {
    return await apiRequest('/api/v1/missions', {
      method: 'GET'
    })
  },

  get: async (missionId) => {
    return await apiRequest(`/api/v1/missions/${missionId}`, {
      method: 'GET'
    })
  },

  create: async ({ title, description, difficulty = 'Medium' }) => {
    return await apiRequest('/api/v1/missions', {
      method: 'POST',
      body: { title, description, difficulty }
    })
  },

  update: async (missionId, { title, description, difficulty }) => {
    return await apiRequest(`/api/v1/missions/${missionId}`, {
      method: 'PUT',
      body: { title, description, difficulty }
    })
  },

  delete: async (missionId) => {
    return await apiRequest(`/api/v1/missions/${missionId}`, {
      method: 'DELETE'
    })
  }
}

/**
 * TASKS API SERVICE
 */
export const tasksApi = {
  create: async (missionId, { title, description = '', category = 'INTELLECT', difficulty = 'Medium', repeat_type = 'daily' }) => {
    return await apiRequest(`/api/v1/missions/${missionId}/tasks`, {
      method: 'POST',
      body: { title, description, category, difficulty, repeat_type }
    })
  },

  listForMission: async (missionId) => {
    return await apiRequest(`/api/v1/missions/${missionId}/tasks`, {
      method: 'GET'
    })
  },

  update: async (taskId, updateData) => {
    return await apiRequest(`/api/v1/tasks/${taskId}`, {
      method: 'PUT',
      body: updateData
    })
  },

  delete: async (taskId) => {
    return await apiRequest(`/api/v1/tasks/${taskId}`, {
      method: 'DELETE'
    })
  },

  importTasks: async (missionId, tasksArray) => {
    return await apiRequest(`/api/v1/missions/${missionId}/tasks/import`, {
      method: 'POST',
      body: tasksArray
    })
  },

  completeTask: async (taskId, { what_you_did = null, evidence_image_url = null } = {}) => {
    let sanitizedEvidenceUrl = null
    if (typeof evidence_image_url === 'string' && evidence_image_url.trim()) {
      const trimmed = evidence_image_url.trim()
      // Only forward URL strings <= 500 characters to prevent PostgreSQL VARCHAR(512) overflow
      if (!trimmed.startsWith('data:') && trimmed.length <= 500) {
        sanitizedEvidenceUrl = trimmed
      }
    }

    return await apiRequest(`/api/v1/tasks/${taskId}/complete`, {
      method: 'POST',
      body: {
        what_you_did: what_you_did ? String(what_you_did).slice(0, 1000) : null,
        evidence_image_url: sanitizedEvidenceUrl
      }
    })
  },

  getHistory: async (taskId) => {
    return await apiRequest(`/api/v1/tasks/${taskId}/history`, {
      method: 'GET'
    })
  }
}

/**
 * ACTIVITY API SERVICE
 */
export const activityApi = {
  getRecent: async (limit = 20) => {
    return await apiRequest(`/api/v1/activity?limit=${limit}`, {
      method: 'GET'
    })
  }
}

/**
 * SHOP & INVENTORY API SERVICE
 */
export const shopApi = {
  getItems: async () => {
    return await apiRequest('/api/v1/shop/items', {
      method: 'GET'
    })
  },

  purchase: async (itemId) => {
    return await apiRequest('/api/v1/shop/purchase', {
      method: 'POST',
      body: { item_id: itemId }
    })
  }
}

export const inventoryApi = {
  getInventory: async () => {
    return await apiRequest('/api/v1/inventory', {
      method: 'GET'
    })
  }
}

/**
 * PLAYER & DASHBOARD AGGREGATE SERVICE
 */
export const playerApi = {
  getDashboard: async () => {
    // Fetch current user & character info
    const user = await authApi.getMe()
    const missions = await missionsApi.list().catch(() => [])
    const recentActivity = await activityApi.getRecent(10).catch(() => [])

    return {
      user,
      character: user?.character,
      missions,
      recentActivity
    }
  }
}

export default {
  auth: authApi,
  missions: missionsApi,
  tasks: tasksApi,
  activity: activityApi,
  shop: shopApi,
  inventory: inventoryApi,
  player: playerApi
}
