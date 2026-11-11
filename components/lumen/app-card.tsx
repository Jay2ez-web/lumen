'use client'

import Link from 'next/link'
import { ArrowUpRight, ArrowLeftRight, Bookmark, CalendarDays, Calculator, Dices, FileText, ListTodo, Music2, NotebookPen, Palette, Pencil, Settings2, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AppItem } from '@/lib/apps'

const icons: Record<string, LucideIcon> = { NotebookPen, Calculator, Timer, ListTodo, Palette, ArrowLeftRight, Pencil, Music2, FileText, CalendarDays, Dices, Settings2 }
const colors: Record<string, string> = { violet: 'from-emerald-500/25 to-indigo-500/10 text-emerald-200', blue: 'from-blue-500/25 to-cyan-500/10 text-blue-200', cyan: 'from-cyan-500/25 to-sky-500/10 text-cyan-200', amber: 'from-amber-500/25 to-orange-500/10 text-amber-200', pink: 'from-pink-500/25 to-rose-500/10 text-pink-200' }

export function AppCard({ app, saved, onSave }: { app: AppItem; saved: boolean; onSave: () => void }) {
  const Icon = icons[app.icon] ?? Calculator
  return <article className="group relative rounded-2xl border border-white/[.08] bg-white/[.025] p-4 shadow-[0_10px_28px_rgba(0,0,0,.08)] transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[.05] hover:shadow-[0_18px_38px_rgba(0,0,0,.2)] sm:p-5"><Link href={app.route} className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200" aria-label={`Open ${app.name}`}><div className="flex items-start justify-between"><span className={`grid size-12 place-items-center rounded-2xl border border-white/[.08] bg-gradient-to-br ${colors[app.color] ?? colors.violet}`}><Icon aria-hidden="true" className="size-5"/></span><ArrowUpRight className="size-4 text-white/20 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70"/></div><h3 className="mt-5 text-sm font-semibold tracking-[-.01em]">{app.name}</h3><p className="mt-1 min-h-10 text-xs leading-5 text-white/45">{app.description}</p><span className="mt-4 inline-flex rounded-full border border-white/[.1] px-2.5 py-1 text-[9px] text-white/40">{app.category}</span></Link><button onClick={onSave} aria-label={saved ? `Remove ${app.name} from library` : `Save ${app.name} to library`} aria-pressed={saved} className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg text-white/35 transition hover:bg-white/[.08] hover:text-white"><Bookmark className={`size-4 ${saved ? 'fill-emerald-300 text-emerald-300' : ''}`}/></button></article>
}
