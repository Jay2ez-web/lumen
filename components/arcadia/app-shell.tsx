'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownWideNarrow, ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, Compass, Expand, Gamepad2, Heart, Menu, Play, Search, Shuffle, Sparkles, X, Zap } from 'lucide-react'
import { categories, gameBySlug, games, type Game } from '@/lib/games'

type RouteProps = { view: 'home' | 'explore' | 'library' | 'game'; slug?: string }

export function ArcadiaApp({ view, slug }: RouteProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [saved, setSaved] = useState<string[]>([])
  const [played, setPlayed] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Featured')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [player, setPlayer] = useState(false)
  const [pageCount, setPageCount] = useState(12)

  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem('arcadia-saved') || '[]'))
      setPlayed(JSON.parse(localStorage.getItem('arcadia-played') || '[]'))
    } catch { setSaved([]); setPlayed([]) }
  }, [])

  const toggleSave = (game: Game) => {
    setSaved((current) => {
      const next = current.includes(game.slug) ? current.filter((id) => id !== game.slug) : [game.slug, ...current]
      localStorage.setItem('arcadia-saved', JSON.stringify(next))
      return next
    })
  }
  const startGame = (game: Game) => {
    setPlayed((current) => {
      const next = [game.slug, ...current.filter((item) => item !== game.slug)].slice(0, 12)
      localStorage.setItem('arcadia-played', JSON.stringify(next))
      return next
    })
    setPlayer(true)
  }
  const filtered = useMemo(() => {
    let result = games.filter((game) => {
      const matchesText = `${game.title} ${game.genre} ${game.description}`.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || category === 'HTML5' || (category === 'Multiplayer' ? game.tags.includes('Multiplayer') : game.genre === category)
      return matchesText && matchesCategory
    })
    if (sort === 'Featured') result = [...result].sort((a, b) => Number(b.tags.includes('Featured')) - Number(a.tags.includes('Featured')))
    if (sort === 'A–Z') result = [...result].sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'Recently added') result = [...result].sort((a, b) => Number(Boolean(b.added)) - Number(Boolean(a.added)))
    return result
  }, [query, category, sort])
  const featured = games[0]
  const detail = slug ? gameBySlug(slug) : undefined
  const picked = (ids: string[]) => ids.map((id) => gameBySlug(id)).filter((game): game is Game => Boolean(game))
  const openRandom = () => router.push(`/games/${games[Math.floor(Math.random() * games.length)].slug}`)

  return <div className="min-h-screen bg-[#080a12] text-white">
    <Navbar pathname={pathname} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} query={query} setQuery={setQuery} />
    {view === 'home' && <HomePage saved={saved} toggleSave={toggleSave} startGame={startGame} openRandom={openRandom} onSearch={(text) => { setQuery(text); router.push('/explore') }} />}
    {view === 'explore' && <ExplorePage games={filtered.slice(0, pageCount)} count={filtered.length} category={category} setCategory={setCategory} query={query} setQuery={setQuery} sort={sort} setSort={setSort} saved={saved} toggleSave={toggleSave} onLoadMore={() => setPageCount((count) => count + 12)} />}
    {view === 'library' && <LibraryPage saved={picked(saved)} played={picked(played)} onSave={toggleSave} onPlay={startGame} />}
    {view === 'game' && (detail ? <GameDetail game={detail} related={games.filter((g) => g.slug !== detail.slug && (g.genre === detail.genre || g.tags.some((tag) => detail.tags.includes(tag)))).slice(0, 4)} saved={saved.includes(detail.slug)} onSave={() => toggleSave(detail)} onPlay={() => startGame(detail)} /> : <main className="mx-auto max-w-7xl px-6 py-24"><h1 className="text-3xl font-semibold">Game not found</h1><Link className="mt-5 inline-block text-violet-300" href="/explore">Browse all games →</Link></main>)}
    <Footer />
    {player && <PlayerModal game={detail ?? featured} onClose={() => setPlayer(false)} />}
  </div>
}

