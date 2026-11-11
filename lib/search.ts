import { apps, type AppItem } from '@/lib/apps'
import { games, type Game } from '@/lib/games'
import { watchItems, type WatchItem } from '@/lib/watch'

export type SearchResult =
  | { kind: 'game'; title: string; description: string; href: string; item: Game }
  | { kind: 'watch'; title: string; description: string; href: string; item: WatchItem }
  | { kind: 'app'; title: string; description: string; href: string; item: AppItem }

export function searchLumen(query: string): SearchResult[] {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle) return []
  const results: SearchResult[] = []
  games.forEach((item) => {
    if (`${item.title} ${item.description} ${item.genre} ${item.provider}`.toLocaleLowerCase().includes(needle)) results.push({ kind: 'game', title: item.title, description: item.description, href: `/games/${item.slug}`, item })
  })
  watchItems.forEach((item) => {
    if (`${item.title} ${item.description} ${item.type} ${item.genres.join(' ')}`.toLocaleLowerCase().includes(needle)) results.push({ kind: 'watch', title: item.title, description: item.description, href: `/watch/${item.slug}`, item })
  })
  apps.forEach((item) => {
    if (`${item.name} ${item.description} ${item.category}`.toLocaleLowerCase().includes(needle)) results.push({ kind: 'app', title: item.name, description: item.description, href: item.route, item })
  })
  return results
}
