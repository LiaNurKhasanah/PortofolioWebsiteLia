'use client'

import { useEffect, useRef } from 'react'

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only show on desktop (non-touch)
    if (typeof window === 'undefined') return
    if ('ontouchstart' in window) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let targetScale = 1
    let currentScale = 1
    let isHovered = false
    let isClicked = false

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      currentScale += (targetScale - currentScale) * 0.15
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${currentScale})`
      requestAnimationFrame(animate)
    }

    const updateState = () => {
      if (isHovered || isClicked) {
        targetScale = 16 / 36 // Shrink to 16px
        ring.style.borderColor = 'rgba(213, 105, 137, 0.8)'
        ring.style.background = 'rgba(213, 105, 137, 0.15)'
        dot.style.opacity = '0'
      } else {
        targetScale = 1
        ring.style.borderColor = 'rgba(213, 105, 137, 0.35)'
        ring.style.background = 'transparent'
        dot.style.opacity = '1'
      }
    }

    // Hover scaling on interactive elements: shrinks to focus, doesn't block text/clicks
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], input, textarea, .floral-btn, [data-cursor-hover]')) {
        isHovered = true
        updateState()
      }
    }

    const handleOut = (e: MouseEvent) => {
      const target = e.relatedTarget as HTMLElement
      if (!target || !target.closest('a, button, [role="button"], input, textarea, .floral-btn, [data-cursor-hover]')) {
        isHovered = false
        updateState()
      }
    }

    const handleDown = () => {
      isClicked = true
      updateState()
    }

    const handleUp = () => {
      isClicked = false
      updateState()
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handleOver, { passive: true })
    document.addEventListener('mouseout', handleOut, { passive: true })
    document.addEventListener('mousedown', handleDown, { passive: true })
    document.addEventListener('mouseup', handleUp, { passive: true })
    requestAnimationFrame(animate)

    // Show cursor elements
    dot.style.opacity = '1'
    ring.style.opacity = '1'

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      document.removeEventListener('mousedown', handleDown)
      document.removeEventListener('mouseup', handleUp)
    }
  }, [])

  return (
    <>
      {/* Small dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#D56989',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          mixBlendMode: 'normal',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid rgba(213, 105, 137, 0.35)',
          background: 'transparent',
          opacity: 0,
          transition: 'border-color 0.3s ease, background 0.3s ease, opacity 0.3s ease',
        }}
      />
    </>
  )
}