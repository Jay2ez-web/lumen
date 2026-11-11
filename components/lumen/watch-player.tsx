'use client'

import { useState } from 'react'
import { ExternalLink, Film, LoaderCircle } from 'lucide-react'
import type { WatchItem } from '@/lib/watch'

const allowedEmbedOrigins = new Set(['https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://player.vimeo.com'])

function safeEmbedUrl(value?: string) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && allowedEmbedOrigins.has(url.origin) ? url.href : null
  } catch {
    return null
  }
}

export function WatchPlayer({ item, autoplay, progress, onProgress }: { item: WatchItem; autoplay: boolean; progress?: number; onProgress: (seconds: number) => void }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const embedUrl = safeEmbedUrl(item.embedUrl)

  if (item.videoUrl) {
    return <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
      <video controls autoPlay={autoplay} preload="metadata" className="size-full" src={item.videoUrl} title={item.title} onLoadedMetadata={(event) => { if (progress && progress > 0) event.currentTarget.currentTime = progress }} onTimeUpdate={(event) => onProgress(event.currentTarget.currentTime)} onEnded={() => onProgress(0)}>
        <track kind="captions" />
      </video>
    </div>
  }

  if (embedUrl && !failed) {
    return <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
      {!loaded && <div role="status" className="absolute inset-0 z-10 grid place-items-center bg-[#0b0c13] text-sm text-white/60"><LoaderCircle className="mr-2 size-4 animate-spin text-emerald-200" />Loading {item.title}…</div>}
      <iframe title={item.title} src={embedUrl} className="size-full border-0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
    </div>
  }

  return <div className="grid aspect-video place-items-center rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_20%,rgba(124,92,255,.22),transparent_50%),#0b0c13] px-6 text-center">
    <div className="max-w-sm"><span className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[.04] text-emerald-200"><Film className="size-5" /></span><h2 className="mt-4 text-lg font-semibold">This video is unavailable</h2><p className="mt-2 text-sm leading-6 text-white/50">The source is missing, blocked, or is not an approved embed. LUMEN does not copy or proxy third-party streams.</p>{item.embedUrl && <a href={item.embedUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-emerald-200 hover:text-white">Open listed source <ExternalLink className="size-3.5" /></a>}</div>
  </div>
}
