import type { Metadata } from 'next'
import { ArcadiaApp } from '@/components/arcadia/app-shell'
import { gameBySlug, getSafeReturnHref, getSingleParam, type RouteSearchParams } from '@/lib/games'

type PageProps = { params: Promise<{ slug: string }>; searchParams: RouteSearchParams }

export async function generateMetadata({ params }: Pick<PageProps, 'params'>): Promise<Metadata> {
  const { slug } = await params
  const game = gameBySlug(slug)
  return { title: game ? `${game.title} — Arcadia` : 'Game not found — Arcadia', description: game?.description ?? 'Explore browser games in Arcadia.' }
}

export default async function GamePage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const returnHref = getSafeReturnHref(getSingleParam(query.returnTo))
  const returnParams = returnHref ? new URL(returnHref, 'https://arcadia.local').searchParams : null
  const initialQuery = getSingleParam(query.q) || returnParams?.get('q') || ''
  const initialCategory = getSingleParam(query.category) || returnParams?.get('category') || 'All'
  return <ArcadiaApp view="game" slug={slug} initialQuery={initialQuery} initialCategory={initialCategory} returnHref={returnHref} />
}