function Navbar({ pathname, mobileOpen, setMobileOpen, query, setQuery }: { pathname: string; mobileOpen: boolean; setMobileOpen: (value: boolean) => void; query: string; setQuery: (value: string) => void }) {
  const links = [['Home', '/'], ['Explore', '/explore'], ['Categories', '/explore'], ['Library', '/library']]
  return <header className="sticky top-0 z-40 border-b border-white/[.07] bg-[#080a12]/90 backdrop-blur-xl">
    <nav aria-label="Main navigation" className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-8 px-5 sm:px-8">
      <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Arcadia home"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-950/50"><Gamepad2 className="size-5" /></span><span className="text-[19px] font-bold tracking-tight">arcadia<span className="text-violet-400">.</span></span></Link>
      <div className="hidden items-center gap-7 md:flex">{links.map(([label, href]) => <Link key={label} href={href} className={`text-[13px] transition-colors hover:text-white ${pathname === href ? 'font-medium text-white' : 'text-white/55'}`}>{label}</Link>)}</div>
      <div className="ml-auto flex items-center gap-3">
        <label className="hidden h-10 w-52 items-center gap-2 rounded-xl border border-white/[.09] bg-white/[.035] px-3.5 lg:flex"><Search className="size-4 text-white/40" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search games" placeholder="Search games..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-white/35" /></label>
        <Link href="/library" className="hidden items-center gap-2 rounded-xl border border-white/[.12] px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/[.06] sm:flex">Sign in</Link>
        <button className="grid size-10 place-items-center rounded-lg border border-white/10 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen}>{mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>
    </nav>
    {mobileOpen && <div className="border-t border-white/10 px-5 py-4 md:hidden"><div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2"><Search className="size-4 text-white/45" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search games" placeholder="Search games..." className="w-full bg-transparent text-sm outline-none" /></div><div className="grid grid-cols-2 gap-2">{links.map(([label, href]) => <Link key={label} onClick={() => setMobileOpen(false)} href={href} className="rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/[.06]">{label}</Link>)}</div></div>}
  </header>
}

function Art({ game, className = '' }: { game: Game; className?: string }) {
  return <div className={`game-art relative isolate overflow-hidden ${className}`} style={{ background: game.artwork }}><div className="art-orb" style={{ background: `radial-gradient(circle, ${game.accent}8c 0%, ${game.accent}20 36%, transparent 70%)` }} /><div className="art-grid" /><span className="art-symbol" style={{ color: game.accent }}>{game.symbol ?? '◈'}</span><span className="art-horizon" /></div>
}

function GameCard({ game, saved, onSave, compact = false }: { game: Game; saved: boolean; onSave: () => void; compact?: boolean }) {
  return <article className={`group min-w-0 ${compact ? 'w-[245px] shrink-0 sm:w-[275px]' : ''}`}><div className="relative overflow-hidden rounded-2xl border border-white/[.08] bg-[#111421]">
    <Link href={`/games/${game.slug}`} className="block" aria-label={`View ${game.title}`}><Art game={game} className="aspect-[16/10] transition-transform duration-500 group-hover:scale-[1.04]"/><div className="absolute inset-0 grid place-items-center bg-[#080a12]/0 transition-colors group-hover:bg-[#080a12]/30"><span className="grid size-12 scale-90 place-items-center rounded-full bg-white text-[#10111b] opacity-0 shadow-xl transition-all group-hover:scale-100 group-hover:opacity-100"><Play className="ml-0.5 size-5 fill-current" /></span></div></Link>
    <div className="absolute left-3 top-3 flex gap-1.5">{game.tags.slice(0, 1).map((tag) => <span key={tag} className="rounded-md border border-white/15 bg-[#0a0b13]/55 px-2 py-1 text-[9px] font-semibold uppercase tracking-[.1em] text-white/85 backdrop-blur">{tag}</span>)}</div>
    <button aria-label={saved ? `Remove ${game.title} from library` : `Save ${game.title}`} aria-pressed={saved} onClick={onSave} className={`absolute right-3 top-3 grid size-8 place-items-center rounded-lg border backdrop-blur transition ${saved ? 'border-violet-300/40 bg-violet-500/80 text-white' : 'border-white/15 bg-black/35 text-white/80 hover:bg-violet-500'}`}><Bookmark className={`size-4 ${saved ? 'fill-current' : ''}`} /></button>
    </div><div className="flex items-start justify-between gap-3 pt-3"><div className="min-w-0"><Link href={`/games/${game.slug}`} className="block truncate text-[14px] font-semibold transition hover:text-violet-300">{game.title}</Link><p className="mt-1 text-[11px] text-white/45">{game.genre} <span className="px-1 text-white/20">·</span> Browser</p></div><span className="mt-0.5 shrink-0 text-[10px] text-white/45">{game.embedUrl ? 'Embedded' : 'Publisher site'}</span></div>
  </article>
}

