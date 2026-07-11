'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    })

    // Refresh AOS setelah mounting dan load halaman selesai untuk menangani layout shift
    const handleLoad = () => {
      AOS.refresh()
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    // Refresh setelah beberapa delay untuk menangkap render konten dinamis & layout shift pasca-load
    const timer1 = setTimeout(() => AOS.refresh(), 100)
    const timer2 = setTimeout(() => AOS.refresh(), 500)
    const timer3 = setTimeout(() => AOS.refresh(), 1200)
    const timer4 = setTimeout(() => AOS.refresh(), 2000)

    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  return null
}
