import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'

export const metadata: Metadata = { title: 'Chat', description: 'Join the LUMEN local demo chat. Messages are stored on this device only.' }
export default function ChatPage() { return <LumenAppShell /> }
