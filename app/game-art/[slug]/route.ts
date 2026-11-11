import { gameBySlug } from '@/lib/games'

type RouteContext = { params: Promise<{ slug: string }> }

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character] ?? character)
}

function safeColor(value: string, fallback: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback
}

export async function GET(request: Request, { params }: RouteContext) {
  const { slug: rawSlug } = await params
  const slug = rawSlug.endsWith('.svg') ? rawSlug.slice(0, -4) : rawSlug
  const game = gameBySlug(slug)
  if (!game) return new Response('Not found', { status: 404 })

  const accent = safeColor(game.accent, '#a98aff')
  const secondary = safeColor(game.secondaryAccent, '#4d66c8')
  const title = escapeXml(game.title)
  const isBanner = new URL(request.url).searchParams.get('format') === 'banner'
  const width = isBanner ? 1600 : 800
  const height = isBanner ? 720 : 480
  const slugSeed = [...slug].reduce((value, character) => value + character.charCodeAt(0), 0)
  const orbitX = 500 + slugSeed % 180
  const orbitY = 190 + slugSeed % 110
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 800 480" role="img" aria-label="Placeholder artwork for ${title}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b0d18"/><stop offset=".58" stop-color="${secondary}" stop-opacity=".52"/><stop offset="1" stop-color="${accent}" stop-opacity=".34"/></linearGradient><radialGradient id="glow"><stop stop-color="${accent}" stop-opacity=".72"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs><rect width="800" height="480" fill="url(#bg)"/><circle cx="${orbitX}" cy="${orbitY}" r="240" fill="url(#glow)"/><circle cx="${orbitX}" cy="${orbitY}" r="150" fill="none" stroke="${accent}" stroke-opacity=".26" stroke-width="2"/><circle cx="${orbitX}" cy="${orbitY}" r="202" fill="none" stroke="#fff" stroke-opacity=".13" stroke-width="1" stroke-dasharray="3 12"/><path d="M0 360 210 244 340 328 512 190 800 366V480H0Z" fill="#090b14" fill-opacity=".52"/><path d="M0 390 210 274 340 358 512 220 800 396" fill="none" stroke="${accent}" stroke-opacity=".45" stroke-width="2"/><path d="M${orbitX} ${orbitY - 48}l48 48 -48 48 -48 -48z" fill="#fff" fill-opacity=".65"/><circle cx="${orbitX}" cy="${orbitY}" r="13" fill="${accent}"/></svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
