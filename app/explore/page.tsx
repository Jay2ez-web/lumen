import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'

export const metadata: Metadata = { title: 'Explore', description: 'Search games, videos, and useful apps across LUMEN.' }
export default function ExplorePage() { return <LumenAppShell /> }
