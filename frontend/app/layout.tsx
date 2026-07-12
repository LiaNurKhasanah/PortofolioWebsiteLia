import type { Metadata, Viewport } from 'next'
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lianurkhasanah.my.id'

export const viewport: Viewport = {
  themeColor: '#D56989',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Lia Nur Khasanah | Voice Over Talent & Content Writer Portfolio',
    template: '%s | Lia Nur Khasanah',
  },
  description:
    'Portofolio Profesional Lia Nur Khasanah — Mahasiswi Ilmu Komunikasi, Content Writer, Copywriter, Social Media Specialist, dan Voice Over Talent di Yogyakarta. Menyampaikan pesan secara kreatif, hangat, dan komunikatif.',
  keywords: [
    'Lia Nur Khasanah',
    'Lia Nur Khasanah Portfolio',
    'Voice Over Indonesia',
    'Voice Over Talent Yogyakarta',
    'Content Writer Indonesia',
    'Copywriter Yogyakarta',
    'Social Media Specialist',
    'Mahasiswi Ilmu Komunikasi',
    'Jasa Voice Over Profesional',
    'Jasa Penulisan Konten',
    'Jasa Copywriting',
    'Public Speaker Yogyakarta',
    'Portofolio Voice Over',
    'Content Creator Indonesia',
  ],
  authors: [{ name: 'Lia Nur Khasanah', url: siteUrl }],
  creator: 'Lia Nur Khasanah',
  publisher: 'Lia Nur Khasanah',
  category: 'portfolio',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Lia Nur Khasanah | Voice Over Talent & Content Writer',
    description:
      'Portofolio Resmi Lia Nur Khasanah — Layanan kepenulisan kreatif, strategi media sosial, dan voice over profesional yang hangat serta persuasif.',
    url: siteUrl,
    siteName: 'Lia Nur Khasanah Portfolio',
    type: 'website',
    locale: 'id_ID',
    images: [
      {
        url: '/LiaNurKhasanah.png',
        width: 800,
        height: 800,
        alt: 'Lia Nur Khasanah — Voice Over Talent & Content Writer',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lia Nur Khasanah | Voice Over & Content Writer',
    description:
      'Portofolio Profesional Lia Nur Khasanah — Voice Over Talent, Content Writer, dan Social Media Specialist.',
    images: [
      {
        url: '/LiaNurKhasanah.png',
        alt: 'Lia Nur Khasanah Portfolio',
      },
    ],
    creator: '@lianrkhsnhh',
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/icon.png',
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
          ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
            ? { yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
            : {}),
          ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
            ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION } }
            : {}),
        },
      }
    : {}),
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
    description:
      'Mahasiswi Ilmu Komunikasi yang menyediakan layanan voice over profesional, content writing, copywriting, dan social media management.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yogyakarta',
      addressCountry: 'ID',
    },
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
      'Personal Branding',
    ],
    sameAs: [
      'https://www.linkedin.com/in/lia-nur-khasanah',
      'https://www.instagram.com/lianrkhsnhh',
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Voice Over Profesional',
          description: 'Layanan voice over dengan gaya suara hangat, komunikatif, dan profesional.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Content Writing & Copywriting',
          description: 'Layanan penulisan konten kreatif dan copywriting untuk media digital.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Social Media Management',
          description: 'Pengelolaan media sosial dengan strategi konten yang terencana.',
        },
      },
    ],
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tentang',
        item: `${siteUrl}/#about`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Portofolio',
        item: `${siteUrl}/#portofolio`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Voice Over',
        item: `${siteUrl}/#voiceover`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Kontak',
        item: `${siteUrl}/#kontak`,
      },
    ],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lia Nur Khasanah Portfolio',
    url: siteUrl,
    description: 'Portofolio profesional Lia Nur Khasanah — Voice Over Talent & Content Writer.',
    inLanguage: 'id-ID',
    author: {
      '@type': 'Person',
      name: 'Lia Nur Khasanah',
    },
  }

  return (
    <html lang="id" className={quicksand.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
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
