import Link from 'next/link'
import { Bookmark, Gamepad2, Home, MessageCircle, Settings2, Tv, Wrench } from 'lucide-react'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/watch', label: 'Watch', icon: Tv },
  { href: '/apps', label: 'Apps', icon: Wrench },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/library', label: 'Library', icon: Bookmark },
  { href: '/settings', label: 'Settings', icon: Settings2 },
]

export function Sidebar({ pathname }: { pathname: string }) {
  return <aside className="hidden lg:block"><div className="sticky top-24"><p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[.22em] text-white/30">Your space</p><nav aria-label="LUMEN sections" className="flex flex-col gap-1">{items.map(({ href, label, icon: Icon }) => {
    const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
    return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs transition ${active ? 'border border-violet-300/15 bg-violet-400/10 text-white' : 'text-white/50 hover:bg-white/[.04] hover:text-white'}`}><Icon aria-hidden="true" className={`size-4 ${active ? 'text-violet-200' : ''}`} />{label}</Link>
  })}</nav><div className="mt-8 rounded-2xl border border-violet-300/10 bg-[linear-gradient(145deg,rgba(139,92,246,.12),rgba(255,255,255,.025))] p-3.5"><div className="mb-3 flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]"/><span className="text-[9px] font-semibold uppercase tracking-[.16em] text-emerald-200/80">LUMEN is live</span></div><p className="text-[11px] font-medium text-white/80">One place, many moods.</p><p className="mt-1 text-[10px] leading-4 text-white/40">Your library stays on this device until account sync is added.</p></div></div></aside>
}
