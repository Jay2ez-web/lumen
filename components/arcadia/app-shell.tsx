'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Footer } from '@/components/arcadia/footer'
import { GameDetail } from '@/components/arcadia/game-detail'
import { ExplorePage } from '@/components/arcadia/explore-page'
import { HeroSection } from '@/components/arcadia/hero-section'
import { LibraryPage } from '@/components/arcadia/library-page'
import { Navbar } from '@/components/arcadia/navbar'
import { PlayerModal } from '@/components/arcadia/player-modal'
import { GameRow } from '@/components/arcadia/game-row'
import { buildExploreHref, categories, gameBySlug, games, type Game } from '@/lib/games'

type RouteProps = {
  view: 'home' | 'explore' | 'library' | 'game'
  slug?: string
  initialQuery?: string
  initialCategory?: string
  returnHref?: string
}

function readStoredGames(key: string) {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value.filter((slug): slug is string => typeof slug === 'string' && games.some((game) => game.slug === slug)) : []
  } catch {
    return []
  }
}

export function ArcadiaApp({ view, slug, initialQuery = '', initialCategory = 'All', returnHref }: RouteProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : 'All')
  const [sort, setSort] = useState('Featured')
  const [saved, setSaved] = useState<string[]>([])
  const [played, setPlayed] = useState<string[]>([])
  const [ready, setReady] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    setQuery(initialQuery)
    setCategory(categories.includes(initialCategory) ? initialCategory : 'All')
  }, [initialQuery, initialCategory])

  useEffect(() => {
    setSaved(readStoredGames('arcadia-saved'))
    setPlayed(readStoredGames('arcadia-played'))
    setReady(true)
  }, [])

  useEffect(() => {
    if (view !== 'explore') return
    const nextUrl = buildExploreHref(query, category)
    const currentUrl = `${window.location.pathname}${window.location.search}`
    if (currentUrl !== nextUrl) window.history.replaceState(window.history.state, '', nextUrl)
  }, [view, query, category])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 3000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const showToast = useCallback((message: string) => setToast(message), [])
  const closePlayer = useCallback(() => setSelectedGame(null), [])
  const toggleSave = useCallback((game: Game) => {
    const isSaved = saved.includes(game.slug)
    const next = isSaved ? saved.filter((slug) => slug !== game.slug) : [game.slug, ...saved]
    setSaved(next)
    try { window.localStorage.setItem('arcadia-saved', JSON.stringify(next)) } catch { /* Storage may be disabled. */ }
    showToast(isSaved ? `${game.title} removed from your library` : `${game.title} saved to your library`)
  }, [saved, showToast])

  const startGame = useCallback((game: Game) => {
    const next = [game.slug, ...played.filter((slug) => slug !== game.slug)].slice(0, 12)
    setPlayed(next)
    try { window.localStorage.setItem('arcadia-played', JSON.stringify(next)) } catch { /* Storage may be disabled. */ }
    setSelectedGame(game)
  }, [played])

  const reportBrokenGame = useCallback((game: Game) => {
    const report = `Arcadia game report\nGame: ${game.title}\nProvider: ${game.provider}\nPlay URL: ${game.playUrl}`
    showToast(`Preparing report for ${game.title}`)
    if (!navigator.clipboard?.writeText) {
      showToast(`Report ${game.title} to the site owner with its game title and URL`)
      return
    }
    void navigator.clipboard.writeText(report).then(
      () => showToast('Game report details copied to your clipboard'),
      () => showToast(`Report ${game.title} to the site owner with its game title and URL`),
    )
  }, [showToast])

  const filteredGames = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const matching = games.filter((game) => {
      const matchesQuery = !normalizedQuery || `${game.title} ${game.genre} ${game.description} ${game.provider}`.toLocaleLowerCase().includes(normalizedQuery)
      const matchesCategory = category === 'All' || (category === 'Multiplayer' ? game.multiplayer : game.genre === category)
      return matchesQuery && matchesCategory
    })
    if (sort === 'A–Z') return [...matching].sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'Recently added') return [...matching].sort((a, b) => (b.addedAt ?? '').localeCompare(a.addedAt ?? ''))
    return [...matching].sort((a, b) => Number(b.featured) - Number(a.featured))
  }, [category, query, sort])

  const featuredGames = useMemo(() => {
    const featured = games.filter((game) => game.featured)
    return featured.length ? featured : games.slice(0, 4)
  }, [])
  const feature = featuredGames[0]
  const detail = slug ? gameBySlug(slug) : undefined
  const savedGames = saved.map((savedSlug) => gameBySlug(savedSlug)).filter((game): game is Game => Boolean(game))
  const playedGames = played.map((playedSlug) => gameBySlug(playedSlug)).filter((game): game is Game => Boolean(game))
  const exploreHref = buildExploreHref(query, category)
  const stateParams = new URLSearchParams()
  if (query.trim()) stateParams.set('q', query.trim())
  if (category !== 'All') stateParams.set('category', category)
  const stateSuffix = stateParams.toString()
  const routeHref = (path: string) => stateSuffix ? `${path}?${stateSuffix}` : path
  const detailReturnHref = returnHref ?? exploreHref

  const submitSearch = (value: string) => {
    setQuery(value)
    router.push(buildExploreHref(value, category))
  }

  return <div className="min-h-screen bg-[#080a12] text-white">
    <Navbar pathname={pathname} query={query} savedCount={saved.length} homeHref={routeHref('/')} exploreHref={exploreHref} libraryHref={routeHref('/library')} onQueryChange={setQuery} onSearchSubmit={submitSearch} />
    {view === 'home' && <>
      <HeroSection games={featuredGames} onPlay={startGame} onRandom={() => startGame(games[Math.floor(Math.random() * games.length)])} />
      <main className="mx-auto max-w-[1260px] px-5 sm:px-8">
        <div className="-mt-1 mb-10 flex gap-2 overflow-x-auto pb-1" aria-label="Browse game categories">
          {categories.slice(1, 8).map((item, index) => <a href={buildExploreHref('', item)} key={item} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs transition hover:border-violet-300/40 hover:bg-violet-500/10 ${index === 0 ? 'border-violet-300/30 bg-violet-500/10 text-violet-200' : 'border-white/[.1] text-white/60'}`}>{item}</a>)}
        </div>
        <GameRow title="Featured samples" eyebrow="A FIRST LOOK AT THE ARCADIA CATALOG" games={featuredGames} savedSlugs={saved} onSave={toggleSave} onPlay={startGame} returnTo={exploreHref} />
        <GameRow title="Multiplayer ideas" eyebrow="BUILT FOR SHARED PLAY" games={games.filter((game) => game.multiplayer)} savedSlugs={saved} onSave={toggleSave} onPlay={startGame} returnTo={exploreHref} />
        <GameRow title="Recently added" eyebrow="FRESH SAMPLE ENTRIES" games={games.filter((game) => Boolean(game.addedAt)).slice(0, 5)} savedSlugs={saved} onSave={toggleSave} onPlay={startGame} returnTo={exploreHref} />
      </main>
    </>}
    {view === 'explore' && <ExplorePage games={filteredGames.slice(0, 12)} count={filteredGames.length} loading={!ready} query={query} category={category} sort={sort} onQueryChange={setQuery} onCategoryChange={setCategory} onSortChange={setSort} onReset={() => { setQuery(''); setCategory('All'); setSort('Featured') }} savedSlugs={saved} onSave={toggleSave} onPlay={startGame} returnTo={exploreHref} />}
    {view === 'library' && <LibraryPage savedGames={savedGames} playedGames={playedGames} loading={!ready} savedSlugs={saved} onSave={toggleSave} onPlay={startGame} returnTo={exploreHref} />}
    {view === 'game' && (detail ? <GameDetail game={detail} related={games.filter((game) => game.slug !== detail.slug && (game.genre === detail.genre || game.tags.some((tag) => detail.tags.includes(tag)))).slice(0, 4)} saved={saved.includes(detail.slug)} savedSlugs={saved} returnHref={detailReturnHref} onSave={toggleSave} onPlay={startGame} /> : <main className="mx-auto min-h-[70vh] max-w-7xl px-6 py-24"><h1 className="text-3xl font-semibold">Game not found</h1><a className="mt-5 inline-block text-violet-300" href={exploreHref}>Browse all games</a></main>)}
    <Footer />
    {selectedGame && <PlayerModal key={selectedGame.slug} game={selectedGame} onClose={closePlayer} onReport={reportBrokenGame} />}
    <div role="status" aria-live="polite" aria-atomic="true" className={`fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 rounded-xl border border-white/15 bg-[#171925] px-4 py-3 text-sm text-white shadow-2xl transition duration-200 ${toast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}>{toast}</div>
  </div>
}
