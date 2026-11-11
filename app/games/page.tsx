import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'

export const metadata: Metadata = { title: 'Games', description: 'Explore browser games in the LUMEN catalog.' }
export default function GamesPage() { return <LumenAppShell /> }
