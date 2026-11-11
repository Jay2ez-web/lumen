'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, ArrowRight, Bookmark, Gamepad2, Search, Sparkles, Tv, Wrench } from 'lucide-react'
import { apps, appBySlug, type AppItem } from '@/lib/apps'
import { moderateMessage, welcomeMessages, type ChatMessage } from '@/lib/chat'
import { categories as gameCategories, games, gameBySlug, sourceTypeLabel, type Game } from '@/lib/games'
import { searchLumen } from '@/lib/search'
import { readStorage, storageKeys, writeStorage, clearLumenStorage } from '@/lib/storage'
import { watchBySlug, watchItems, type WatchItem } from '@/lib/watch'
import { AppCard } from '@/components/lumen/app-card'
import { AppToolView } from '@/components/lumen/app-tool-view'
import { ChatPanel } from '@/components/lumen/chat-panel'
import { ContentRow } from '@/components/lumen/content-row'
import { EmptyState } from '@/components/lumen/empty-state'
import { Footer } from '@/components/lumen/footer'
import { GameCard } from '@/components/lumen/game-card'
import { HomeDashboard } from '@/components/lumen/home-dashboard'
import { LibraryPage } from '@/components/lumen/library-page'
import { LumenPlayerModal } from '@/components/lumen/player-modal'
import { Navbar } from '@/components/lumen/navbar'
import { SearchOverlay } from '@/components/lumen/search-overlay'
import { SettingsPage, type LumenSettings } from '@/components/lumen/settings-page'
import { Sidebar } from '@/components/lumen/sidebar'
import { WatchCard } from '@/components/lumen/watch-card'
import { WatchPlayer } from '@/components/lumen/watch-player'

const defaultSettings: LumenSettings = { theme: 'dark', reducedMotion: false, autoplay: false, sound: false, chatMuted: false }
const genres = ['All', ...Array.from(new Set(watchItems.flatMap((item) => item.genres))).sort()]

function readReturnHref(pathname: '/games' | '/watch') {
  const fallback = pathname
  const candidate = new URLSearchParams(window.location.search).get('returnTo')
  if (!candidate) return fallback
  try {
    const parsed = new URL(candidate, window.location.origin)
    return parsed.origin === window.location.origin && parsed.pathname === pathname ? `${parsed.pathname}${parsed.search}` : fallback
  } catch { return fallback }
}

