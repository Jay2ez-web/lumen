import type { Metadata } from 'next'
import { LumenAppShell } from '@/components/lumen/app-shell'
import { watchBySlug } from '@/lib/watch'

type PageProps = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = watchBySlug(slug)
  return { title: item?.title ?? 'Video not found', description: item?.description ?? 'Explore approved video samples on LUMEN.' }
}
export default function WatchDetailPage() { return <LumenAppShell /> }
