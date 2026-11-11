import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'
import { gameBySlug } from '@/lib/games'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const game = gameBySlug(slug)
  return { title: game?.title ?? 'Game not found', description: game?.description ?? 'Explore games in the LUMEN catalog.' }
}

export default function GamePage() { return <LumenAppShell /> }
