export type Game = {
  slug: string
  title: string
  genre: string
  description: string
  tags: string[]
  artwork: string
  accent: string
  symbol: string
  added?: boolean
  sourceName: string
  sourceUrl: string
  embedUrl?: string
}

// Keep iframe URLs limited to publisher-provided or permissively licensed game builds.
export const games: Game[] = [
  {
    slug: 'hexgl',
    title: 'HexGL',
    genre: 'Racing',
    description: 'Race a high-speed anti-gravity ship through a luminous future city in this open-source WebGL racer.',
    tags: ['Open source', 'Featured'],
    artwork: 'linear-gradient(125deg,#0d153c 0%,#5224a2 48%,#ff4a85 100%)',
    accent: '#ec73d5',
    symbol: '◈',
    sourceName: 'bkcore · MIT licensed',
    sourceUrl: 'https://hexgl.bkcore.com/play/',
    embedUrl: 'https://hexgl.bkcore.com/play/',
  },
  {
    slug: '10-bullets',
    title: '10 Bullets',
    genre: 'Arcade',
    description: 'Time one perfect shot and set off a chain reaction in this quick-fire arcade challenge.',
    tags: ['CrazyGames', 'New'],
    artwork: 'linear-gradient(135deg,#191344,#5542b3 53%,#fc79ad)',
    accent: '#bf9dff',
    symbol: '▧',
    added: true,
    sourceName: 'CrazyGames',
    sourceUrl: 'https://www.crazygames.com/embed/10-bullets-html-5',
    embedUrl: 'https://www.crazygames.com/embed/10-bullets-html-5',
  },
  {
    slug: 'territorial-io',
    title: 'Territorial.io',
    genre: 'Strategy',
    description: 'Expand your territory, balance your growth, and compete for control of the map.',
    tags: ['Multiplayer', 'Play on source'],
    artwork: 'linear-gradient(135deg,#14365c,#267cb4 52%,#a9e1f5)',
    accent: '#73d6ff',
    symbol: '✦',
    sourceName: 'Territorial.io',
    sourceUrl: 'https://territorial.io/',
  },
  {
    slug: 'openfront',
    title: 'OpenFront',
    genre: 'Strategy',
    description: 'A real-time strategy game about diplomacy, expansion, and competing fronts.',
    tags: ['Multiplayer', 'Play on source'],
    artwork: 'linear-gradient(135deg,#102f37,#197b83 54%,#b1dfb5)',
    accent: '#78e7d0',
    symbol: '⬡',
    sourceName: 'OpenFront',
    sourceUrl: 'https://openfront.io/',
  },
]

export const categories = ['All', 'Action', 'Adventure', 'Arcade', 'Puzzle', 'Strategy', 'Sports', 'Racing', 'Multiplayer', 'HTML5']
export const gameBySlug = (slug: string) => games.find((game) => game.slug === slug)
