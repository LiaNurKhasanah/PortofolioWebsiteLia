'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import AOS from 'aos'
import 'lenis/dist/lenis.css'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inisialisasi Lenis dengan konfigurasi yang tepat
    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.08,
      smoothWheel: true,
      // Kita set autoRaf ke false agar bisa menggunakan custom requestAnimationFrame loop
      autoRaf: false,
    })

    // Set instance lenis ke global window object
    window.lenis = lenis

    // Setup custom animation frame loop (RAF)
    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Hubungkan Lenis dengan AOS agar animasi scroll berjalan normal
    lenis.on('scroll', () => {
      AOS.refresh()
    })

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.lenis = undefined
    }
  }, [])

  return <>{children}</>
}
