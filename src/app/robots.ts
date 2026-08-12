import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coervercroatia.com'

  const authPaths = [
    '/dashboard/',
    '/prijava',
    '/registracija',
    '/reset-lozinke',
    '/zaboravljena-lozinka',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: authPaths.flatMap((p) => [p, `/sl${p}`, `/en${p}`]),
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
