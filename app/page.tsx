import { ArcadiaApp } from '@/components/arcadia/app-shell'
import { getSingleParam, type RouteSearchParams } from '@/lib/games'

export default async function HomePage({ searchParams }: { searchParams: RouteSearchParams }) {
  const params = await searchParams
  return <ArcadiaApp view="home" initialQuery={getSingleParam(params.q)} initialCategory={getSingleParam(params.category) || 'All'} />
}
