'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Play, Shuffle } from 'lucide-react'
import type { Game } from '@/lib/games'

export function HeroSection({ games, onPlay, onRandom }: { games: Game[]; onPlay: (game: Game) => void; onRandom: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  if (!games.length) return null
  const game = games[activeIndex % games.length]

  return <section className="relative isolate mx-auto min-h-[510px] max-w-[1440px] overflow-hidden sm:min-h-[590px]">
    <Image src={game.bannerUrl} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080a12] via-[#080a12]/80 to-[#080a12]/10" />
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080a12] via-transparent to-[#080a12]/20" />
    <div className="relative flex min-h-[510px] items-center px-5 pb-14 pt-12 sm:min-h-[590px] sm:px-12 lg:px-[8%]">
      <div className="max-w-[590px]">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-[.2em] text-violet-200"><span aria-hidden="true" className="size-1.5 rounded-full bg-violet-300 shadow-[0_0_12px_#b69cff]" />FEATURED GAME <span aria-hidden="true" className="mx-1 h-3 w-px bg-white/25" /><span className="text-white/60">{game.genre.toUpperCase()}</span></div>
        <h1 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-.045em] sm:text-6xl lg:text-[76px]">{game.title}<span className="text-violet-300">.</span></h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-white/70 sm:text-[15px]">{game.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-2"><span className="rounded-full border border-white/15 bg-white/[.06] px-3 py-1.5 text-[10px] text-white/75">Browser game</span><span className="rounded-full border border-white/15 bg-white/[.06] px-3 py-1.5 text-[10px] text-white/75">{game.multiplayer ? 'Multiplayer' : 'Single-player'}</span><span className="rounded-full border border-violet-200/20 bg-violet-200/[.08] px-3 py-1.5 text-[10px] text-violet-100/85">Placeholder artwork</span></div>
        <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => onPlay(game)} className="flex min-h-11 items-center gap-2.5 rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#11121a] shadow-xl shadow-violet-950/30 transition hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-200"><Play aria-hidden="true" className="size-4 fill-current" />Play game</button><button onClick={onRandom} className="grid size-11 place-items-center rounded-xl border border-white/20 bg-white/[.07] text-white/85 backdrop-blur transition hover:bg-white/[.13] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-200" aria-label="Choose a random game"><Shuffle aria-hidden="true" className="size-4" /></button></div>
      </div>
    </div>
    <div className="absolute bottom-6 right-5 flex items-center gap-4 sm:bottom-8 sm:right-12">
      <span className="font-mono text-xs text-white/55"><span className="sr-only">Featured game </span>{String(activeIndex + 1).padStart(2, '0')}<span className="px-1.5">/</span>{String(games.length).padStart(2, '0')}</span>
      <div className="flex gap-1.5" role="group" aria-label="Select featured game">
        {games.map((item, index) => <button key={item.slug} aria-label={`Show featured game ${index + 1}: ${item.title}`} aria-pressed={activeIndex === index} onClick={() => setActiveIndex(index)} className={`h-1 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-200 ${activeIndex === index ? 'w-8 bg-violet-300' : 'w-3 bg-white/40 hover:bg-white/75'}`} />)}
      </div>
    </div>
  </section>
}
