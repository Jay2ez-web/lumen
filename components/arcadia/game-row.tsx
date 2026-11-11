'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { GameCard } from '@/components/arcadia/game-card'
import type { Game } from '@/lib/games'

export function GameRow({ title, eyebrow, games, savedSlugs, onSave, onPlay, returnTo, actionHref = '/explore' }: { title: string; eyebrow?: string; games: Game[]; savedSlugs: string[]; onSave: (game: Game) => void; onPlay: (game: Game) => void; returnTo?: string; actionHref?: string }) {
  if (!games.length) return null
  return <section className="mb-11" aria-label={title}>
    <div className="mb-4 flex items-end justify-between gap-4"><div>{eyebrow && <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.2em] text-violet-300">{eyebrow}</p>}<h2 className="text-xl font-semibold tracking-tight">{title}</h2></div><Link href={actionHref} className="inline-flex shrink-0 items-center gap-1 rounded-sm text-xs text-white/55 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-200">Browse all<ArrowRight aria-hidden="true" className="size-3.5" /></Link></div>
    <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-3" tabIndex={0} aria-label={`${title} game cards`}>
      {games.map((game) => <GameCard key={game.slug} game={game} compact saved={savedSlugs.includes(game.slug)} onSave={() => onSave(game)} onPlay={() => onPlay(game)} returnTo={returnTo} />)}
    </div>
  </section>
}
