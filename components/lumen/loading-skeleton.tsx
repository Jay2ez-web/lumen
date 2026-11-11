export function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return <div aria-label="Loading content" role="status" className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 lg:grid-cols-3">{Array.from({ length: count }, (_, index) => <div key={index} aria-hidden="true" className="animate-pulse"><div className="aspect-[16/10] rounded-2xl border border-white/[.06] bg-white/[.055]" /><div className="mt-3 h-4 w-3/5 rounded bg-white/[.07]" /><div className="mt-2 h-3 w-2/5 rounded bg-white/[.045]" /></div>)}</div>
}
