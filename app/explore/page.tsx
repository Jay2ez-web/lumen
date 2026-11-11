import type { Metadata } from 'next'
import { ArcadiaApp } from '@/components/arcadia/app-shell'

export const metadata: Metadata = { title: 'Explore games — Arcadia', description: 'Discover your next favorite free browser game on Arcadia.' }

export default function ExplorePage() {
  return <ArcadiaApp view="explore" />
}
