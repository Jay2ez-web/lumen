import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'

export const metadata: Metadata = { title: 'Library', description: 'Review saved games, videos, and mini apps in your LUMEN library.' }
export default function LibraryRoute() { return <LumenAppShell /> }
