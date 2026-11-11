import Link from 'next/link'

export function Footer() {
  return <footer className="mt-12 border-t border-white/[.07]"><div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8"><Link href="/" className="font-semibold tracking-[.18em] text-white/65">LUMEN</Link><p>LUMEN · One place for play, watch, create, and connect.</p><nav aria-label="Footer navigation" className="flex gap-4"><Link href="/settings" className="hover:text-white">Privacy & settings</Link><Link href="/library" className="hover:text-white">Library</Link></nav></div></footer>
}
