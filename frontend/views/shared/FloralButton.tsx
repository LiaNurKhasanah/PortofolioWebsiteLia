'use client'

import React from 'react'

interface FloralButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: 'orchid' | 'green' | 'pink'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

const VARIANTS = {
  orchid: {
    bg: '#D56989',
    border: '#C95A7A',
    gradient: 'linear-gradient(85deg, #D56989, #DA7A96, #E08BA3, #DA7A96, #D56989)',
    text: '#fff',
    svgFill: '#8C2E46', // Warna kontras agar terlihat di depan background orchid
  },
  green: {
    bg: '#C2DC80',
    border: '#B0CC6A',
    gradient: 'linear-gradient(85deg, #C2DC80, #CADE90, #D2E0A0, #CADE90, #C2DC80)',
    text: '#3A5A1A',
    svgFill: '#4A7A2A', // Warna kontras hijau tua
  },
  pink: {
    bg: '#EA9CAF',
    border: '#E08DA2',
    gradient: 'linear-gradient(85deg, #EA9CAF, #EDAABB, #F0B8C7, #EDAABB, #EA9CAF)',
    text: '#fff',
    svgFill: '#B3566D', // Warna kontras agar terlihat di depan background pink
  },
}

// Custom SVG components to render highly customizable and non-distorted flowers
// Wadah absolut: kiri lebar 10px (tinggi proporsional ~32px), kanan lebar 20px (tinggi proporsional ~60px)
// Kita mendesain bunga/daun dengan SVG primitives agar sangat tajam dan proporsional.
const FloralDecoration = ({ variant, side }: { variant: 'orchid' | 'green' | 'pink'; side: 'left' | 'right' }) => {
  const v = VARIANTS[variant]
  const color = v.svgFill

  if (variant === 'green') {
    // Daun untuk Green variant
    if (side === 'left') {
      return (
        <svg viewBox="0 0 12 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Batang utama melengkung */}
          <path d="M6 38C6 26 8 14 4 2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          {/* Daun kiri bawah */}
          <path d="M5.5 28C2.5 27 1 23 2 21.5C3.5 20.5 6 23.5 6 25.5" fill={color} />
          {/* Daun kanan tengah */}
          <path d="M6.5 20C9.5 19 11 15 10 13.5C8.5 12.5 6 15.5 6.5 17.5" fill={color} />
          {/* Daun kiri atas */}
          <path d="M5 12C2 11 0.5 7 1.5 5.5C3 4.5 5.5 7.5 5 9.5" fill={color} />
          {/* Kuncup atas */}
          <circle cx="4" cy="2" r="1.5" fill={color} />
        </svg>
      )
    } else {
      return (
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Batang utama melengkung indah */}
          <path d="M12 64C12 45 16 25 10 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          {/* Pasangan daun-daun */}
          <path d="M11.5 50C6 48 3 41 5 38C7.5 35 12 41 12 45" fill={color} />
          <path d="M12.5 42C18 40 21 33 19 30C16.5 27 12 33 12.5 37" fill={color} />
          
          <path d="M11 32C6 30 3 23 5 20C7.5 17 11 23 11 27" fill={color} />
          <path d="M13 24C18 22 21 15 19 12C16.5 9 13 15 13 19" fill={color} />

          <path d="M10.5 15C6.5 13.5 4 8 5.5 5.5C7.5 3 10.5 8 10.5 11" fill={color} />
          
          {/* Kuncup atas */}
          <circle cx="10" cy="4" r="2" fill={color} />
        </svg>
      )
    }
  }

  // Bunga untuk Orchid (Dusty Orchid) dan Pink (Sakura)
  if (side === 'left') {
    return (
      <svg viewBox="0 0 12 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Batang merambat tipis */}
        <path d="M6 38C6 28 8 18 5 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Daun kecil perambat */}
        <path d="M5.5 30C4 29 3.5 27 4.5 26C5.5 25 6 27 6 28.5" fill={color} opacity="0.8" />
        <path d="M6.5 22C8 21 8.5 19 7.5 18C6.5 17 6 19 6.5 20.5" fill={color} opacity="0.8" />

        {/* Kelopak Bunga 1 (Tengah-Bawah) */}
        <g transform="translate(5, 25)">
          <circle cx="0" cy="-2.2" r="1.8" fill={color} />
          <circle cx="-2.2" cy="0" r="1.8" fill={color} />
          <circle cx="2.2" cy="0" r="1.8" fill={color} />
          <circle cx="0" cy="2.2" r="1.8" fill={color} />
          <circle cx="0" cy="0" r="1.2" fill="#fff" opacity="0.9" />
        </g>

        {/* Bunga Utama 2 (Atas) */}
        <g transform="translate(5.5, 10)">
          <circle cx="0" cy="-2.5" r="2.2" fill={color} />
          <circle cx="-2.5" cy="0" r="2.2" fill={color} />
          <circle cx="2.5" cy="0" r="2.2" fill={color} />
          <circle cx="0" cy="2.5" r="2.2" fill={color} />
          {/* Putik Tengah */}
          <circle cx="0" cy="0" r="1.4" fill="#fff" opacity="0.9" />
        </g>
        
        {/* Kuncup Teratas */}
        <circle cx="5" cy="4" r="1.2" fill={color} />
      </svg>
    )
  } else {
    // Sisi Kanan (Lebar 24px, Tinggi 64px)
    return (
      <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Batang merambat utama melengkung indah */}
        <path d="M12 64C12 48 16 32 10 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

        {/* Daun kecil dekoratif */}
        <path d="M11 52C8 51 7 48 9 46C11 44 12 48 11.5 50" fill={color} opacity="0.8" />
        <path d="M13 42C16 41 17 38 15 36C13 34 12 38 12.5 40" fill={color} opacity="0.8" />
        <path d="M10 26C7 25 6 22 8 20C10 18 11 22 10.5 24" fill={color} opacity="0.8" />

        {/* Bunga Indah 1 (Bawah) */}
        <g transform="translate(11, 46)">
          <circle cx="0" cy="-3.5" r="3.2" fill={color} />
          <circle cx="-3.5" cy="0" r="3.2" fill={color} />
          <circle cx="3.5" cy="0" r="3.2" fill={color} />
          <circle cx="0" cy="3.5" r="3.2" fill={color} />
          {/* Putik Tengah */}
          <circle cx="0" cy="0" r="2.0" fill="#fff" opacity="0.9" />
        </g>

        {/* Bunga Indah 2 (Tengah) */}
        <g transform="translate(14, 30)">
          <circle cx="0" cy="-3.8" r="3.5" fill={color} />
          <circle cx="-3.8" cy="0" r="3.5" fill={color} />
          <circle cx="3.8" cy="0" r="3.5" fill={color} />
          <circle cx="0" cy="3.8" r="3.5" fill={color} />
          {/* Putik Tengah */}
          <circle cx="0" cy="0" r="2.2" fill="#fff" opacity="0.9" />
        </g>

        {/* Bunga Indah 3 (Atas) */}
        <g transform="translate(9, 14)">
          <circle cx="0" cy="-3.0" r="2.8" fill={color} />
          <circle cx="-3.0" cy="0" r="2.8" fill={color} />
          <circle cx="3.0" cy="0" r="2.8" fill={color} />
          <circle cx="0" cy="3.0" r="2.8" fill={color} />
          {/* Putik Tengah */}
          <circle cx="0" cy="0" r="1.8" fill="#fff" opacity="0.9" />
        </g>

        {/* Kuncup Teratas */}
        <circle cx="10" cy="6" r="1.6" fill={color} />
      </svg>
    )
  }
}

