'use client'

import { useEffect, useRef, useState } from 'react'
import { Expand, ExternalLink, Flag, RotateCcw, X } from 'lucide-react'
import { sourceTypeLabel, type Game } from '@/lib/games'

const allowedGameOrigins = new Set([
  'https://databallr.com',
  'https://play.eaglercraftranked.com',
  'https://territorial.io',
  'https://littlealchemy.com',
  'https://www.crazygames.com',
  'https://hexgl.bkcore.com',
  'https://play.famobi.com',
  'https://freeasteroids.org',
])

function getSafePlayUrl(game: Game) {
  if (game.sourceType === 'placeholder' || game.sourceType === 'self-hosted') {
    return game.playUrl.startsWith('/') && !game.playUrl.startsWith('//') ? game.playUrl : null
  }
  if (game.sourceType !== 'approved-embed' && game.sourceType !== 'external-link') return null
  try {
    const url = new URL(game.playUrl)
    return url.protocol === 'https:' && allowedGameOrigins.has(url.origin) ? url.href : null
  } catch {
    return null
  }
}

export function PlayerModal({ game, onClose, onReport }: { game: Game; onClose: () => void; onReport: (game: Game) => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const fullscreenRef = useRef(false)
  const ignoreEscapeUntilRef = useRef(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState('')
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [retryCount, setRetryCount] = useState(0)
  const playUrl = getSafePlayUrl(game)

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())
    const onFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement
      const next = Boolean(fullscreenElement && playerRef.current?.contains(fullscreenElement))
      if (fullscreenRef.current && !next) ignoreEscapeUntilRef.current = Date.now() + 300
      fullscreenRef.current = next
      setIsFullscreen(next)
    }
    const onFocusIn = (event: FocusEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) closeButtonRef.current?.focus()
    }
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (Date.now() < ignoreEscapeUntilRef.current) return
        if (document.fullscreenElement && playerRef.current?.contains(document.fullscreenElement)) {
          event.preventDefault()
          void document.exitFullscreen()
          return
        }
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => element.getClientRects().length > 0)
      if (!focusable.length) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('keydown', onKeyDown)
      if (document.fullscreenElement && playerRef.current?.contains(document.fullscreenElement)) void document.exitFullscreen().catch(() => undefined)
      previousFocusRef.current?.focus()
    }
  }, [onClose])

  useEffect(() => {
    if (!playUrl) {
      setLoadState('error')
      return
    }
    if (game.launchMode === 'new-tab') {
      setLoadState('loaded')
      return
    }
    setLoadState('loading')
    const timeout = window.setTimeout(() => setLoadState((current) => current === 'loading' ? 'error' : current), 18000)
    return () => window.clearTimeout(timeout)
  }, [playUrl, retryCount, game.launchMode])

  const toggleFullscreen = async () => {
    const player = playerRef.current
    if (!player) return
    setFullscreenError('')
    try {
      if (document.fullscreenElement && player.contains(document.fullscreenElement)) await document.exitFullscreen()
      else await player.requestFullscreen()
    } catch {
      setFullscreenError('Fullscreen is unavailable in this browser. Try the game preview in a new tab.')
    }
  }

  return <div className="fixed inset-0 z-[60] grid min-w-0 place-items-center overflow-x-hidden bg-black/85 p-2 backdrop-blur-sm min-[480px]:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="lumen-player-title" tabIndex={-1} className="w-full min-w-0 max-w-5xl outline-none">
      <div ref={playerRef} className="lumen-player flex min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#10121b] shadow-2xl">
        <header className="flex min-h-14 min-w-0 items-center justify-between gap-2 border-b border-white/10 px-2 sm:gap-3 sm:px-4">
          <div className="min-w-0"><h2 id="lumen-player-title" className="truncate text-sm font-medium">{game.title}</h2><p className="mt-0.5 truncate text-[10px] text-white/45">{game.provider} <span className="px-1">·</span>{sourceTypeLabel(game.sourceType)}</p></div>
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2"><a href={playUrl ?? undefined} target="_blank" rel="noopener noreferrer" aria-label={`Open ${game.title} in a new tab`} aria-disabled={!playUrl} className={`grid size-8 shrink-0 place-items-center rounded-lg sm:size-10 text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200 ${playUrl ? '' : 'pointer-events-none opacity-40'}`}><ExternalLink aria-hidden="true" className="size-3.5 sm:size-4"/></a><button onClick={() => onReport(game)} className="grid size-8 shrink-0 place-items-center rounded-lg sm:size-10 text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200" aria-label={`Report a broken game: ${game.title}`} title="Copy a report summary"><Flag aria-hidden="true" className="size-3.5 sm:size-4"/></button><button onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-pressed={isFullscreen} className="grid size-8 shrink-0 place-items-center rounded-lg sm:size-10 text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200"><Expand aria-hidden="true" className="size-3.5 sm:size-4"/></button><button ref={closeButtonRef} onClick={onClose} aria-label="Close game player" className="grid size-8 shrink-0 place-items-center rounded-lg sm:size-10 text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200"><X aria-hidden="true" className="size-3.5 sm:size-4"/></button></div>
        </header>
        {fullscreenError && <p role="status" className="border-b border-red-300/15 bg-red-950/50 px-4 py-2 text-xs text-red-100">{fullscreenError}</p>}
        <div className="lumen-player-stage relative min-h-[min(70vh,540px)] flex-1 bg-[#090a10]">
          {game.launchMode !== 'new-tab' && playUrl && loadState !== 'error' && <iframe key={`${game.slug}-${retryCount}`} title={`${game.title} player`} src={playUrl} className="absolute inset-0 size-full border-0" allow="autoplay; fullscreen; gamepad; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" sandbox={game.sourceType === 'approved-embed' || game.launchMode === 'iframe' ? 'allow-scripts allow-same-origin allow-pointer-lock allow-forms' : 'allow-scripts'} onLoad={() => setLoadState('loaded')} onError={() => setLoadState('error')} />}
          {game.launchMode === 'new-tab' && playUrl && <div className="absolute inset-0 z-10 grid place-items-center bg-[#090a10] px-5 text-center"><div className="max-w-sm"><span className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/10 bg-violet-400/10 text-violet-200"><ExternalLink aria-hidden="true" className="size-5"/></span><h3 className="mt-4 text-lg font-semibold">Play from the provider</h3><p className="mt-2 text-sm leading-6 text-white/55">This source cannot start inside LUMEN’s embedded player. Open the provider page in a new tab; it may show its own security check.</p><a href={playUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-[#11121a] hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-200">Launch {game.title}<ExternalLink aria-hidden="true" className="size-3.5"/></a></div></div>}
          {loadState === 'loading' && <div role="status" className="absolute inset-0 z-10 grid place-items-center bg-[#0a0b13] px-5 text-center text-sm text-white/60"><span><span aria-hidden="true" className="mb-3 inline-block size-5 animate-spin rounded-full border-2 border-white/20 border-t-violet-300 align-middle"/> <span className="ml-2">Loading {game.title}…</span></span></div>}
          {loadState === 'error' && <div className="absolute inset-0 z-10 grid place-items-center px-5 text-center"><div className="max-w-sm"><h3 className="text-lg font-semibold">Game could not load</h3><p className="mt-2 text-sm leading-6 text-white/55">The provider may block embedding or the game may be temporarily unavailable.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button onClick={() => setRetryCount((count) => count + 1)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-[#11121a] hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-200"><RotateCcw aria-hidden="true" className="size-3.5"/>Try again</button>{playUrl && <a href={playUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/20 px-4 text-xs font-semibold text-white/80 hover:bg-white/[.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-200">Open in a new tab <ExternalLink aria-hidden="true" className="size-3.5"/></a>}</div></div></div>}
        </div>
        <div className="flex min-h-10 items-center justify-between gap-3 border-t border-white/10 px-3 text-[10px] text-white/40 sm:px-4"><span className="truncate">Game source: {game.provider}</span><div className="flex shrink-0 items-center gap-3"><a href={playUrl ?? undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!playUrl} className="inline-flex min-h-8 items-center gap-1.5 rounded-md text-violet-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-200">Open game in new tab <ExternalLink aria-hidden="true" className="size-3"/></a><span>Esc to close</span></div></div>
      </div>
    </div>
  </div>
}
