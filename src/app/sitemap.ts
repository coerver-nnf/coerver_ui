import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { routing } from '@/i18n/routing'
import { localePath } from '@/lib/i18n/seo'

type StaticEntry = {
  path: string
  changeFrequency: 'daily' | 'weekly' | 'monthly'
  priority: number
}

const staticEntries: StaticEntry[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/o-nama', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/kontakt', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/klubovi', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/za-igrace', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/za-igrace/kampovi', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/za-igrace/akademije', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/za-igrace/individualni-treninzi', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/za-trenere', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/za-trenere/coerver-intro', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/za-trenere/youth-diploma-1', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/za-trenere/youth-diploma-2', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.8 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coervercroatia.com'
  const supabase = await createClient()

  // One entry per locale per page, each carrying the full hreflang set
  const localizedEntries = (
    path: string,
    lastModified: Date,
    changeFrequency: 'daily' | 'weekly' | 'monthly',
    priority: number
  ): MetadataRoute.Sitemap => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, `${baseUrl}${localePath(path, l)}`])
    )
    return routing.locales.map((locale) => ({
      url: `${baseUrl}${localePath(path, locale)}`,
      lastModified,
      changeFrequency,
      // Non-default locales get slightly lower priority
      priority: locale === 'hr' ? priority : Math.max(0.1, priority - 0.2),
      alternates: { languages },
    }))
  }

  const staticPages: MetadataRoute.Sitemap = staticEntries.flatMap((e) =>
    localizedEntries(e.path, new Date(), e.changeFrequency, e.priority)
  )

  // Dynamic: Camps
  const { data: camps } = await supabase
    .from('camps')
    .select('slug, updated_at')
    .eq('status', 'published')

  const campPages: MetadataRoute.Sitemap = (camps || []).flatMap((camp) =>
    localizedEntries(
      `/za-igrace/kampovi/${camp.slug}`,
      camp.updated_at ? new Date(camp.updated_at) : new Date(),
      'weekly',
      0.8
    )
  )

  // Dynamic: Blog posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published')

  const blogPages: MetadataRoute.Sitemap = (posts || []).flatMap((post) =>
    localizedEntries(
      `/blog/${post.slug}`,
      post.updated_at ? new Date(post.updated_at) : new Date(),
      'monthly',
      0.7
    )
  )

  return [...staticPages, ...campPages, ...blogPages]
}
