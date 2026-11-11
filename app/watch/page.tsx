import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'

export const metadata: Metadata = { title: 'Watch', description: 'Watch open-licensed short films and approved video samples on LUMEN.' }
export default function WatchPage() { return <LumenAppShell /> }
