import type { Metadata } from 'next'
import { ArcadiaApp } from '@/components/arcadia/app-shell'
import { getSingleParam, type RouteSearchParams } from '@/lib/games'

export const metadata: Metadata = { title: 'Explore games — Arcadia', description: 'Browse twelve original sample game concepts and their local preview builds.' }

export default async function ExplorePage({ searchParams }: { searchParams: RouteSearchParams }) {
  const params = await searchParams
  return <ArcadiaApp view="explore" initialQuery={getSingleParam(params.q)} initialCategory={getSingleParam(params.category) || 'All'} />
}
