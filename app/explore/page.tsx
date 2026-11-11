import type { Metadata } from 'next'
import { ArcadiaApp } from '@/components/arcadia/app-shell'
import { games, getSingleParam, type RouteSearchParams } from '@/lib/games'

export const metadata: Metadata = { title: 'Explore games — Arcadia', description: `Browse ${games.length} browser games from their listed providers, with artwork from their providers.` }

export default async function ExplorePage({ searchParams }: { searchParams: RouteSearchParams }) {
  const params = await searchParams
  return <ArcadiaApp view="explore" initialQuery={getSingleParam(params.q)} initialCategory={getSingleParam(params.category) || 'All'} />
}
