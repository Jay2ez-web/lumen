import Image from 'next/image'
import { notFound } from 'next/navigation'
import { gameBySlug } from '@/lib/games'

export default async function GamePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const game = gameBySlug(slug)
  if (!game) notFound()

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        boxSizing: 'border-box',
        padding: 20,
        background: '#090a11',
        color: '#f7f7fb',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <section
        aria-labelledby="preview-title"
        style={{
          position: 'relative',
          width: 'min(100%, 960px)',
          height: 'min(calc(100vh - 40px), 680px)',
          minHeight: 360,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,.14)',
          borderRadius: 20,
          background: '#111421',
          boxShadow: '0 24px 80px rgba(0,0,0,.42)',
          isolation: 'isolate',
        }}
      >
        <Image
          src={game.bannerUrl}
          alt={`Game artwork for ${game.title}`}
          fill
          sizes="(max-width: 960px) 100vw, 960px"
          unoptimized
          style={{ objectFit: 'cover', zIndex: -2 }}
        />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'linear-gradient(180deg, rgba(6,8,18,.12) 10%, rgba(6,8,18,.18) 42%, rgba(6,8,18,.94) 100%)' }} />
        <div style={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ border: '1px solid rgba(255,255,255,.2)', borderRadius: 999, background: 'rgba(9,10,17,.58)', padding: '8px 12px', color: '#e9ddff', fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' }}>
            Sample build · not final gameplay
          </span>
          <span style={{ border: '1px solid rgba(255,255,255,.15)', borderRadius: 999, background: 'rgba(9,10,17,.5)', padding: '8px 12px', color: 'rgba(255,255,255,.72)', fontSize: 10 }}>
            Provider game artwork
          </span>
        </div>
        <div style={{ position: 'absolute', right: 24, bottom: 24, left: 24, zIndex: 1, maxWidth: 700 }}>
          <h1 id="preview-title" style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.05, fontWeight: 750, letterSpacing: '-.035em' }}>
            {game.title}
          </h1>
          <p style={{ maxWidth: 620, margin: '14px 0 0', color: 'rgba(255,255,255,.76)', fontSize: 14, lineHeight: 1.65 }}>
            This page previews the game artwork. Play the provider-hosted game from its details page inside Arcadia.
          </p>
          <p style={{ margin: '16px 0 0', color: 'rgba(255,255,255,.56)', fontSize: 11 }}>
            Provider: {game.provider} <span aria-hidden="true" style={{ padding: '0 6px' }}>·</span> Source type: {game.sourceType}
          </p>
        </div>
      </section>
    </main>
  )
}
