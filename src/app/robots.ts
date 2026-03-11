import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coervercroatia.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/prijava',
          '/registracija',
          '/reset-lozinke',
          '/zaboravljena-lozinka',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
