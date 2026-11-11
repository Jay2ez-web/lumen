import type { Metadata } from 'next'
import { ArcadiaApp } from '@/components/arcadia/app-shell'

export const metadata: Metadata = { title: 'Your library — Arcadia', description: 'Your saved and recently played games, all in one place.' }

export default function LibraryPage() {
  return <ArcadiaApp view="library" />
}
