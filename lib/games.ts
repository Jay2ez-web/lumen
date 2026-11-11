export type GameSourceType = 'approved-embed' | 'self-hosted' | 'placeholder'

export type Game = {
  slug: string
  title: string
  genre: string
  description: string
  tags: string[]
  thumbnailUrl: string
  bannerUrl: string
  playUrl: string
  sourceType: GameSourceType
  provider: string
  licenseUrl: string | null
  featured: boolean
  multiplayer: boolean
  addedAt?: string
  accent: string
  secondaryAccent: string
  symbol: string
}

type SampleGame = Omit<Game, 'thumbnailUrl' | 'bannerUrl' | 'playUrl' | 'sourceType' | 'provider' | 'licenseUrl'>

function sampleGame(game: SampleGame): Game {
  return {
    ...game,
    thumbnailUrl: `/game-art/${game.slug}.svg?v=2`,
    bannerUrl: `/game-art/${game.slug}.svg?format=banner&v=2`,
    playUrl: `/game-preview/${game.slug}`,
    sourceType: 'placeholder',
    provider: 'Arcadia sample catalog',
    licenseUrl: null,
  }
}

export const games: Game[] = [
  sampleGame({ slug: 'nebula-drift', title: 'Nebula Drift', genre: 'Racing', description: 'Thread a sleek starship through luminous asteroid fields and chase a clean lap.', tags: ['Racing', 'Featured'], featured: true, multiplayer: false, addedAt: '2026-11-08', accent: '#b88cff', secondaryAccent: '#366fff', symbol: '◈' }),
  sampleGame({ slug: 'mosslight-grove', title: 'Mosslight Grove', genre: 'Adventure', description: 'Explore a quiet bioluminescent forest, uncover small secrets, and find your way home.', tags: ['Adventure', 'Exploration'], featured: true, multiplayer: false, addedAt: '2026-11-05', accent: '#72e6b2', secondaryAccent: '#236c74', symbol: '✳' }),
  sampleGame({ slug: 'circuit-breaker', title: 'Circuit Breaker', genre: 'Arcade', description: 'Connect bright circuit nodes before the board runs out of room.', tags: ['Arcade', 'Puzzle'], featured: false, multiplayer: false, addedAt: '2026-11-02', accent: '#63ddff', secondaryAccent: '#5d59ed', symbol: '⌁' }),
  sampleGame({ slug: 'starforge-tactics', title: 'Starforge Tactics', genre: 'Strategy', description: 'Plan a few moves ahead and guide your tiny fleet through a tactical skirmish.', tags: ['Strategy', 'Featured'], featured: true, multiplayer: true, addedAt: '2026-10-30', accent: '#ff9b70', secondaryAccent: '#9a49a8', symbol: '✦' }),
  sampleGame({ slug: 'moonbase-mahjong', title: 'Moonbase Mahjong', genre: 'Puzzle', description: 'Pair calm lunar tiles and clear a tidy path through the station.', tags: ['Puzzle', 'Casual'], featured: false, multiplayer: false, addedAt: '2026-10-25', accent: '#a0c7ff', secondaryAccent: '#614eb1', symbol: '▧' }),
  sampleGame({ slug: 'emberfall-arena', title: 'Emberfall Arena', genre: 'Action', description: 'Dodge sweeping hazards and collect sparks in a compact arena challenge.', tags: ['Action', 'Arcade'], featured: false, multiplayer: true, addedAt: '2026-10-21', accent: '#ff8b6d', secondaryAccent: '#bd356d', symbol: '✺' }),
  sampleGame({ slug: 'tiny-railway', title: 'Tiny Railway', genre: 'Simulation', description: 'Lay a winding route between miniature stations without creating a traffic jam.', tags: ['Simulation', 'Strategy'], featured: false, multiplayer: false, addedAt: '2026-10-18', accent: '#f1cd7b', secondaryAccent: '#3b9b90', symbol: '⌁' }),
  sampleGame({ slug: 'cloudbound-karting', title: 'Cloudbound Karting', genre: 'Racing', description: 'Take a quick lap over the clouds and keep your little racer on the track.', tags: ['Racing', 'Multiplayer'], featured: false, multiplayer: true, addedAt: '2026-10-12', accent: '#ff9dc9', secondaryAccent: '#587be9', symbol: '↗' }),
  sampleGame({ slug: 'void-runner', title: 'Void Runner', genre: 'Arcade', description: 'Dash through a shifting neon corridor and react to every turn.', tags: ['Arcade', 'Action'], featured: false, multiplayer: false, addedAt: '2026-10-09', accent: '#cf8eff', secondaryAccent: '#4145ad', symbol: '⟡' }),
  sampleGame({ slug: 'runeweaver', title: 'Runeweaver', genre: 'Role-playing', description: 'Combine elemental runes and shape a short, storybook quest.', tags: ['Role-playing', 'Adventure'], featured: false, multiplayer: false, addedAt: '2026-10-03', accent: '#9bf0dc', secondaryAccent: '#4160a9', symbol: '⌘' }),
  sampleGame({ slug: 'pocket-garden', title: 'Pocket Garden', genre: 'Casual', description: 'Arrange a few seeds, tend a tiny garden, and watch it fill with color.', tags: ['Casual', 'Simulation'], featured: false, multiplayer: false, addedAt: '2026-09-27', accent: '#a8e786', secondaryAccent: '#598753', symbol: '❋' }),
  sampleGame({ slug: 'astro-hoops', title: 'Astro Hoops', genre: 'Sports', description: 'Line up a zero-gravity shot and send the ball through a floating hoop.', tags: ['Sports', 'Arcade'], featured: false, multiplayer: true, addedAt: '2026-09-20', accent: '#ffc978', secondaryAccent: '#e2607e', symbol: '◎' }),
]

export const categories = ['All', ...Array.from(new Set(games.map((game) => game.genre))).sort(), 'Multiplayer']
export const gameBySlug = (slug: string) => games.find((game) => game.slug === slug)

export function buildExploreHref(query: string, category: string) {
  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  if (category !== 'All') params.set('category', category)
  const search = params.toString()
  return search ? `/explore?${search}` : '/explore'
}

export function buildGameHref(slug: string, returnTo?: string) {
  if (!returnTo || !returnTo.startsWith('/explore') || returnTo.startsWith('//')) return `/games/${slug}`
  return `/games/${slug}?${new URLSearchParams({ returnTo }).toString()}`
}

export type RouteSearchParams = Promise<Record<string, string | string[] | undefined>>

export function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export function getSafeReturnHref(value: string) {
  if (!value.startsWith('/') || value.startsWith('//')) return undefined
  try {
    const parsed = new URL(value, 'https://arcadia.local')
    if (parsed.origin !== 'https://arcadia.local' || parsed.pathname !== '/explore') return undefined
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return undefined
  }
}

export function sourceTypeLabel(sourceType: GameSourceType) {
  if (sourceType === 'approved-embed') return 'Approved embed'
  if (sourceType === 'self-hosted') return 'Self-hosted'
  return 'Sample placeholder'
}