export function LumenAppShell() {
  const pathname = usePathname() || '/'
  const [savedGames, setSavedGames] = useState<string[]>([])
  const [recentGames, setRecentGames] = useState<string[]>([])
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [recentWatch, setRecentWatch] = useState<string[]>([])
  const [openedApps, setOpenedApps] = useState<string[]>([])
  const [savedApps, setSavedApps] = useState<string[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(welcomeMessages)
  const [settings, setSettings] = useState<LumenSettings>(defaultSettings)
  const [watchProgress, setWatchProgress] = useState<Record<string, number>>({})
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [ready, setReady] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [libraryQuery, setLibraryQuery] = useState('')
  const [catalogQuery, setCatalogQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Featured')
  const [watchQuery, setWatchQuery] = useState('')
  const [watchGenre, setWatchGenre] = useState('All')
  const [appCategory, setAppCategory] = useState('All')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [gameReturnHref, setGameReturnHref] = useState('/games')
  const [watchReturnHref, setWatchReturnHref] = useState('/watch')
  const [notice, setNotice] = useState('')
  const [chatNotice, setChatNotice] = useState('')
  const [hiddenChatUsers, setHiddenChatUsers] = useState<string[]>([])
  const lastChatSend = useRef(0)
  const lastProgressWrite = useRef(0)

  useEffect(() => {
    setSavedGames(readStorage(storageKeys.savedGames, []))
    setRecentGames(readStorage(storageKeys.recentlyPlayed, []))
    setWatchlist(readStorage(storageKeys.watchlist, []))
    setRecentWatch(readStorage(storageKeys.recentlyWatched, []))
    setOpenedApps(readStorage(storageKeys.openedApps, []))
    setSavedApps(readStorage(storageKeys.savedApps, []))
    setChatMessages(readStorage(storageKeys.chatMessages, welcomeMessages))
    setSettings({ ...defaultSettings, ...readStorage(storageKeys.appSettings, {}) })
    setWatchProgress(readStorage(storageKeys.watchProgress, {}))
    setRecentSearches(readStorage(storageKeys.recentSearches, []))
    const params = new URLSearchParams(window.location.search)
    setSearchQuery(params.get('q') ?? '')
    setCatalogQuery(params.get('q') ?? '')
    setCategory(params.get('category') ?? 'All')
    setWatchQuery(params.get('q') ?? '')
    setWatchGenre(params.get('category') ?? 'All')
    setSort(params.get('sort') ?? 'Featured')
    setReady(true)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true) }
      if (event.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 2600); return () => window.clearTimeout(timer) }, [notice])
  useEffect(() => { if (!chatNotice) return; const timer = window.setTimeout(() => setChatNotice(''), 3200); return () => window.clearTimeout(timer) }, [chatNotice])

  useEffect(() => {
    setGameReturnHref(readReturnHref('/games'))
    setWatchReturnHref(readReturnHref('/watch'))
  }, [pathname])

  useEffect(() => {
    if (!ready) return
    const gameSlug = pathname.match(/^\/games\/([^/]+)$/)?.[1]
    const watchSlug = pathname.match(/^\/watch\/([^/]+)$/)?.[1]
    const appSlug = pathname.match(/^\/apps\/([^/]+)$/)?.[1]
    if (watchSlug && watchBySlug(watchSlug)) {
      setRecentWatch((current) => { const next = [watchSlug, ...current.filter((item) => item !== watchSlug)].slice(0, 12); writeStorage(storageKeys.recentlyWatched, next); return next })
    }
    if (appSlug && appBySlug(appSlug)) {
      setOpenedApps((current) => { const next = [appSlug, ...current.filter((item) => item !== appSlug)].slice(0, 12); writeStorage(storageKeys.openedApps, next); return next })
    }
    if (gameSlug && gameBySlug(gameSlug)) setSelectedGame(null)
  }, [pathname, ready])

  const showNotice = useCallback((message: string) => setNotice(message), [])
  const reportGame = useCallback((game: Game) => {
    const report = `LUMEN game report\\nGame: ${game.title}\\nProvider: ${game.provider}\\nPlay URL: ${game.playUrl}`
    if (!navigator.clipboard?.writeText) { showNotice(`Please report ${game.title} with its provider and URL.`); return }
    void navigator.clipboard.writeText(report).then(() => showNotice('Game report details copied to your clipboard'), () => showNotice(`Please report ${game.title} with its provider and URL.`))
  }, [showNotice])
  const saveGame = useCallback((game: Game) => setSavedGames((current) => { const next = current.includes(game.slug) ? current.filter((slug) => slug !== game.slug) : [game.slug, ...current]; writeStorage(storageKeys.savedGames, next); showNotice(next.includes(game.slug) ? `${game.title} saved to your library` : `${game.title} removed from your library`); return next }), [showNotice])
  const playGame = useCallback((game: Game) => { setRecentGames((current) => { const next = [game.slug, ...current.filter((slug) => slug !== game.slug)].slice(0, 12); writeStorage(storageKeys.recentlyPlayed, next); return next }); setSelectedGame(game) }, [])
  const saveWatch = useCallback((item: WatchItem) => setWatchlist((current) => { const next = current.includes(item.slug) ? current.filter((slug) => slug !== item.slug) : [item.slug, ...current]; writeStorage(storageKeys.watchlist, next); showNotice(next.includes(item.slug) ? `${item.title} added to your watchlist` : `${item.title} removed from your watchlist`); return next }), [showNotice])
  const saveApp = useCallback((item: AppItem) => setSavedApps((current) => { const next = current.includes(item.slug) ? current.filter((slug) => slug !== item.slug) : [item.slug, ...current]; writeStorage(storageKeys.savedApps, next); showNotice(next.includes(item.slug) ? `${item.name} saved to your library` : `${item.name} removed from your library`); return next }), [showNotice])
  const closeSearch = () => {
    const term = searchQuery.trim()
    if (term) { const next = [term, ...recentSearches.filter((item) => item.toLocaleLowerCase() !== term.toLocaleLowerCase())].slice(0, 6); setRecentSearches(next); writeStorage(storageKeys.recentSearches, next) }
    setSearchOpen(false)
  }
  const searchResults = useMemo(() => searchLumen(searchQuery), [searchQuery])
  const exploreResults = useMemo(() => category === 'All' ? searchResults : searchResults.filter((result) => result.kind === 'game' && (category === 'Multiplayer' ? result.item.multiplayer : result.item.genre === category)), [category, searchResults])
  const visibleGames = useMemo(() => {
    const q = catalogQuery.trim().toLocaleLowerCase()
    const filtered = games.filter((game) => (!q || `${game.title} ${game.description} ${game.genre} ${game.provider}`.toLocaleLowerCase().includes(q)) && (category === 'All' || (category === 'Multiplayer' ? game.multiplayer : game.genre === category)))
    return sort === 'A–Z' ? [...filtered].sort((a, b) => a.title.localeCompare(b.title)) : sort === 'Recently added' ? [...filtered].sort((a, b) => (b.addedAt ?? '').localeCompare(a.addedAt ?? '')) : [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured))
  }, [catalogQuery, category, sort])
  const visibleWatch = useMemo(() => watchItems.filter((item) => (!watchQuery.trim() || `${item.title} ${item.description} ${item.genres.join(' ')}`.toLocaleLowerCase().includes(watchQuery.trim().toLocaleLowerCase())) && (watchGenre === 'All' || item.genres.includes(watchGenre))), [watchQuery, watchGenre])
  const visibleApps = useMemo(() => apps.filter((item) => appCategory === 'All' || item.category === appCategory), [appCategory])
  const recentGameItems = recentGames.map((slug) => gameBySlug(slug)).filter((item): item is Game => Boolean(item))
  const recentWatchItems = recentWatch.map((slug) => watchBySlug(slug)).filter((item): item is WatchItem => Boolean(item))

  const sendChat = (body: string) => {
    const now = Date.now()
    if (now - lastChatSend.current < 1400) { setChatNotice('Please wait a moment before sending another message.'); return }
    const moderated = moderateMessage(body)
    if (!moderated.ok) { setChatNotice(moderated.reason); return }
    lastChatSend.current = now
    const message: ChatMessage = { id: crypto.randomUUID(), userId: 'you', username: 'You', body: moderated.body, createdAt: new Date().toISOString() }
    setChatMessages((current) => { const next = [...current, message].slice(-120); writeStorage(storageKeys.chatMessages, next); return next })
  }
  const chatAction = (kind: 'report' | 'mute' | 'block', message: ChatMessage) => {
    if (kind === 'report') setChatNotice('Message reported for local review. This demo does not send a report to a server.')
    else { setHiddenChatUsers((current) => current.includes(message.userId) ? current : [...current, message.userId]); setChatNotice(`${message.username} ${kind === 'mute' ? 'muted' : 'blocked'} in this session.`) }
  }
  const changeSettings = (next: LumenSettings) => { setSettings(next); writeStorage(storageKeys.appSettings, next) }
  const clearData = () => {
    if (!window.confirm('Clear all LUMEN data saved in this browser? This cannot be undone.')) return
    clearLumenStorage(); setSavedGames([]); setRecentGames([]); setWatchlist([]); setRecentWatch([]); setOpenedApps([]); setSavedApps([]); setChatMessages(welcomeMessages); setSettings(defaultSettings); setWatchProgress({}); setRecentSearches([]); showNotice('LUMEN local data cleared')
  }
  const updateWatchProgress = (item: WatchItem, currentTime: number) => {
    if (Math.abs(currentTime - lastProgressWrite.current) < 8) return
    lastProgressWrite.current = currentTime
    setWatchProgress((current) => { const next = { ...current, [item.slug]: currentTime }; writeStorage(storageKeys.watchProgress, next); return next })
  }
  const updateExploreQuery = (value: string) => {
    setSearchQuery(value)
    const params = new URLSearchParams(window.location.search)
    if (value.trim()) params.set('q', value.trim()); else params.delete('q')
    const target = params.size ? `/explore?${params.toString()}` : '/explore'
    window.history.replaceState(window.history.state, '', target)
  }
  const updateExploreCategory = (value: string) => {
    setCategory(value)
    const params = new URLSearchParams(window.location.search)
    if (value === 'All') params.delete('category'); else params.set('category', value)
    const target = params.size ? `/explore?${params.toString()}` : '/explore'
    window.history.replaceState(window.history.state, '', target)
  }
  const updateCatalogQuery = (value: string) => {
    setCatalogQuery(value)
    const params = new URLSearchParams(window.location.search)
    if (value.trim()) params.set('q', value.trim()); else params.delete('q')
    const target = params.size ? `/games?${params.toString()}` : '/games'
    window.history.replaceState(window.history.state, '', target)
  }
  const updateCatalogCategory = (value: string) => {
    setCategory(value)
    const params = new URLSearchParams(window.location.search)
    if (value === 'All') params.delete('category'); else params.set('category', value)
    const target = params.size ? `/games?${params.toString()}` : '/games'
    window.history.replaceState(window.history.state, '', target)
  }
  const updateWatchQuery = (value: string) => {
    setWatchQuery(value)
    const params = new URLSearchParams(window.location.search)
    if (value.trim()) params.set('q', value.trim()); else params.delete('q')
    const target = params.size ? `/watch?${params.toString()}` : '/watch'
    window.history.replaceState(window.history.state, '', target)
  }
  const updateWatchGenre = (value: string) => {
    setWatchGenre(value)
    const params = new URLSearchParams(window.location.search)
    if (value === 'All') params.delete('category'); else params.set('category', value)
    const target = params.size ? `/watch?${params.toString()}` : '/watch'
    window.history.replaceState(window.history.state, '', target)
  }
  const catalogParams = new URLSearchParams()
  if (catalogQuery.trim()) catalogParams.set('q', catalogQuery.trim())
  if (category !== 'All') catalogParams.set('category', category)
  if (sort !== 'Featured') catalogParams.set('sort', sort)
  const catalogHref = catalogParams.size ? `/games?${catalogParams.toString()}` : '/games'
  const watchParams = new URLSearchParams()
  if (watchQuery.trim()) watchParams.set('q', watchQuery.trim())
  if (watchGenre !== 'All') watchParams.set('category', watchGenre)
  const watchHref = watchParams.size ? `/watch?${watchParams.toString()}` : '/watch'

  const routeGameSlug = pathname.match(/^\/games\/([^/]+)$/)?.[1]
  const routeWatchSlug = pathname.match(/^\/watch\/([^/]+)$/)?.[1]
  const routeAppSlug = pathname.match(/^\/apps\/([^/]+)$/)?.[1]
  const gameDetail = routeGameSlug ? gameBySlug(routeGameSlug) : undefined
  const watchDetail = routeWatchSlug ? watchBySlug(routeWatchSlug) : undefined
  const appDetail = routeAppSlug ? appBySlug(routeAppSlug) : undefined
  const style = settings.theme === 'dim' ? { backgroundColor: '#11141d' } : { backgroundColor: '#080a12' }
  const sectionTitle = pathname === '/' ? 'Home' : pathname.startsWith('/games') ? 'Games' : pathname.startsWith('/watch') ? 'Watch' : pathname.startsWith('/apps') ? 'Apps' : pathname.startsWith('/chat') ? 'Chat' : pathname.startsWith('/library') ? 'Library' : pathname.startsWith('/settings') ? 'Settings' : 'Explore'

  return <div data-reduced-motion={settings.reducedMotion || undefined} className="min-h-screen text-white" style={style}>
    <Navbar pathname={pathname} savedCount={savedGames.length + watchlist.length + savedApps.length} onSearch={() => setSearchOpen(true)} onProfile={() => showNotice('Sign-in and cloud sync are coming soon. Your current library stays on this device.')} />
    <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-8 sm:py-8 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-8"><Sidebar pathname={pathname}/><main className="min-w-0">
      {pathname === '/' && <HomeDashboard games={games} savedGames={savedGames} savedApps={savedApps} watchlist={watchlist} recentGames={recentGameItems} recentWatch={recentWatchItems} onPlay={playGame} onSaveGame={saveGame} onSaveWatch={saveWatch} onSaveApp={saveApp} onSurprise={() => games.length && playGame(games[Math.floor(Math.random() * games.length)])}/>}
      {(pathname === '/games' || pathname === '/explore') && <>
        {pathname === '/games' ? <><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[9px] font-semibold uppercase tracking-[.2em] text-violet-200/75">Play something new</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Games</h1><p className="mt-2 text-xs text-white/50">Browser games from their listed providers, organized in one place.</p></div><span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-white/45">{games.length} titles</span></div><div className="mt-6 flex flex-wrap items-center gap-2"><div className="flex min-h-10 min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[.025] px-3 sm:max-w-sm"><Search className="size-4 text-white/40"/><input value={catalogQuery} onChange={(event) => updateCatalogQuery(event.target.value)} aria-label="Search games" placeholder="Search games..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-white/35"/></div><select value={sort} onChange={(event) => { setSort(event.target.value); const params = new URLSearchParams(window.location.search); if (event.target.value === 'Featured') params.delete('sort'); else params.set('sort', event.target.value); window.history.replaceState(window.history.state, '', params.size ? `/games?${params.toString()}` : '/games') }} aria-label="Sort games" className="min-h-10 rounded-xl border border-white/10 bg-[#171925] px-3 text-xs"><option>Featured</option><option>A–Z</option><option>Recently added</option></select></div><div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Filter games by genre">{gameCategories.map((item) => <button key={item} onClick={() => updateCatalogCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-3 py-2 text-[10px] transition ${category === item ? 'border-violet-300/30 bg-violet-400/10 text-violet-100' : 'border-white/10 text-white/50 hover:bg-white/[.04]'}`}>{item}</button>)}</div><div className="mt-5">{!ready ? <div role="status" className="py-12 text-center text-xs text-white/45">Loading your games…</div> : visibleGames.length ? <div className="grid grid-cols-1 gap-x-4 gap-y-7 min-[440px]:grid-cols-2 xl:grid-cols-3">{visibleGames.map((game) => <GameCard key={game.slug} game={game} saved={savedGames.includes(game.slug)} onSave={() => saveGame(game)} onPlay={() => playGame(game)} returnTo={catalogHref}/>)}</div> : <EmptyState icon={Search} title="No games found" description="Try a different search or clear the selected genre." action={<button onClick={() => { setCatalogQuery(''); setCategory('All') }} className="text-xs text-violet-200 hover:text-white">Reset filters</button>}/>}</div></> : <><div><p className="text-[9px] font-semibold uppercase tracking-[.2em] text-violet-200/75">Search all of LUMEN</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Explore</h1><p className="mt-2 text-xs text-white/50">Find something to play, watch, or open.</p></div><div className="mt-5 flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[.025] px-4"><Search className="size-4 text-violet-200"/><input value={searchQuery} onChange={(event) => updateExploreQuery(event.target.value)} placeholder="Search games, videos, and apps..." aria-label="Search games, videos, and apps" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"/><button onClick={() => updateExploreQuery('')} aria-label="Clear search" className="text-xs text-white/45 hover:text-white">Clear</button></div><div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Filter Explore by game category">{gameCategories.map((item) => <button key={item} onClick={() => updateExploreCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-3 py-2 text-[10px] ${category === item ? 'border-violet-300/30 bg-violet-400/10 text-violet-100' : 'border-white/10 text-white/50'}`}>{item}</button>)}</div><div className="mt-5">{searchQuery.trim() ? <div className="space-y-2">{exploreResults.length ? exploreResults.map((result) => <Link key={result.href} href={result.href} className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.02] p-3 hover:bg-white/[.05]"><span className="grid size-10 place-items-center rounded-xl bg-violet-400/10 text-[9px] font-semibold uppercase text-violet-100">{result.kind}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{result.title}</span><span className="mt-1 block truncate text-[10px] text-white/45">{result.description}</span></span><ArrowRight className="size-4 text-white/35"/></Link>) : <EmptyState icon={Search} title="No results found" description="Try another title, genre, or mini app."/>}</div> : <div className="grid gap-3 sm:grid-cols-3">{[{ title: 'Games', description: 'Play a browser game', href: '/games', icon: Gamepad2 }, { title: 'Watch', description: 'Explore open-licensed shorts', href: '/watch', icon: Tv }, { title: 'Apps', description: 'Open useful mini tools', href: '/apps', icon: Wrench }].map(({ title, description, href, icon: Icon }) => <Link key={href} href={href} className="rounded-2xl border border-white/[.08] bg-[#10121b] p-4 transition hover:border-violet-300/20"><span className="grid size-9 place-items-center rounded-xl bg-violet-400/10 text-violet-200"><Icon aria-hidden="true" className="size-4"/></span><h2 className="mt-3 text-sm font-semibold">{title}</h2><p className="mt-1 text-[10px] text-white/45">{description}</p></Link>)}</div>}</div></>}</>}
      {pathname === '/watch' && <><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[9px] font-semibold uppercase tracking-[.2em] text-blue-200/75">Approved viewing</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Watch</h1><p className="mt-2 text-xs text-white/50">Short films and open-licensed videos, with clear source labels.</p></div><span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-white/45">{watchItems.filter((item) => item.videoUrl || item.embedUrl).length} playable samples</span></div><div className="mt-5 flex flex-wrap gap-2"><div className="flex min-h-10 min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[.025] px-3 sm:max-w-sm"><Search className="size-4 text-white/40"/><input value={watchQuery} onChange={(event) => updateWatchQuery(event.target.value)} aria-label="Search videos" placeholder="Search Watch..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-white/35"/></div><select value={watchGenre} onChange={(event) => updateWatchGenre(event.target.value)} aria-label="Filter videos by genre" className="min-h-10 rounded-xl border border-white/10 bg-[#171925] px-3 text-xs">{genres.map((item) => <option key={item}>{item}</option>)}</select></div><ContentRow title="Featured short" eyebrow="OPEN-ANIMATION PROJECT"><div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 xl:grid-cols-3">{visibleWatch.map((item) => <WatchCard key={item.slug} item={item} saved={watchlist.includes(item.slug)} onSave={() => saveWatch(item)} returnTo={watchHref}/>)}</div></ContentRow></>}
      {watchDetail && <div><Link href={watchReturnHref} className="mb-5 inline-flex min-h-9 items-center gap-2 text-xs text-white/50 hover:text-white"><ArrowLeft className="size-3.5"/>Back to Watch</Link><div className="mb-5"><p className="text-[9px] uppercase tracking-[.2em] text-blue-200/70">{watchDetail.type} · {watchDetail.year}</p><h1 className="mt-2 text-3xl font-semibold">{watchDetail.title}</h1></div><WatchPlayer item={watchDetail} autoplay={settings.autoplay} progress={watchProgress[watchDetail.slug]} onProgress={(seconds) => updateWatchProgress(watchDetail, seconds)} /><div className="mt-5 flex flex-wrap items-start justify-between gap-4"><div className="max-w-2xl"><p className="text-sm leading-6 text-white/65">{watchDetail.description}</p><p className="mt-3 text-[10px] text-white/40">{watchDetail.provider} · {watchDetail.duration} · {watchDetail.genres.join(' · ')}</p>{watchDetail.licenseUrl && <a href={watchDetail.licenseUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-xs text-violet-200 hover:text-white">View license</a>}{watchProgress[watchDetail.slug] > 0 && <p className="mt-2 text-[10px] text-white/40">Progress saved at {Math.floor(watchProgress[watchDetail.slug] / 60)}:{String(Math.floor(watchProgress[watchDetail.slug] % 60)).padStart(2,'0')} on this device.</p>}</div><button onClick={() => saveWatch(watchDetail)} aria-pressed={watchlist.includes(watchDetail.slug)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-4 text-xs text-white/75 hover:bg-white/[.05]"><Bookmark className="size-3.5"/>{watchlist.includes(watchDetail.slug) ? 'In watchlist' : 'Add to watchlist'}</button></div><ContentRow title="More to watch" href="/watch"><div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 xl:grid-cols-3">{watchItems.filter((item) => item.slug !== watchDetail.slug).map((item) => <WatchCard key={item.slug} item={item} saved={watchlist.includes(item.slug)} onSave={() => saveWatch(item)} returnTo={watchHref}/>)}</div></ContentRow></div>}
      {pathname === '/apps' && <><div><p className="text-[9px] font-semibold uppercase tracking-[.2em] text-cyan-200/75">Small tools, one home</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Apps</h1><p className="mt-2 text-xs text-white/50">Useful mini apps without leaving LUMEN.</p></div><div className="scrollbar-hide mt-5 flex gap-2 overflow-x-auto pb-2">{['All', ...Array.from(new Set(apps.map((item) => item.category)))].map((item) => <button key={item} onClick={() => setAppCategory(item)} aria-pressed={appCategory === item} className={`shrink-0 rounded-full border px-3 py-2 text-[10px] ${appCategory === item ? 'border-violet-300/30 bg-violet-400/10 text-violet-100' : 'border-white/10 text-white/50'}`}>{item}</button>)}</div><div className="mt-4 grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 xl:grid-cols-3">{visibleApps.map((app) => <AppCard key={app.slug} app={app} saved={savedApps.includes(app.slug)} onSave={() => saveApp(app)}/>)}</div></>}
      {appDetail && <><Link href="/apps" className="mb-5 inline-flex min-h-9 items-center gap-2 text-xs text-white/50 hover:text-white"><ArrowLeft className="size-3.5"/>Back to Apps</Link><AppToolView key={appDetail.slug} app={appDetail}/></>}
      {pathname === '/chat' && <><div className="mb-5"><p className="text-[9px] font-semibold uppercase tracking-[.2em] text-violet-200/75">Community</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Chat</h1><p className="mt-2 text-xs text-white/50">A local prototype room. Messages are saved only in this browser.</p></div><ChatPanel messages={chatMessages.filter((message) => !hiddenChatUsers.includes(message.userId))} onlineCount={4} notice={chatNotice} onSend={sendChat} onAction={chatAction} onEmoji={() => setChatNotice('Emoji picker is planned for a future update.')}/></>}
      {pathname === '/library' && <LibraryPage games={games} watchItems={watchItems} apps={apps} savedGames={savedGames} recentGames={recentGames} watchlist={watchlist} recentWatch={recentWatch} savedApps={savedApps} openedApps={openedApps} onSaveGame={saveGame} onPlayGame={playGame} onSaveWatch={saveWatch} onSaveApp={saveApp} query={libraryQuery} onQuery={setLibraryQuery}/>}
      {pathname === '/settings' && <SettingsPage settings={settings} onChange={changeSettings} onClear={clearData}/>}
      {gameDetail && <div><Link href={gameReturnHref} className="mb-5 inline-flex min-h-9 items-center gap-2 text-xs text-white/50 hover:text-white"><ArrowLeft className="size-3.5"/>Back to Games</Link><section className="relative isolate overflow-hidden rounded-[24px] border border-white/[.1] bg-[#11131d]" style={{ background: `radial-gradient(ellipse at 80% 15%, ${gameDetail.accent}55, transparent 34%), radial-gradient(ellipse at 25% 100%, ${gameDetail.secondaryAccent}77, transparent 45%), linear-gradient(110deg,#11131d,#171526)` }}><div className="px-5 py-10 sm:px-10 sm:py-14"><p className="text-[9px] uppercase tracking-[.2em] text-violet-200">{gameDetail.genre} · {sourceTypeLabel(gameDetail.sourceType)}</p><span className="mt-5 block text-6xl text-white/70" aria-hidden="true">{gameDetail.symbol}</span><h1 className="mt-4 text-3xl font-semibold sm:text-5xl">{gameDetail.title}</h1><p className="mt-3 max-w-lg text-xs leading-6 text-white/60">{gameDetail.description}</p><div className="mt-6 flex flex-wrap gap-2"><button onClick={() => playGame(gameDetail)} className="min-h-11 rounded-xl bg-white px-5 text-xs font-semibold text-[#11121a] hover:bg-violet-100">Play game</button><button onClick={() => saveGame(gameDetail)} aria-pressed={savedGames.includes(gameDetail.slug)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-xs text-white/75 hover:bg-white/[.05]"><Bookmark className="size-3.5"/>{savedGames.includes(gameDetail.slug) ? 'Saved' : 'Save to library'}</button></div></div></section><div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-white/40"><span>Source: {gameDetail.provider} · Game links open from their listed provider.</span>{gameDetail.licenseUrl && <a href={gameDetail.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-violet-200 hover:text-white">View license</a>}</div><ContentRow title="More games"><div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 xl:grid-cols-3">{games.filter((item) => item.slug !== gameDetail.slug).slice(0,3).map((game) => <GameCard key={game.slug} game={game} saved={savedGames.includes(game.slug)} onSave={() => saveGame(game)} onPlay={() => playGame(game)} returnTo={gameReturnHref}/>)}</div></ContentRow></div>}
      {pathname !== '/' && !['/games','/explore','/watch','/apps','/chat','/library','/settings'].includes(pathname) && !gameDetail && !watchDetail && !appDetail && <div className="py-14 text-center"><EmptyState icon={Sparkles} title={`${sectionTitle} not found`} description="This LUMEN destination is not available yet." action={<Link href="/" className="text-xs text-violet-200">Return home</Link>}/></div>}
    </main></div>
    <Footer />
    {selectedGame && <LumenPlayerModal key={selectedGame.slug} game={selectedGame} onClose={() => setSelectedGame(null)} onReport={reportGame}/>}
    {searchOpen && <SearchOverlay query={searchQuery} results={searchResults} recentSearches={recentSearches} onQuery={setSearchQuery} onClose={closeSearch} onClearRecent={() => { setRecentSearches([]); writeStorage(storageKeys.recentSearches, []) }} onPickRecent={(value) => setSearchQuery(value)}/>}
    <div role="status" aria-live="polite" aria-atomic="true" className={`fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 rounded-xl border border-white/15 bg-[#171925] px-4 py-3 text-xs text-white shadow-2xl transition duration-200 ${notice ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}>{notice}</div>
  </div>
}
