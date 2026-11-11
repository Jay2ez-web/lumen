import type { ReactNode } from 'react'

export function ContentRow({ title, eyebrow, href, children }: { title: string; eyebrow?: string; href?: string; children: ReactNode }) {
  return <section className="mb-10" aria-labelledby={`row-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="relative pl-3">{eyebrow && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.18em] text-violet-300/80">{eyebrow}</p>}<span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-0.5 rounded-full bg-gradient-to-b from-violet-300 to-blue-400"/><h2 id={`row-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2></div>
      {href && <a href={href} className="group rounded-lg px-2 py-1 text-xs text-white/45 transition hover:bg-white/[.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200">See all <span aria-hidden="true" className="ml-1 transition group-hover:translate-x-0.5">→</span></a>}
    </div>
    {children}
  </section>
}
