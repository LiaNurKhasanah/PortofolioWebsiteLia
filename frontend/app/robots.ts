import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lianurkhasanah.web.id'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/kelola/panel',
        '/api/admin/',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
