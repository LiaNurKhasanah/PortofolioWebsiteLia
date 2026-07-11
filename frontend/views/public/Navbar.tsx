import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS, COLORS, SITE } from '../../models/constants'
import FloralButton from '../shared/FloralButton'
import Lily4 from './Assets/lily4.png'
import { Profile } from '../../models/types'

interface Props { profile: Profile | null }

function splitName(name: string) {
  const parts = name.trim().split(/\s+/)
  return {
    first: parts.slice(0, 2).join(' '),
    rest: parts.slice(2).join(' '),
  }
}

export default function Navbar({ profile }: Props) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const displayName = splitName(profile?.name ?? SITE.fullName)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const go = (href: string) => {
    setOpen(false)
    if (window.lenis) {
      window.lenis.scrollTo(href, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: `rgba(253,248,250,0.93)`,
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? `1px solid ${COLORS.pink}33` : '1px solid transparent',
        boxShadow: scrolled ? `0 2px 20px ${COLORS.pink}1A` : 'none',
      }}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => go('#home')} className="flex items-center text-left whitespace-nowrap gap-1.5 md:gap-2">
          <span
            className="relative hidden sm:inline-block w-7 h-7 md:w-9 md:h-9 pointer-events-none select-none"
            style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.9)) drop-shadow(0 2px 8px rgba(213,105,137,0.22))' }}
          >
            <Image src={Lily4} alt="Lily decoration left of navbar name" fill className="object-contain" />
          </span>
          <span className="flex items-baseline">
            <span className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: COLORS.orchid }}>
              {displayName.first}
            </span>
            {displayName.rest && (
              <span className="text-xl md:text-2xl font-medium tracking-tight ml-1.5" style={{ color: COLORS.green }}>
                {displayName.rest}
              </span>
            )}
          </span>
          <span
            className="relative hidden sm:inline-block w-7 h-7 md:w-9 md:h-9 pointer-events-none select-none"
            style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.9)) drop-shadow(0 2px 8px rgba(213,105,137,0.22))' }}
          >
            <Image src={Lily4} alt="Lily decoration right of navbar name" fill className="object-contain scale-x-[-1]" />
          </span>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.replace('#', '')
            const isActive = active === id
            return (
              <button key={href} onClick={() => go(href)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{ color: isActive ? '#fff' : COLORS.textMuted, background: isActive ? COLORS.orchid : 'transparent' }}>
                {label}
              </button>
            )
          })}
          <FloralButton variant="orchid" onClick={() => go('#kontak')} className="ml-4">
            Hubungi Saya
          </FloralButton>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center md:hidden">
          <button onClick={() => setOpen(v => !v)} className="p-2" aria-label="Menu"
            style={{ color: COLORS.orchid }}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-4 pt-2" style={{ background: 'rgba(253,248,250,0.98)', borderTop: `1px solid ${COLORS.pink}22` }}>
          {NAV_LINKS.map(({ label, href }) => (
            <button key={href} onClick={() => go(href)}
              className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium mb-1"
              style={{ color: COLORS.text }}>
              {label}
            </button>
          ))}
          <FloralButton variant="orchid" onClick={() => go('#kontak')} className="w-full justify-center mt-2">
            Hubungi Saya
          </FloralButton>
        </div>
      )}
    </nav>
  )
}
