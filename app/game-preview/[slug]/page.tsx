import { notFound, redirect } from 'next/navigation'
import { gameBySlug } from '@/lib/games'

export default async function GamePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!gameBySlug(slug)) notFound()
  redirect(`/games/${slug}`)
}
