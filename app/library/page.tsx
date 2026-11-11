import type { Metadata } from 'next'
import { ArcadiaApp } from '@/components/arcadia/app-shell'
import { getSingleParam, type RouteSearchParams } from '@/lib/games'

export const metadata: Metadata = { title: 'Your library — Arcadia', description: 'Review saved browser games and your recently played titles.' }

export default async function LibraryPage({ searchParams }: { searchParams: RouteSearchParams }) {
  const params = await searchParams
  return <ArcadiaApp view="library" initialQuery={getSingleParam(params.q)} initialCategory={getSingleParam(params.category) || 'All'} />
}
