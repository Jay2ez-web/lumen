import Link from 'next/link'
import { ArrowUpRight, Calculator, Gamepad2, MessageCircle, NotebookPen, Timer, Tv } from 'lucide-react'

const shortcuts = [
  { label: 'Games', href: '/games', icon: Gamepad2, tone: 'text-violet-200 bg-violet-400/10' },
  { label: 'Watch', href: '/watch', icon: Tv, tone: 'text-blue-200 bg-blue-400/10' },
  { label: 'Notes', href: '/apps/notes', icon: NotebookPen, tone: 'text-amber-200 bg-amber-400/10' },
  { label: 'Calculator', href: '/apps/calculator', icon: Calculator, tone: 'text-cyan-200 bg-cyan-400/10' },
  { label: 'Timer', href: '/apps/timer', icon: Timer, tone: 'text-pink-200 bg-pink-400/10' },
  { label: 'Chat', href: '/chat', icon: MessageCircle, tone: 'text-violet-200 bg-violet-400/10' },
]

export function QuickLaunch() {
  return <section aria-labelledby="quick-launch-title" className="rounded-2xl border border-white/[.08] bg-white/[.025] p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><h2 id="quick-launch-title" className="text-sm font-semibold">Quick launch</h2><span className="text-[10px] text-white/40">Your LUMEN dock</span></div><div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{shortcuts.map(({ label, href, icon: Icon, tone }) => <Link key={href} href={href} className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-white/[.06] bg-black/10 text-[10px] text-white/65 transition hover:border-white/[.14] hover:bg-white/[.05] hover:text-white"><span className={`grid size-9 place-items-center rounded-xl ${tone}`}><Icon aria-hidden="true" className="size-4" /></span><span>{label}</span></Link>)}</div><Link href="/apps" className="mt-4 inline-flex items-center gap-1 text-[11px] text-violet-200 hover:text-white">Browse all apps <ArrowUpRight aria-hidden="true" className="size-3" /></Link></section>
}
