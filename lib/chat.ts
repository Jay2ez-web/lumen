// Future Supabase wiring should authenticate each participant, insert user-scoped rows, and subscribe through Realtime under matching RLS policies.
export type ChatUser = {
  id: string
  username: string
  avatarUrl?: string
  status: 'online' | 'away' | 'offline'
}

export type ChatMessage = {
  id: string
  userId: string
  username: string
  body: string
  createdAt: string
  reactions?: string[]
}

export const demoUsers: ChatUser[] = [
  { id: 'you', username: 'You', status: 'online' },
  { id: 'orbit', username: 'orbit', status: 'online' },
  { id: 'moss', username: 'moss', status: 'online' },
  { id: 'nova', username: 'nova', status: 'away' },
]

export const welcomeMessages: ChatMessage[] = [
  { id: 'welcome-1', userId: 'orbit', username: 'orbit', body: 'Welcome to the LUMEN local demo chat. Messages are stored only in this browser.', createdAt: '2026-11-11T12:00:00.000Z', reactions: ['sparkle'] },
  { id: 'welcome-2', userId: 'moss', username: 'moss', body: 'What are you playing or watching today?', createdAt: '2026-11-11T12:02:00.000Z' },
]

const filteredTerms = ['fuck', 'shit', 'bitch']

export function moderateMessage(value: string) {
  const body = value.replace(/\s+/g, ' ').trim()
  if (!body) return { ok: false, body: '', reason: 'Write a message before sending.' }
  if (body.length > 500) return { ok: false, body: '', reason: 'Messages must be 500 characters or fewer.' }
  const normalized = body.toLocaleLowerCase()
  if (filteredTerms.some((term) => normalized.includes(term))) return { ok: false, body: '', reason: 'Please keep the chat welcoming.' }
  return { ok: true, body, reason: '' }
}
