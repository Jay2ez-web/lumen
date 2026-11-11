'use client'

import Link from 'next/link'
import { Bookmark, Play } from 'lucide-react'
import type { Game } from '@/lib/games'

export function GameCard({ game, saved, onSave, onPlay, returnTo }: { game: Game; saved: boolean; onSave: () => void; onPlay: () => void; returnTo?: string }) {
  const detailHref = returnTo ? `/games/${game.slug}?${new URLSearchParams({ returnTo }).toString()}` : `/games/${game.slug}`
  return <article className="group min-w-0">
    <div className="relative isolate aspect-[16/10] overflow-hidden rounded-2xl border border-white/[.09] bg-[#111421] shadow-[0_12px_30px_rgba(0,0,0,.12)] transition duration-300 group-hover:-translate-y-1 group-hover:border-violet-200/20 group-hover:shadow-[0_18px_38px_rgba(0,0,0,.28)]" style={{ background: `radial-gradient(ellipse at 75% 20%, ${game.accent}66, transparent 42%), radial-gradient(ellipse at 20% 85%, ${game.secondaryAccent}99, transparent 46%), linear-gradient(135deg, #101421, #161126)` }}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: 'linear-gradient(120deg, transparent 35%, rgba(255,255,255,.14) 36%, transparent 37%), linear-gradient(30deg, transparent 67%, rgba(255,255,255,.08) 68%, transparent 69%)' }} />
      <Link href={detailHref} aria-label={`View ${game.title} details`} className="absolute inset-0 grid place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200"><span className="text-6xl font-light text-white/85 drop-shadow-[0_8px_18px_rgba(0,0,0,.35)] transition-transform duration-500 group-hover:scale-110" aria-hidden="true">{game.symbol}</span><span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent"/><span className="absolute bottom-3 left-3 rounded-md border border-white/15 bg-black/45 px-2 py-1 text-[9px] font-medium text-white/75 backdrop-blur">Original LUMEN artwork</span></Link>
      <button aria-label={saved ? `Remove ${game.title} from library` : `Save ${game.title} to library`} aria-pressed={saved} onClick={onSave} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-lg border backdrop-blur transition ${saved ? 'border-violet-300/40 bg-violet-500/80 text-white' : 'border-white/15 bg-black/45 text-white/85 hover:bg-violet-500'}`}><Bookmark aria-hidden="true" className={`size-4 ${saved ? 'fill-current' : ''}`} /></button>
      <button onClick={onPlay} className="absolute bottom-3 right-3 inline-flex min-h-9 items-center gap-2 rounded-lg bg-white px-3 text-xs font-semibold text-[#10111b] shadow-lg transition hover:bg-violet-100" aria-label={`Play ${game.title}`}><Play aria-hidden="true" className="size-3.5 fill-current" />Play</button>
    </div>
    <div className="flex items-start justify-between gap-3 pt-3"><div className="min-w-0"><Link href={detailHref} className="block truncate text-sm font-semibold hover:text-violet-300">{game.title}</Link><p className="mt-1 truncate text-[11px] text-white/50">{game.genre} · {game.provider}</p></div><span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-[9px] text-white/45">Game</span></div>
  </article>
}
