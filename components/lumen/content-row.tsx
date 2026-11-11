import type { ReactNode } from 'react'

export function ContentRow({ title, eyebrow, href, children }: { title: string; eyebrow?: string; href?: string; children: ReactNode }) {
  return <section className="mb-10" aria-labelledby={`row-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>{eyebrow && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.18em] text-violet-300/80">{eyebrow}</p>}<h2 id={`row-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2></div>
      {href && <a href={href} className="rounded-md px-2 py-1 text-xs text-white/55 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200">See all</a>}
    </div>
    {children}
  </section>
}