function GameRow({ title, eyebrow, list, saved, toggleSave, action }: { title: string; eyebrow?: string; list: Game[]; saved: string[]; toggleSave: (game: Game) => void; action?: string }) {
  if (!list.length) return null
  return <section className="mb-11"><div className="mb-4 flex items-end justify-between"><div>{eyebrow && <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.22em] text-violet-300">{eyebrow}</p>}<h2 className="text-xl font-semibold tracking-tight">{title}</h2></div>{action && <Link href="/explore" className="flex items-center gap-1 text-xs text-white/45 transition hover:text-white">{action}<ArrowRight className="size-3.5" /></Link>}</div><div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">{list.map((game) => <GameCard key={game.slug} game={game} compact saved={saved.includes(game.slug)} onSave={() => toggleSave(game)} />)}</div></section>
}

function HomePage({ saved, toggleSave, startGame, openRandom, onSearch }: { saved: string[]; toggleSave: (game: Game) => void; startGame: (game: Game) => void; openRandom: () => void; onSearch: (text: string) => void }) {
  const [active, setActive] = useState(0)
  const spotlight = games
  const feature = spotlight[active]
  return <main>
    <section className="relative mx-auto min-h-[590px] max-w-[1440px] overflow-hidden sm:min-h-[620px]">
      <Art game={feature} className="absolute inset-0"/><div className="hero-noise absolute inset-0"/><div className="absolute inset-0 bg-gradient-to-r from-[#080a12] via-[#080a12]/80 to-[#080a12]/10"/><div className="absolute inset-0 bg-gradient-to-t from-[#080a12] via-transparent to-[#080a12]/20"/>
      <div className="relative flex min-h-[590px] items-center px-6 pb-12 pt-16 sm:min-h-[620px] sm:px-12 lg:px-[8%]"><div className="max-w-[590px]">
        <div className="mb-6 flex items-center gap-2 text-[10px] font-semibold tracking-[.22em] text-violet-200"><span className="size-1.5 rounded-full bg-violet-300 shadow-[0_0_12px_#b69cff]"/>FEATURED GAME <span className="mx-1 h-3 w-px bg-white/25"/><span className="text-white/50">{feature.genre.toUpperCase()}</span></div>
        <h1 className="max-w-xl text-5xl font-semibold leading-[1.04] tracking-[-.055em] sm:text-6xl lg:text-[76px]">{feature.title}<span className="text-violet-300">.</span></h1><p className="mt-5 max-w-md text-sm leading-7 text-white/65 sm:text-[15px]">{feature.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-2">{['Free to play', 'Browser', feature.tags.includes('Multiplayer') ? 'Multiplayer' : 'Instant play'].map((item) => <span key={item} className="rounded-full border border-white/15 bg-white/[.06] px-3 py-1.5 text-[10px] text-white/75">{item}</span>)}</div>
        <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => startGame(feature)} className="flex items-center gap-2.5 rounded-xl bg-white px-5 py-3.5 text-xs font-bold text-[#11121a] shadow-xl shadow-violet-950/30 transition hover:bg-violet-100"><Play className="size-4 fill-current"/>Play now</button><Link href={`/games/${feature.slug}`} className="rounded-xl border border-white/20 bg-white/[.07] px-5 py-3.5 text-xs font-semibold backdrop-blur transition hover:bg-white/[.13]">View details</Link><button onClick={openRandom} className="grid size-11 place-items-center rounded-xl border border-white/20 bg-white/[.07] text-white/80 backdrop-blur transition hover:bg-white/[.13]" aria-label="Surprise me with a random game"><Shuffle className="size-4"/></button></div>
      </div></div>
      <div className="absolute bottom-9 right-6 flex items-center gap-4 sm:right-12"><span className="font-mono text-xs text-white/40">0{active + 1}<span className="px-1.5">/</span>0{spotlight.length}</span><div className="flex gap-1.5" aria-label="Featured game slides">{spotlight.map((game, index) => <button key={game.slug} aria-label={`Show featured game ${index + 1}: ${game.title}`} aria-pressed={active === index} onClick={() => setActive(index)} className={`h-1 rounded-full transition-all ${active === index ? 'w-8 bg-violet-300' : 'w-3 bg-white/35 hover:bg-white/70'}`} />)}</div></div>
      <span className="absolute bottom-9 left-6 flex items-center gap-2 text-[10px] tracking-wide text-white/40 sm:left-12"><span className="grid size-6 place-items-center rounded-full border border-white/20"><ArrowDownWideNarrow className="size-3"/></span>YOUR NEXT FAVORITE IS A CLICK AWAY</span>
    </section>
    <div className="mx-auto max-w-[1260px] px-5 sm:px-8">
      <div className="-mt-1 mb-11 flex gap-2 overflow-x-auto pb-1">{categories.slice(1, 8).map((item, index) => <Link href={`/explore?category=${item}`} key={item} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs transition hover:border-violet-300/40 hover:bg-violet-500/10 ${index === 0 ? 'border-violet-300/30 bg-violet-500/10 text-violet-200' : 'border-white/[.1] text-white/60'}`}>{item}</Link>)}<button onClick={() => onSearch('')} className="flex shrink-0 items-center gap-2 rounded-full border border-white/[.1] px-4 py-2.5 text-xs text-white/60 hover:border-violet-300/40"><Search className="size-3.5"/>Discover all</button></div>
      <GameRow title="Playable now" eyebrow="REAL GAMES, READY IN YOUR BROWSER" list={games.filter((game) => game.embedUrl)} saved={saved} toggleSave={toggleSave} action="See all"/>
      <GameRow title="Play on the publisher site" eyebrow="OPENED DIRECTLY FROM ITS SOURCE" list={games.filter((game) => !game.embedUrl)} saved={saved} toggleSave={toggleSave} action="Explore games"/>
      <GameRow title="Recently added" eyebrow="FRESH FROM THE ARCADE" list={games.filter((game) => game.added)} saved={saved} toggleSave={toggleSave} action="View new games"/>
      <section className="pb-16"><div className="mb-5 flex items-end justify-between"><div><p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.22em] text-violet-300">THE WHOLE ARCADE</p><h2 className="text-xl font-semibold">All games <span className="ml-1 text-sm font-normal text-white/35">{games.length}</span></h2></div><Link href="/explore" className="flex items-center gap-1 text-xs text-white/45 hover:text-white">Browse all<ArrowRight className="size-3.5"/></Link></div><div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">{games.slice(0, 8).map((game) => <GameCard key={game.slug} game={game} saved={saved.includes(game.slug)} onSave={() => toggleSave(game)}/>)}</div></section>
    </div>
  </main>
}

function ExplorePage({ games: visible, count, category, setCategory, query, setQuery, sort, setSort, saved, toggleSave, onLoadMore }: { games: Game[]; count: number; category: string; setCategory: (value: string) => void; query: string; setQuery: (value: string) => void; sort: string; setSort: (value: string) => void; saved: string[]; toggleSave: (game: Game) => void; onLoadMore: () => void }) {
  return <main className="mx-auto min-h-[75vh] max-w-[1260px] px-5 pb-20 pt-14 sm:px-8"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.22em] text-violet-300">FIND YOUR NEXT OBSESSION</p><div className="flex flex-wrap items-end justify-between gap-5"><div><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Explore games<span className="text-violet-300">.</span></h1><p className="mt-3 text-sm text-white/50">A whole world of play, no downloads required.</p></div><span className="text-xs text-white/40">{count} games to discover</span></div>
    <div className="mt-9 flex flex-wrap gap-3"><label className="flex h-11 min-w-[240px] flex-1 items-center gap-2.5 rounded-xl border border-white/10 bg-white/[.035] px-3.5 sm:max-w-sm"><Search className="size-4 text-white/40"/><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search games" placeholder="Search titles, genres..." className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"/></label><label className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[.035] px-3.5 text-xs text-white/60"><span className="sr-only">Sort games</span><ChevronDown className="size-3.5"/><select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent outline-none"><option className="bg-[#121420]">Featured</option><option className="bg-[#121420]">Featured</option><option className="bg-[#121420]">A–Z</option><option className="bg-[#121420]">Recently added</option></select></label></div>
    <div className="scrollbar-hide mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Filter by category">{categories.map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-2 text-xs transition ${category === item ? 'border-violet-300/40 bg-violet-500/15 text-violet-200' : 'border-white/[.1] text-white/55 hover:border-white/25 hover:text-white'}`}>{item}</button>)}</div>
    {visible.length ? <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">{visible.map((game) => <GameCard key={game.slug} game={game} saved={saved.includes(game.slug)} onSave={() => toggleSave(game)}/>)}</div> : <div className="grid min-h-[300px] place-items-center"><div className="text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[.04]"><Search className="size-5 text-white/45"/></span><h2 className="mt-4 text-lg font-semibold">No games found</h2><p className="mt-1 text-sm text-white/45">Try a different search or category.</p><button onClick={() => { setQuery(''); setCategory('All') }} className="mt-4 text-xs font-medium text-violet-300 hover:text-violet-200">Clear filters</button></div></div>}
    {visible.length < count && <div className="mt-12 text-center"><button onClick={onLoadMore} className="rounded-xl border border-white/15 px-5 py-3 text-xs font-medium transition hover:bg-white/[.06]">Load more games</button></div>}
  </main>
}

