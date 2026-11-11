import type { Metadata } from 'next'
import { ArcadiaApp } from '@/components/arcadia/app-shell'

export const metadata: Metadata = { title: 'Play browser games — Arcadia', description: 'Discover and play original browser games on Arcadia.' }

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ArcadiaApp view="game" slug={slug} />
}
