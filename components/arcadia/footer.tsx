import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'

export function Footer() {
  return <footer className="border-t border-white/[.07]">
    <div className="mx-auto flex max-w-[1260px] flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm font-semibold focus-visible:rounded-sm"><span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500"><Gamepad2 aria-hidden="true" className="size-4"/></span>LUMEN<span className="text-violet-400">.</span></Link>
      <p className="max-w-md text-[11px] leading-5 text-white/40">Game thumbnails come from the listed game providers or the reference site; their artwork and trademarks belong to their respective owners.</p>
      <div className="flex gap-5 text-[11px] text-white/45"><Link href="/explore" className="rounded-sm hover:text-white">Explore</Link><Link href="/library" className="rounded-sm hover:text-white">Library</Link><span>© 2026 LUMEN</span></div>
    </div>
  </footer>
}
