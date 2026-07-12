import { NextResponse } from 'next/server'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lianurkhasanah.my.id'

  const subPages = [
    { path: 'about', priority: '0.9' },
    { path: 'portofolio', priority: '0.9' },
    { path: 'voiceover', priority: '0.9' },
    { path: 'kontak', priority: '0.9' },
    { path: 'keahlian', priority: '0.8' },
    { path: 'pengalaman', priority: '0.8' },
    { path: 'prestasi', priority: '0.8' },
  ]

  const urls = [
    `  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    ...subPages.map(
      page => `  <url>
    <loc>${siteUrl}/${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    ),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
    },
  })
}
