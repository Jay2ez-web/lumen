export type AppItem = {
  slug: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  route: string
  featured?: boolean
}

export const apps: AppItem[] = [
  { slug: 'notes', name: 'Notes', description: 'Capture a thought and find it again later.', category: 'Create', icon: 'NotebookPen', color: 'violet', route: '/apps/notes', featured: true },
  { slug: 'calculator', name: 'Calculator', description: 'A clean calculator for quick answers.', category: 'Tools', icon: 'Calculator', color: 'blue', route: '/apps/calculator', featured: true },
  { slug: 'timer', name: 'Timer', description: 'Set a focused countdown.', category: 'Tools', icon: 'Timer', color: 'cyan', route: '/apps/timer', featured: true },
  { slug: 'todo', name: 'To-do list', description: 'Keep a lightweight list of what is next.', category: 'Organize', icon: 'ListTodo', color: 'amber', route: '/apps/todo', featured: true },
  { slug: 'palette', name: 'Color palette', description: 'Generate and copy a fresh five-color palette.', category: 'Create', icon: 'Palette', color: 'pink', route: '/apps/palette', featured: true },
  { slug: 'converter', name: 'Unit converter', description: 'Convert common length and temperature units.', category: 'Tools', icon: 'ArrowLeftRight', color: 'blue', route: '/apps/converter' },
  { slug: 'drawing-pad', name: 'Drawing pad', description: 'A lightweight canvas for quick sketches.', category: 'Create', icon: 'Pencil', color: 'pink', route: '/apps/drawing-pad' },
  { slug: 'music-player', name: 'Music player', description: 'A home for audio you provide or have rights to use.', category: 'Listen', icon: 'Music2', color: 'violet', route: '/apps/music-player' },
  { slug: 'file-viewer', name: 'File viewer', description: 'Preview a local text file in your browser.', category: 'Tools', icon: 'FileText', color: 'cyan', route: '/apps/file-viewer' },
  { slug: 'calendar', name: 'Calendar', description: 'A simple month view for planning.', category: 'Organize', icon: 'CalendarDays', color: 'amber', route: '/apps/calendar' },
  { slug: 'randomizer', name: 'Random generator', description: 'Pick a number or make a random choice.', category: 'Play', icon: 'Dices', color: 'pink', route: '/apps/randomizer' },
  { slug: 'settings', name: 'Settings', description: 'Tune your preferences and local data controls.', category: 'Personalize', icon: 'Settings2', color: 'violet', route: '/settings' },
]

export const appBySlug = (slug: string) => apps.find((app) => app.slug === slug)
