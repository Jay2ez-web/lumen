export type GameSourceType = 'approved-embed' | 'external-link' | 'self-hosted' | 'placeholder'

export type Game = {
  slug: string
  title: string
  genre: string
  description: string
  tags: string[]
  thumbnailUrl: string
  bannerUrl: string
  playUrl: string
  launchMode?: 'iframe' | 'new-tab'
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

type HostedGame = Omit<Game, 'thumbnailUrl' | 'bannerUrl' | 'sourceType'>

function hostedGame(game: HostedGame, sourceType: GameSourceType = 'approved-embed'): Game {
  return {
    ...game,
    thumbnailUrl: `/game-thumbnails/${game.slug}.png`,
    bannerUrl: `/game-thumbnails/${game.slug}.png`,
    sourceType,
    launchMode: game.launchMode ?? (sourceType === 'external-link' ? 'new-tab' : 'iframe'),
  }
}

export const games: Game[] = [
  hostedGame({
    slug: 'eaglercraft-112',
    title: 'Eaglercraft 1.12',
    genre: 'Sandbox',
    description: 'A browser-hosted block-building sandbox client loaded from its existing game host.',
    tags: ['Sandbox', 'Featured', 'Multiplayer'],
    playUrl: 'https://client.eaglercraft.win/eagler-files/wasm/1.12/Main/index.html',
    provider: 'Eaglercraft host',
    licenseUrl: null,
    featured: true,
    multiplayer: true,
    addedAt: '2026-11-11',
    accent: '#9fe0a0',
    secondaryAccent: '#43704a',
    symbol: '▦',
  }, 'external-link'),
  hostedGame({
    slug: 'territorial-io',
    title: 'Territorial.io',
    genre: 'Strategy',
    description: 'Expand your territory, balance your growth, and compete for control of the map.',
    tags: ['Strategy', 'Multiplayer'],
    playUrl: 'https://territorial.io/',
    provider: 'Territorial.io',
    licenseUrl: null,
    featured: true,
    multiplayer: true,
    accent: '#73d6ff',
    secondaryAccent: '#267cb4',
    symbol: '◉',
  }),
  hostedGame({
    slug: 'openfront',
    title: 'OpenFront.io',
    genre: 'Strategy',
    description: 'A real-time strategy game about diplomacy, expansion, and competing fronts.',
    tags: ['Strategy', 'Multiplayer'],
    playUrl: 'https://openfront.io/',
    provider: 'OpenFront',
    licenseUrl: null,
    featured: true,
    multiplayer: true,
    accent: '#78e7d0',
    secondaryAccent: '#197b83',
    symbol: '✦',
  }, 'external-link'),
  hostedGame({
    slug: 'cookie-clicker',
    title: 'Cookie Clicker',
    genre: 'Idle',
    description: 'Build a cookie empire in this classic incremental game.',
    tags: ['Idle', 'Casual'],
    playUrl: 'https://orteil.dashnet.org/cookieclicker/',
    provider: 'Orteil',
    licenseUrl: null,
    featured: false,
    multiplayer: false,
    accent: '#f2c68a',
    secondaryAccent: '#a45b3c',
    symbol: '◉',
  }),
  hostedGame({
    slug: 'little-alchemy',
    title: 'Little Alchemy',
    genre: 'Puzzle',
    description: 'Combine simple elements and discover new materials and objects.',
    tags: ['Puzzle', 'Casual'],
    playUrl: 'https://littlealchemy.com',
    provider: 'Little Alchemy',
    licenseUrl: null,
    featured: false,
    multiplayer: false,
    accent: '#9cc9e9',
    secondaryAccent: '#4f70a5',
    symbol: '◇',
  }),
  hostedGame({
    slug: 'slither-io',
    title: 'Slither.io',
    genre: 'Arcade',
    description: 'Grow your snake and outmaneuver other players in a fast browser arena.',
    tags: ['Arcade', 'Multiplayer'],
    playUrl: 'https://slither.io/',
    provider: 'Slither.io',
    licenseUrl: null,
    featured: true,
    multiplayer: true,
    accent: '#8ee49e',
    secondaryAccent: '#47a878',
    symbol: '↝',
  }),
  hostedGame({
    slug: '10-bullets',
    title: '10 Bullets',
    genre: 'Arcade',
    description: 'Time one perfect shot and set off a chain reaction in this quick-fire arcade challenge.',
    tags: ['Arcade', 'New'],
    playUrl: 'https://www.crazygames.com/embed/10-bullets-html-5',
    provider: 'CrazyGames',
    licenseUrl: null,
    featured: false,
    multiplayer: false,
    addedAt: '2026-11-11',
    accent: '#bf9dff',
    secondaryAccent: '#5542b3',
    symbol: '✺',
  }),
  hostedGame({
    slug: 'hexgl',
    title: 'HexGL',
    genre: 'Racing',
    description: 'Race a high-speed anti-gravity ship through a luminous future city in this open-source WebGL racer.',
    tags: ['Racing', 'Open source'],
    playUrl: 'https://hexgl.bkcore.com/play/',
    provider: 'bkcore',
    licenseUrl: null,
    featured: true,
    multiplayer: false,
    accent: '#ec73d5',
    secondaryAccent: '#5224a2',
    symbol: '◈',
  }),
  hostedGame({
    slug: 'tina-detective',
    title: 'Tina Detective',
    genre: 'Puzzle',
    description: 'Find clues and solve a lighthearted hidden-object mystery.',
    tags: ['Puzzle', 'Adventure'],
    playUrl: 'https://play.famobi.com/tina-detective/A1000-10',
    provider: 'Famobi',
    licenseUrl: null,
    featured: false,
    multiplayer: false,
    accent: '#dfb3ea',
    secondaryAccent: '#8d5b8d',
    symbol: '⌕',
  }),
  hostedGame({
    slug: 'free-asteroids',
    title: 'Free Asteroids',
    genre: 'Arcade',
    description: 'Pilot through a field of asteroids in a classic arcade-style space game.',
    tags: ['Arcade', 'Space'],
    playUrl: 'https://freeasteroids.org/',
    provider: 'Free Asteroids',
    licenseUrl: null,
    featured: false,
    multiplayer: false,
    accent: '#8bb8ff',
    secondaryAccent: '#314c87',
    symbol: '✦',
  }),
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
  if (sourceType === 'approved-embed') return 'Provider embed'
  if (sourceType === 'external-link') return 'External provider'
  if (sourceType === 'self-hosted') return 'Self-hosted'
  return 'Placeholder game'
}
