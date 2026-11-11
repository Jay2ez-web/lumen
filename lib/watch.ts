export type WatchItem = {
  slug: string
  title: string
  description: string
  type: 'movie' | 'show' | 'trailer' | 'documentary' | 'short'
  thumbnailUrl: string
  bannerUrl: string
  videoUrl?: string
  embedUrl?: string
  provider?: string
  licenseUrl?: string
  duration?: string
  year?: number
  genres: string[]
  featured?: boolean
}

const bigBuckBunnyLicense = 'https://creativecommons.org/licenses/by/3.0/'
const elephantsDreamLicense = 'https://creativecommons.org/licenses/by/2.5/'

export const watchItems: WatchItem[] = [
  {
    slug: 'big-buck-bunny',
    title: 'Big Buck Bunny',
    description: 'A gentle, humorous animated short from the Blender Foundation, released under a Creative Commons Attribution license.',
    type: 'short',
    thumbnailUrl: '',
    bannerUrl: '',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    provider: 'Blender Foundation',
    licenseUrl: bigBuckBunnyLicense,
    duration: '9 min',
    year: 2008,
    genres: ['Animation', 'Comedy'],
    featured: true,
  },
  {
    slug: 'elephants-dream',
    title: "Elephants Dream",
    description: 'A surreal open-animation short made by the Blender Foundation and shared under a Creative Commons license.',
    type: 'short',
    thumbnailUrl: '',
    bannerUrl: '',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    provider: 'Blender Foundation',
    licenseUrl: elephantsDreamLicense,
    duration: '11 min',
    year: 2006,
    genres: ['Animation', 'Sci-fi'],
  },
  {
    slug: 'lumen-field-notes',
    title: 'Field Notes: The Night Sky',
    description: 'An original LUMEN editorial concept for a future short documentary. No stream is attached yet.',
    type: 'documentary',
    thumbnailUrl: '',
    bannerUrl: '',
    provider: 'LUMEN Originals',
    duration: 'Coming soon',
    year: 2026,
    genres: ['Science', 'Nature'],
  },
]

export const watchBySlug = (slug: string) => watchItems.find((item) => item.slug === slug)
