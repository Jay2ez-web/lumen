'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Gamepad2, MessageCircle, Play, Shuffle, Sparkles, Tv, Users, Wrench } from 'lucide-react'
import type { Game } from '@/lib/games'
import { apps, type AppItem } from '@/lib/apps'
import { watchItems, type WatchItem } from '@/lib/watch'
import { AppCard } from '@/components/lumen/app-card'
import { ContentRow } from '@/components/lumen/content-row'
import { GameCard } from '@/components/lumen/game-card'
import { QuickLaunch } from '@/components/lumen/quick-launch'
import { WatchCard } from '@/components/lumen/watch-card'

export function HomeDashboard({ games, savedGames, savedApps, watchlist, recentGames, recentWatch, onPlay, onSaveGame, onSaveWatch, onSaveApp, onSurprise }: { games: Game[]; savedGames: string[]; savedApps: string[]; watchlist: string[]; recentGames: Game[]; recentWatch: WatchItem[]; onPlay: (game: Game) => void; onSaveGame: (game: Game) => void; onSaveWatch: (item: WatchItem) => void; onSaveApp: (item: AppItem) => void; onSurprise: () => void }) {
  const featured = games.find((game) => game.featured) ?? games[0]
  const [greeting, setGreeting] = useState('Good afternoon')
  useEffect(() => { const hour = new Date().getHours(); setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening') }, [])

  return <div className="space-y-10 pb-6">
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="mb-2 text-[11px] font-medium tracking-wide text-violet-200/75">{greeting}, welcome back.</p>
        <h1 className="text-3xl font-semibold tracking-[-.045em] text-white sm:text-[42px]">What do you want to do?</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">A focused place for a quick game, a good watch, useful tools, and people to share them with.</p>
      </div>
      <button onClick={onSurprise} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[.035] px-3.5 text-xs font-medium text-white/70 transition hover:border-violet-300/25 hover:bg-violet-300/10 hover:text-white"><Shuffle className="size-3.5"/>Surprise me</button>
    </header>

    <section className="relative overflow-hidden rounded-[28px] border border-white/[.1] bg-[#11131d] shadow-[0_24px_80px_rgba(0,0,0,.18)]" aria-label="Start here">
      <div aria-hidden="true" className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(circle at 82% 22%, ${featured?.accent ?? '#9b87f5'}55, transparent 26%), radial-gradient(circle at 92% 100%, ${featured?.secondaryAccent ?? '#263b87'}88, transparent 38%), linear-gradient(130deg, #11131d 0%, #17152b 58%, #10131d 100%)` }} />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[46%] opacity-25 [mask-image:linear-gradient(90deg,transparent,black)] sm:block" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
      <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_280px] lg:p-11">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-violet-200"><span className="size-1.5 rounded-full bg-violet-300 shadow-[0_0_14px_rgba(196,181,253,.9)]"/>Start here <span className="text-white/25">/</span> Featured now</div>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">{featured?.title}<span className="text-violet-300">.</span></h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/55">{featured?.description}</p>
          <div className="mt-7 flex flex-wrap gap-3"><button onClick={() => featured && onPlay(featured)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-[#11121a] shadow-lg shadow-violet-950/20 transition hover:bg-violet-100"><Play className="size-3.5 fill-current"/>Play now</button><Link href="/games" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[.04] px-4 text-xs text-white/75 transition hover:bg-white/[.1]">Explore games<ArrowRight className="size-3.5"/></Link></div>
        </div>
        <div className="flex flex-col justify-end gap-3 lg:pt-20"><div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm"><div className="flex items-center justify-between text-[10px] text-white/45"><span>Featured game</span><span className="text-emerald-200">Ready to play</span></div><div className="mt-4 flex items-end justify-between gap-4"><span className="text-5xl font-light text-white/70">{featured?.symbol}</span><span className="text-right text-xs text-white/45">{featured?.genre}<br/><strong className="font-medium text-white/75">{featured?.provider}</strong></span></div></div><button onClick={onSurprise} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.035] text-xs text-white/65 transition hover:bg-white/[.08] hover:text-white"><Sparkles className="size-3.5 text-violet-200"/>Find something unexpected</button></div>
      </div>
    </section>

    <QuickLaunch />

    <section className="grid gap-3 sm:grid-cols-3" aria-label="LUMEN destinations">
      {[{ href: '/games', label: 'Games', detail: `${games.length} titles`, icon: Gamepad2, color: 'text-violet-200 bg-violet-400/10' }, { href: '/watch', label: 'Watch', detail: `${watchItems.length} open-licensed picks`, icon: Tv, color: 'text-blue-200 bg-blue-400/10' }, { href: '/apps', label: 'Apps', detail: `${apps.length} small tools`, icon: Wrench, color: 'text-cyan-200 bg-cyan-400/10' }].map(({ href, label, detail, icon: Icon, color }) => <Link key={href} href={href} className="group flex items-center gap-3 rounded-2xl border border-white/[.08] bg-white/[.025] p-4 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[.05]"><span className={`grid size-10 place-items-center rounded-xl ${color}`}><Icon className="size-4"/></span><span className="min-w-0 flex-1"><strong className="block text-sm font-medium">{label}</strong><span className="mt-1 block truncate text-[10px] text-white/40">{detail}</span></span><ArrowUpRight className="size-4 text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70"/></Link>)}
    </section>

    {!!recentGames.length && <ContentRow title="Continue playing" eyebrow="PICK UP WHERE YOU LEFT OFF" href="/library"><div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 xl:grid-cols-3">{recentGames.slice(0, 3).map((game) => <GameCard key={game.slug} game={game} saved={savedGames.includes(game.slug)} onSave={() => onSaveGame(game)} onPlay={() => onPlay(game)}/>)}</div></ContentRow>}
    {!!recentWatch.length && <ContentRow title="Continue watching" eyebrow="PICK UP WHERE YOU LEFT OFF" href="/watch"><div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 xl:grid-cols-3">{recentWatch.slice(0, 3).map((item) => <WatchCard key={item.slug} item={item} saved={watchlist.includes(item.slug)} onSave={() => onSaveWatch(item)}/>)}</div></ContentRow>}
    <ContentRow title="Popular games" eyebrow="A GOOD PLACE TO START" href="/games"><div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 xl:grid-cols-3">{games.slice(0, 3).map((game) => <GameCard key={game.slug} game={game} saved={savedGames.includes(game.slug)} onSave={() => onSaveGame(game)} onPlay={() => onPlay(game)}/>)}</div></ContentRow>
    <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]"><ContentRow title="Recommended watch" eyebrow="OPEN-LICENSED SHORTS" href="/watch"><div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2">{watchItems.slice(0, 2).map((item) => <WatchCard key={item.slug} item={item} saved={watchlist.includes(item.slug)} onSave={() => onSaveWatch(item)}/>)}</div></ContentRow><section className="rounded-2xl border border-violet-300/10 bg-[linear-gradient(145deg,rgba(139,92,246,.13),rgba(255,255,255,.025))] p-5 sm:p-6"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-violet-300/10 text-violet-100"><MessageCircle className="size-4"/></span><span className="flex items-center gap-1.5 text-[10px] text-emerald-200"><span className="size-1.5 rounded-full bg-emerald-300"/>Local demo</span></div><p className="mt-7 text-[10px] font-semibold uppercase tracking-[.2em] text-violet-200/75">The commons</p><h2 className="mt-2 text-xl font-semibold tracking-tight">Talk to people in LUMEN.</h2><p className="mt-2 text-xs leading-5 text-white/45">Drop into the local room. Messages stay in this browser until realtime sync is connected.</p><Link href="/chat" className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-3.5 text-xs text-white/75 transition hover:bg-white/[.08]">Open chat<Users className="size-3.5"/></Link></section></div>
    <ContentRow title="Recently added apps" eyebrow="SMALL TOOLS, RIGHT HERE" href="/apps"><div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 xl:grid-cols-3">{apps.slice(0, 3).map((app) => <AppCard key={app.slug} app={app} saved={savedApps.includes(app.slug)} onSave={() => onSaveApp(app)}/>)}</div></ContentRow>
  </div>
}
