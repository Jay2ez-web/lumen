import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'

export const metadata: Metadata = { title: 'LUMEN — Games, Watch, Apps & Chat', description: 'One place for play, watch, create, and connect.' }

export default function HomePage() { return <LumenAppShell /> }
