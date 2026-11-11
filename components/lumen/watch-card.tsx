'use client'

import Link from 'next/link'
import { Bookmark, Play } from 'lucide-react'
import type { WatchItem } from '@/lib/watch'

export function WatchCard({ item, saved, onSave, returnTo }: { item: WatchItem; saved: boolean; onSave: () => void; returnTo?: string }) {
  const detailHref = returnTo ? `/watch/${item.slug}?${new URLSearchParams({ returnTo }).toString()}` : `/watch/${item.slug}`
  return <article className="group min-w-0">
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/[.09] bg-[#111421]" style={{ background: 'radial-gradient(ellipse at 70% 20%, rgba(97,131,255,.4), transparent 40%), radial-gradient(ellipse at 20% 90%, rgba(178,116,255,.34), transparent 48%), linear-gradient(135deg, #101421, #21162c)' }}>
      <Link href={detailHref} className="absolute inset-0 flex flex-col justify-between p-4" aria-label={`Open ${item.title}`}><span className="w-fit rounded-md border border-white/15 bg-black/30 px-2 py-1 text-[9px] uppercase tracking-widest text-white/70">{item.type}</span><div aria-hidden="true" className="flex items-center justify-center"><span className="grid size-12 place-items-center rounded-full border border-white/30 bg-white/10 text-white shadow-xl backdrop-blur transition group-hover:scale-110"><Play className="ml-0.5 size-5 fill-current" /></span></div><div className="flex items-end justify-between gap-3"><span className="text-xs text-white/65">{item.year} · {item.duration}</span><span className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-[9px] text-white/70">Licensed sample</span></div></Link>
      <button aria-label={saved ? `Remove ${item.title} from watchlist` : `Add ${item.title} to watchlist`} aria-pressed={saved} onClick={onSave} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-lg border backdrop-blur transition ${saved ? 'border-violet-300/40 bg-violet-500/80 text-white' : 'border-white/15 bg-black/45 text-white/85 hover:bg-violet-500'}`}><Bookmark className={`size-4 ${saved ? 'fill-current' : ''}`} /></button>
    </div>
    <div className="pt-3"><Link href={detailHref} className="block truncate text-sm font-semibold hover:text-violet-300">{item.title}</Link><p className="mt-1 truncate text-[11px] text-white/50">{item.genres.join(' · ')} · {item.provider}</p></div>
  </article>
}
