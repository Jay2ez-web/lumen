export const storageKeys = {
  savedGames: 'lumen-saved-games',
  recentlyPlayed: 'lumen-recently-played',
  watchlist: 'lumen-watchlist',
  recentlyWatched: 'lumen-recently-watched',
  openedApps: 'lumen-opened-apps',
  appSettings: 'lumen-app-settings',
  chatMessages: 'lumen-chat-messages',
  savedApps: 'lumen-saved-apps',
  notes: 'lumen-notes',
  todos: 'lumen-todos',
  watchProgress: 'lumen-watch-progress',
  recentSearches: 'lumen-recent-searches',
} as const

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : (JSON.parse(value) as T)
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function clearLumenStorage() {
  if (typeof window === 'undefined') return
  Object.values(storageKeys).forEach((key) => window.localStorage.removeItem(key))
}
