import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'

export const metadata: Metadata = { title: 'Settings', description: 'Manage your LUMEN experience and local data preferences.' }
export default function SettingsPage() { return <LumenAppShell /> }
