'use client'

import Link from 'next/link'
import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Gamepad2, Menu, Search, X } from 'lucide-react'

type NavbarProps = {
  pathname: string
  query: string
  savedCount: number
  homeHref: string
  exploreHref: string
  libraryHref: string
  onQueryChange: (value: string) => void
  onSearchSubmit: (value: string) => void
}

export function Navbar({ pathname, query, savedCount, homeHref, exploreHref, libraryHref, onQueryChange, onSearchSubmit }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearchSubmit(query)
    setMobileOpen(false)
  }
  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault()
  }
  const searchForm = (compact = false) => <form role="search" onSubmit={submit} className={`flex h-10 items-center gap-2 rounded-xl border border-white/[.09] bg-white/[.035] px-3 ${compact ? 'w-full' : 'w-60'}`}>
    <Search aria-hidden="true" className="size-4 shrink-0 text-white/40" />
    <input value={query} onChange={(event) => onQueryChange(event.target.value)} onKeyDown={handleInputKeyDown} aria-label="Search games" placeholder="Search games..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35" />
    {query && <button type="button" onClick={() => onQueryChange('')} aria-label="Clear search" className="grid size-7 shrink-0 place-items-center rounded-md text-white/45 hover:bg-white/10 hover:text-white"><X className="size-4" /></button>}
    <button type="submit" aria-label="Submit game search" className="grid size-7 shrink-0 place-items-center rounded-md text-white/60 hover:bg-violet-400/15 hover:text-white"><Search className="size-4" /></button>
  </form>

  const links = [
    { label: 'Home', href: homeHref, active: pathname === '/' },
    { label: 'Explore', href: exploreHref, active: pathname.startsWith('/explore') },
    { label: `Library${savedCount ? ` (${savedCount})` : ''}`, href: libraryHref, active: pathname.startsWith('/library') },
  ]

  return <header className="sticky top-0 z-40 border-b border-white/[.07] bg-[#080a12]/90 backdrop-blur-xl">
    <nav aria-label="Main navigation" className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-5 px-4 sm:h-[76px] sm:gap-8 sm:px-8">
      <Link href={homeHref} onClick={() => setMobileOpen(false)} className="flex shrink-0 items-center gap-2.5" aria-label="LUMEN home">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-950/50"><Gamepad2 aria-hidden="true" className="size-5" /></span>
        <span className="text-[19px] font-bold tracking-tight">lumen<span className="text-violet-400">.</span></span>
      </Link>
      <div className="hidden items-center gap-7 md:flex">{links.map((link) => <Link key={link.label} href={link.href} aria-current={link.active ? 'page' : undefined} className={`text-[13px] transition-colors hover:text-white ${link.active ? 'font-medium text-white' : 'text-white/55'}`}>{link.label}</Link>)}</div>
      <div className="ml-auto hidden items-center gap-3 lg:flex">{searchForm()}<Link href={libraryHref} className="rounded-xl border border-white/[.12] px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/[.06]">My library</Link></div>
      <button className="ml-auto grid size-10 place-items-center rounded-lg border border-white/10 md:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen} aria-controls="lumen-mobile-navigation">{mobileOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}</button>
    </nav>
    {mobileOpen && <div id="lumen-mobile-navigation" className="border-t border-white/10 px-4 py-4 md:hidden">{searchForm(true)}<div className="mt-3 grid grid-cols-2 gap-2">{links.map((link) => <Link key={link.label} onClick={() => setMobileOpen(false)} href={link.href} aria-current={link.active ? 'page' : undefined} className="rounded-lg px-3 py-3 text-sm text-white/70 transition hover:bg-white/[.06] hover:text-white">{link.label}</Link>)}</div></div>}
  </header>
}
