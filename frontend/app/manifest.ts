import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lia Nur Khasanah - Portfolio',
    short_name: 'Lia Portfolio',
    description:
      'Portofolio Profesional Lia Nur Khasanah - Voice Over Talent, Content Writer, dan Social Media Specialist.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDF8FA',
    theme_color: '#D56989',
    orientation: 'portrait-primary',
    categories: ['portfolio', 'personal', 'business'],
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/LiaNurKhasanah.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