export default function FloralButton({
  children,
  onClick,
  href,
  variant = 'orchid',
  className = '',
  type = 'button',
  disabled = false,
}: FloralButtonProps) {
  const v = VARIANTS[variant]

  const btnContent = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Dekorasi kiri */}
      <div className="floral-icon-left">
        <FloralDecoration variant={variant} side="left" />
      </div>
      {/* Dekorasi kanan */}
      <div className="floral-icon-right">
        <FloralDecoration variant={variant} side="right" />
      </div>
    </>
  )

  const style: React.CSSProperties = {
    position: 'relative',
    padding: '10px 24px', // perkecil padding tombol
    background: v.bg,
    fontSize: '12.5px', // perkecil font size tombol
    fontWeight: 700,
    color: v.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: `1.2px solid ${v.border}`,
    borderRadius: '8px', // kurangi radius border tombol biar kotak minimalis (tidak terlalu bulat capsul)
    filter: 'drop-shadow(1px 1px 3px rgba(213,105,137,0.15))',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.3s ease',
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        className={`floral-btn inline-flex items-center gap-2 ${className}`}
        style={style}>
        {btnContent}
      </a>
    )
  }

  return (
    <button onClick={onClick} type={type} disabled={disabled}
      className={`floral-btn inline-flex items-center gap-2 ${className}`}
      style={style}>
      {btnContent}
    </button>
  )
}
