import { NextResponse } from 'next/server'
import { getSupabaseServer } from '../../lib/supabase'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lianurkhasanah.my.id'

  let projects: any[] = []
  try {
    const sb = getSupabaseServer()
    const { data } = await sb.from('projects').select('id, sort_order').order('sort_order')
    if (data) projects = data
  } catch (e) {
    console.error('Failed to fetch projects for sitemap:', e)
  }

  // Daftarkan portofolio proyek-proyek Lia Nur Khasanah
  const urls = projects.map(
    p => `  <url>
    <loc>${siteUrl}/portofolio?id=${p.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  )

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
