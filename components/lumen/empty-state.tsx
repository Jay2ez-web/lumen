import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-white/15 bg-white/[.02] px-5 py-10 text-center">
    <span className="mx-auto grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[.04] text-white/60"><Icon aria-hidden="true" className="size-5" /></span>
    <h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-white/50">{description}</p>{action && <div className="mt-4">{action}</div>}
  </div>
}