function LibraryPage({ saved, played, onSave, onPlay }: { saved: Game[]; played: Game[]; onSave: (game: Game) => void; onPlay: (game: Game) => void }) {
  return <main className="mx-auto min-h-[75vh] max-w-[1260px] px-5 pb-20 pt-14 sm:px-8"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.22em] text-violet-300">YOUR PERSONAL ARCADE</p><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Your library<span className="text-violet-300">.</span></h1><p className="mt-3 text-sm text-white/50">All your saved games, right where you left them.</p></div><button className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/65 transition hover:bg-white/[.06]">Sign in to sync</button></div>
    <div className="mt-10 flex items-center gap-3 rounded-2xl border border-violet-300/15 bg-gradient-to-r from-violet-500/[.1] to-indigo-500/[.04] p-4 sm:p-5"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-400/15 text-violet-200"><Sparkles className="size-5"/></span><div><h2 className="text-sm font-semibold">Pick up where you left off</h2><p className="mt-1 text-xs text-white/50">Sign in to keep your collection safe across devices.</p></div><button className="ml-auto hidden shrink-0 rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-[#11121a] sm:block">Sign in</button></div>
    <section className="mt-11"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Saved games <span className="ml-1 text-sm font-normal text-white/35">{saved.length}</span></h2></div>{saved.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">{saved.map((game) => <GameCard key={game.slug} game={game} saved onSave={() => onSave(game)}/>)}</div> : <div className="rounded-2xl border border-dashed border-white/[.12] py-12 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/[.04]"><Bookmark className="size-5 text-white/40"/></span><h3 className="mt-4 text-sm font-semibold">Your library is waiting</h3><p className="mt-1 text-xs text-white/45">Save a game with the bookmark icon to find it here.</p><Link href="/explore" className="mt-4 inline-block text-xs text-violet-300 hover:text-violet-200">Explore games →</Link></div>}</section>
    <section className="mt-12"><h2 className="mb-5 text-xl font-semibold">Recently played <span className="ml-1 text-sm font-normal text-white/35">{played.length}</span></h2>{played.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">{played.map((game) => <GameCard key={game.slug} game={game} saved={saved.some((s) => s.slug === game.slug)} onSave={() => onSave(game)}/>)}</div> : <p className="text-sm text-white/45">Your recent games will show up here.</p>}</section>
  </main>
}

function GameDetail({ game, related, saved, onSave, onPlay }: { game: Game; related: Game[]; saved: boolean; onSave: () => void; onPlay: () => void }) {
  return <main className="mx-auto max-w-[1260px] px-5 pb-20 pt-7 sm:px-8"><Link href="/explore" className="mb-5 inline-flex items-center gap-2 text-xs text-white/50 transition hover:text-white"><ArrowLeft className="size-4"/>All games</Link><div className="relative overflow-hidden rounded-[26px] border border-white/[.1]"><Art game={game} className="aspect-[2.25/1] min-h-[280px] sm:min-h-[370px]"/><div className="absolute inset-0 bg-gradient-to-t from-[#080a12] via-[#080a12]/35 to-transparent"/><div className="absolute inset-x-0 bottom-0 p-6 sm:p-10"><div className="flex flex-wrap items-center gap-2 text-[10px] text-white/65"><span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5">{game.genre}</span><span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5">Browser</span><span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5">Free to play</span></div><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{game.title}<span className="text-violet-300">.</span></h1><div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/65"><span>{game.sourceName}</span>{game.tags.includes('Multiplayer') && <><span>·</span><span>Multiplayer</span></>}</div></div></div>
    <div className="grid gap-10 py-8 lg:grid-cols-[1fr_300px]"><div><h2 className="text-lg font-semibold">About this game</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">{game.description}</p><p className="mt-3 text-xs leading-6 text-white/40">Drop in for a quick round or stay awhile. No installs, no waiting — just open it in your browser and play.</p></div><div className="flex flex-col gap-3"><button onClick={onPlay} className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#11121a] transition hover:bg-violet-100"><Play className="size-4 fill-current"/>Play now</button><button onClick={onSave} aria-pressed={saved} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-xs font-medium transition hover:bg-white/[.06]">{saved ? <Check className="size-4"/> : <Bookmark className="size-4"/>}{saved ? 'Saved to library' : 'Add to library'}</button></div></div>
    {!!related.length && <section className="mt-2"><h2 className="mb-5 text-xl font-semibold">You might also like</h2><div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-4 sm:gap-4">{related.map((item) => <GameCard key={item.slug} game={item} saved={false} onSave={() => {}} />)}</div></section>}
  </main>
}

const approvedEmbedHosts = new Set(['play.eaglercraftranked.com', 'hexgl.bkcore.com', 'www.crazygames.com', 'playgta5.net', 'playgta5.pro', 'csjs.live', 'wasmarcade.com', 'selenite1.freetls.fastly.net', 'territorial.io', 'openfront.io', 'orteil.dashnet.org', 'littlealchemy.com', 'slither.io', 'play.famobi.com', 'freeasteroids.org', 'worldsbiggestpacman.com'])

function GameEmbed({ game }: { game: Game }) {
  const [loading, setLoading] = useState(Boolean(game.embedUrl))
  let approvedUrl: string | null = null
  if (game.embedUrl) {
    try {
      const candidate = new URL(game.embedUrl)
      if (candidate.protocol === 'https:' && approvedEmbedHosts.has(candidate.hostname)) approvedUrl = candidate.href
    } catch {
      approvedUrl = null
    }
  }

  if (!approvedUrl) {
    return <div className="relative z-10 mx-5 flex max-w-md flex-col items-center px-8 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-white/[.06] text-2xl text-violet-300">{game.symbol ?? '◈'}</span>
      <h2 className="mt-4 text-lg font-semibold">Play on {game.sourceName}</h2>
      <p className="mt-2 text-sm leading-6 text-white/50">This publisher serves the game on its own site rather than inside Arcadia.</p>
      <a href={game.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#11121a] transition hover:bg-violet-100">Open game at source <ArrowRight className="size-4" /></a>
    </div>
  }

  return <div className="absolute inset-0 bg-black">
    <iframe title={`${game.title} by ${game.sourceName}`} src={approvedUrl} className="size-full border-0" allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setLoading(false)} />
    {loading && <div className="pointer-events-none absolute inset-0 grid place-items-center bg-[#0a0b13] text-sm text-white/55"><span className="flex items-center gap-3"><span className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-violet-300"/>Loading game from {game.sourceName}…</span></div>}
    <a href={game.sourceUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-3 right-3 z-10 rounded-lg bg-black/70 px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-black hover:text-white">Open at source <ArrowRight className="ml-1 inline size-3" /></a>
  </div>
}

function PlayerModal({ game, onClose }: { game: Game; onClose: () => void }) {
  const playerRef = useRef<HTMLDivElement>(null)
  const fullscreenStateRef = useRef(false)
  const ignoreEscapeUntilRef = useRef(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState<string | null>(null)
  useEffect(() => {
    const syncFullscreen = () => {
      const fullscreenElement = document.fullscreenElement
      const isFullscreen = Boolean(fullscreenElement && playerRef.current?.contains(fullscreenElement))
      if (fullscreenStateRef.current && !isFullscreen) ignoreEscapeUntilRef.current = Date.now() + 250
      fullscreenStateRef.current = isFullscreen
      setFullscreen(isFullscreen)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !fullscreenStateRef.current && Date.now() >= ignoreEscapeUntilRef.current) onClose()
    }
    document.addEventListener('fullscreenchange', syncFullscreen)
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen)
      window.removeEventListener('keydown', handleKeyDown)
      if (document.fullscreenElement && playerRef.current?.contains(document.fullscreenElement)) {
        void document.exitFullscreen().catch(() => undefined)
      }
      document.body.style.overflow = ''
    }
  }, [onClose])
  const goFullscreen = async () => {
    const player = playerRef.current
    if (!player) return
    setFullscreenError(null)
    try {
      if (document.fullscreenElement && player.contains(document.fullscreenElement)) await document.exitFullscreen()
      else await player.requestFullscreen()
    } catch {
      setFullscreenError('Fullscreen was blocked by the browser. Try the game’s own fullscreen control.')
    }
  }
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-black/85 p-3 backdrop-blur-sm sm:p-8" role="dialog" aria-modal="true" aria-label={`${game.title} game player`}><div ref={playerRef} className="arcadia-player flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#10121b] shadow-2xl"><div className="flex h-14 items-center justify-between border-b border-white/10 px-4"><div className="flex items-center gap-2 text-sm font-medium"><span className="size-2 rounded-full bg-violet-300"/>{game.title}<span className="ml-2 hidden text-[10px] text-white/35 sm:inline">BROWSER PLAYER</span></div><div className="flex items-center gap-2"><button onClick={goFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} className="grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"><Expand className="size-4"/></button><button onClick={onClose} aria-label="Close player" className="grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"><X className="size-4"/></button></div></div><div className="arcadia-player-stage relative grid min-h-[460px] flex-1 place-items-center bg-[radial-gradient(ellipse_at_50%_45%,#221b42_0%,#11121d_45%,#090a10_100%)] sm:min-h-[540px]"><div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)', backgroundSize: '48px 48px' }}/>{fullscreenError && <div role="status" className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-lg bg-red-950/90 px-3 py-2 text-xs text-red-100">{fullscreenError}</div>}<GameEmbed game={game}/></div></div></div>
}

function Footer() { return <footer className="border-t border-white/[.07]"><div className="mx-auto flex max-w-[1260px] flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8"><Link href="/" className="flex items-center gap-2 text-sm font-semibold"><span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500"><Gamepad2 className="size-4"/></span>arcadia<span className="text-violet-400">.</span></Link><p className="text-[11px] text-white/35">Publisher-hosted games, linked and embedded with care.</p><div className="flex gap-5 text-[11px] text-white/40"><Link href="/explore" className="hover:text-white">Explore</Link><Link href="/library" className="hover:text-white">Library</Link><span>© 2025 Arcadia</span></div></div></footer> }
