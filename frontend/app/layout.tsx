import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import Script from 'next/script'
import SmoothScroll from '../lib/SmoothScroll'
import AOSInit from '../lib/AOSInit'
import ScrollProgressBar from '../lib/ScrollProgressBar'
import CursorFollower from '../lib/CursorFollower'
import './globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lianurkhasanah.web.id'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Lia Nur Khasanah | Professional Voice Over & Content Writer Portfolio',
  description:
    'Portofolio Profesional Lia Nur Khasanah - Mahasiswi Ilmu Komunikasi, Content Writer, dan Voice Over Talent. Membantu menyampaikan pesan secara kreatif, hangat, dan komunikatif.',
  keywords: [
    'Lia Nur Khasanah',
    'Lia Nur Khasanah Portfolio',
    'Voice Over Indonesia',
    'VO Talent Yogyakarta',
    'Content Writer Indonesia',
    'Copywriter Yogyakarta',
    'Mahasiswi Ilmu Komunikasi UIN',
    'Jasa Voice Over',
    'Jasa Penulisan Konten',
    'Public Speaker',
  ],
  authors: [{ name: 'Lia Nur Khasanah' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Lia Nur Khasanah | Professional Voice Over & Content Writer',
    description:
      'Portofolio Resmi Lia Nur Khasanah - Menghadirkan layanan kepenulisan kreatif, strategi media sosial, dan suara voice over yang hangat serta persuasif.',
    url: siteUrl,
    siteName: 'Lia Nur Khasanah Portfolio',
    type: 'website',
    locale: 'id_ID',
    images: [
      {
        url: '/LiaNurKhasanah.png',
        width: 800,
        height: 800,
        alt: 'Lia Nur Khasanah - Voice Over & Content Writer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lia Nur Khasanah | Voice Over & Content Writer',
    description: 'Portofolio Profesional Lia Nur Khasanah - Voice Over Talent & Content Writer.',
    images: ['/LiaNurKhasanah.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'google-site-verification-placeholder',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || 'yandex-site-verification-placeholder',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || 'bing-site-verification-placeholder',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Lia Nur Khasanah',
    url: siteUrl,
    image: `${siteUrl}/LiaNurKhasanah.png`,
    jobTitle: 'Voice Over Talent & Content Writer',
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'UIN Sunan Kalijaga Yogyakarta',
    },
    knowsAbout: [
      'Voice Over',
      'Content Writing',
      'Copywriting',
      'Public Speaking',
      'Social Media Management',
      'Communication Science',
    ],
    sameAs: [
      'https://www.linkedin.com/in/lia-nur-khasanah',
      'https://www.instagram.com/lianrkhsnhh',
    ],
  }

  return (
    <html lang="id" className={quicksand.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${quicksand.className} antialiased selection:bg-pink-200 selection:text-pink-900`}
        suppressHydrationWarning
      >
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <ScrollProgressBar />
        <CursorFollower />
        <SmoothScroll>
          <AOSInit />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
