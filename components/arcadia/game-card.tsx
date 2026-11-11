'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bookmark, Play } from 'lucide-react'
import { buildGameHref, type Game } from '@/lib/games'

export function GameCard({ game, saved, onSave, onPlay, compact = false, returnTo }: { game: Game; saved: boolean; onSave: () => void; onPlay: () => void; compact?: boolean; returnTo?: string }) {
  const detailHref = buildGameHref(game.slug, returnTo)
  return <article className={`group min-w-0 ${compact ? 'w-[230px] shrink-0 min-[420px]:w-[250px] sm:w-[275px]' : ''}`}>
    <div className="relative overflow-hidden rounded-2xl border border-white/[.08] bg-[#111421]">
      <Link href={detailHref} className="relative block aspect-[16/10] overflow-hidden" aria-label={`View details for ${game.title}`}>
        <Image src={game.thumbnailUrl} alt={`${game.title} placeholder artwork`} fill sizes={compact ? '275px' : '(max-width: 420px) 100vw, (max-width: 768px) 50vw, 25vw'} unoptimized className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <span className="absolute inset-0 bg-gradient-to-t from-[#080a12]/70 via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute left-3 top-3 rounded-md border border-white/15 bg-[#0a0b13]/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-[.1em] text-white/90 backdrop-blur">{game.featured ? 'Featured game' : 'Browser game'}</span><span className="absolute bottom-3 right-3 rounded-md border border-white/15 bg-[#0a0b13]/70 px-2 py-1 text-[9px] font-medium text-white/85 backdrop-blur">Placeholder art</span>
      </Link>
      <button aria-label={saved ? `Remove ${game.title} from library` : `Save ${game.title} to library`} aria-pressed={saved} onClick={onSave} className={`absolute right-3 top-3 grid size-10 place-items-center rounded-lg border backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-200 ${saved ? 'border-violet-300/40 bg-violet-500/80 text-white' : 'border-white/15 bg-black/45 text-white/85 hover:bg-violet-500'}`}><Bookmark aria-hidden="true" className={`size-4 ${saved ? 'fill-current' : ''}`} /></button>
      <button onClick={onPlay} className="absolute bottom-3 left-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-3.5 text-xs font-semibold text-[#10111b] shadow-lg transition hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-200" aria-label={`Play ${game.title}`}><Play aria-hidden="true" className="size-3.5 fill-current" />Play</button>
    </div>
    <div className="flex items-start justify-between gap-3 pt-3"><div className="min-w-0"><Link href={detailHref} className="block truncate text-sm font-semibold transition hover:text-violet-300 focus-visible:rounded-sm">{game.title}</Link><p className="mt-1 truncate text-[11px] text-white/50">{`${game.genre} · ${game.provider}`}</p></div><span className="mt-0.5 shrink-0 text-[10px] text-white/45">Browser</span></div>
  </article>
}

export function GameCardSkeleton() {
  return <div aria-hidden="true" className="min-w-0 animate-pulse">
    <div className="aspect-[16/10] rounded-2xl border border-white/[.06] bg-white/[.055]" />
    <div className="mt-3 h-4 w-3/5 rounded bg-white/[.07]" />
    <div className="mt-2 h-3 w-2/5 rounded bg-white/[.045]" />
  </div>
}
