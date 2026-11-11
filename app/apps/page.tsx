import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'

export const metadata: Metadata = { title: 'Apps', description: 'Open useful mini apps and tools inside LUMEN.' }
export default function AppsPage() { return <LumenAppShell /> }
