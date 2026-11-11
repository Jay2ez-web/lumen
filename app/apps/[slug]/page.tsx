import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'
import { appBySlug } from '@/lib/apps'

type PageProps = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const app = appBySlug(slug)
  return { title: app?.name ?? 'App not found', description: app?.description ?? 'Open mini apps and tools in LUMEN.' }
}
export default function AppDetailPage() { return <LumenAppShell /> }
