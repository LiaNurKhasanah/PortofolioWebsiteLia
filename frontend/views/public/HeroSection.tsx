import { useState } from 'react'
import Image from 'next/image'
import { Download, Mic, Eye, Sparkles } from 'lucide-react'
import { Profile } from '../../models/types'
import { SITE, COLORS } from '../../models/constants'
import FloralButton from '../shared/FloralButton'
import LiaPhoto from './Assets/LiaNurKhasanah.png'
import Lily1 from './Assets/lily1.png'
import Lily2 from './Assets/lily2.png'
import Lily3 from './Assets/lily3.png'

interface Props {
  profile: Profile | null
  projectsCount?: number
  experiencesCount?: number
  voiceOversCount?: number
}

export default function HeroSection({
  profile,
  projectsCount = 5,
  experiencesCount = 5,
  voiceOversCount = 3
}: Props) {
  const [isHovered, setIsHovered] = useState(false)

  const go = (id: string) => {
    const selector = `#${id}`
    if (window.lenis) {
      window.lenis.scrollTo(selector, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Visual stats pencapaian yang dinamis (CRUD)
  const statsList = [
    { n: projectsCount >= 5 ? `${projectsCount}+` : `${projectsCount}`, l: 'Proyek' },
    { n: `${experiencesCount}`, l: 'Organisasi' },
    { n: `${voiceOversCount}`, l: 'Demo VO' }
  ]

  return (
    <section id="home" className="min-h-screen flex items-center pt-16 relative overflow-hidden"
      style={{ background: 'rgba(213, 105, 137, 0.2)' }}>

      {/* Grid Pattern (kotak-kotak) */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.45) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Blob dekorasi */}
      <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:COLORS.pink, opacity:0.18, filter:'blur(70px)', top:-80, right:-60, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:220, height:220, borderRadius:'50%', background:COLORS.green, opacity:0.18, filter:'blur(60px)', bottom:60, left:-40, pointerEvents:'none' }} />

      {/* Hanging Lily 1, 2, 3 below Navbar (opacity 1, sway-hanging animation) */}
      {/* On mobile, they are scaled down and adjusted to not clutter the header. Placed higher (top-0 or negative top) to merge seamlessly with navbar */}
      <div className="absolute top-[-10px] md:top-[-25px] left-[5%] w-16 h-28 md:w-28 md:h-48 pointer-events-none z-20 select-none opacity-100 animate-sway-hanging origin-top">
        <Image src={Lily1} alt="Hanging Lily 1" className="object-contain" fill />
      </div>
      <div className="absolute top-[-10px] md:top-[-25px] left-[35%] w-14 h-24 md:w-24 md:h-40 pointer-events-none z-20 select-none opacity-100 animate-sway-hanging-delayed origin-top">
        <Image src={Lily2} alt="Hanging Lily 2" className="object-contain" fill />
      </div>
      <div className="absolute top-[-10px] md:top-[-25px] right-[25%] w-16 h-28 md:w-28 md:h-48 pointer-events-none z-20 select-none opacity-100 animate-sway-hanging origin-top hidden sm:block">
        <Image src={Lily3} alt="Hanging Lily 3" className="object-contain" fill />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 pt-8 pb-12 md:pt-3 md:pb-12 lg:pt-1 lg:pb-10 w-full relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-8 lg:gap-10">

          {/* Kiri – teks */}
          <div className="flex-grow flex-shrink basis-[54%] text-center md:text-left flex flex-col items-center md:items-start md:pt-8 lg:pt-10 md:pl-4 lg:pl-6" data-aos="fade-right">
            <h1 className="text-4xl md:text-[2.95rem] lg:text-[3.15rem] font-extrabold leading-tight mb-3 tracking-tight w-full"
              style={{ color: COLORS.orchid }}>
              {profile?.name ?? SITE.fullName}
            </h1>

            {/* Teks "Saya membantu..." */}
            <p className="text-sm md:text-[0.95rem] lg:text-base font-medium mb-5 w-full max-w-2xl" style={{ color: COLORS.textMuted }}>
              {profile?.headline ?? SITE.headline}
            </p>

            {/* Stats kecil diletakkan di TENGAH-TENGAH (antara teks "Saya membantu..." dan teks tagline "Mahasiswi...") */}
            <div className="inline-flex items-center justify-center gap-1.5 p-0.5 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 shadow-sm mb-4">
              {statsList.map(({ n, l }, idx) => (
                <div key={l} className="flex items-center gap-1.5 px-2.5 py-1">
                  <span className="text-xs md:text-sm font-extrabold" style={{ color: COLORS.orchid }}>{n}</span>
                  <span className="text-[9px] md:text-[10px] font-semibold tracking-wide uppercase" style={{ color: '#8A7080' }}>{l}</span>
                  {idx < statsList.length - 1 && <div className="w-1 h-1 rounded-full bg-pink-300/60 ml-1" />}
                </div>
              ))}
            </div>

            {/* Teks tagline "Mahasiswi Ilmu Komunikasi..." */}
            <p className="text-[11px] md:text-xs leading-relaxed mb-5 max-w-lg italic w-full"
              style={{ color: '#8A7080' }}>
              "{profile?.tagline ?? SITE.tagline}"
            </p>

            {/* 3 tombol CTA */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2 w-full">
              <FloralButton variant="orchid" onClick={() => go('portofolio')}>
                <Eye className="w-3.5 h-3.5" /> Portofolio
              </FloralButton>
              <FloralButton variant="pink" onClick={() => go('voiceover')}>
                <Mic className="w-3.5 h-3.5" /> Demo VO
              </FloralButton>
              {profile?.cv_url ? (
                <FloralButton variant="green" href={profile.cv_url}>
                  <Download className="w-3.5 h-3.5" /> Unduh CV
                </FloralButton>
              ) : (
                <FloralButton variant="green" onClick={() => go('kontak')}>
                  <Download className="w-3.5 h-3.5" /> Unduh CV
                </FloralButton>
              )}
            </div>
          </div>

          {/* Kanan – foto profil bulat minimalis */}
          <div className="flex-shrink-0 flex justify-center w-full md:w-auto md:-mt-12 lg:-mt-16" data-aos="fade-left" data-aos-delay="200">
            <div 
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div 
                className="w-[17rem] h-[17rem] md:w-[23rem] md:h-[23rem] lg:w-[28rem] lg:h-[28rem] xl:w-[30rem] xl:h-[30rem] flex items-center justify-center relative select-none transition-all duration-300 hover:scale-[1.03]"
                style={{
                  border: 'none',
                  filter: isHovered 
                    ? 'drop-shadow(0 16px 36px rgba(194,220,128,0.65))' 
                    : 'drop-shadow(0 16px 36px rgba(213,105,137,0.45))',
                }}>
                <Image
                  src={profile?.photo_url || LiaPhoto}
                  alt={profile?.name ?? 'Lia Nur Khasanah'}
                  fill
                  sizes="(max-width: 768px) 272px, (max-width: 1024px) 368px, 480px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Badge Dinamis dengan Animasi Slide & Height Expansion saat Hover */}
              <div 
                className="absolute bottom-[24%] left-1/2 -translate-x-1/2 select-none overflow-hidden rounded-2xl px-5 flex flex-col items-center justify-center border-2 border-white transition-all duration-500 ease-in-out shadow-lg z-20"
                style={{
                  height: isHovered ? '60px' : '34px',
                  background: isHovered ? COLORS.green : COLORS.pink,
                  color: isHovered ? '#3A5A1A' : '#ffffff',
                  boxShadow: isHovered ? '0 8px 22px rgba(194,220,128,0.55)' : '0 8px 22px rgba(213,105,137,0.38)',
                  minWidth: isHovered ? '190px' : '175px'
                }}
              >
                <div className="flex flex-col items-center justify-center w-full h-full text-center">
                  {/* Baris 1: Nama Lia Nur Khasanah (Lebih Besar) */}
                  <span className={`transition-all duration-300 font-extrabold tracking-wide ${isHovered ? 'text-xs md:text-sm mb-0.5' : 'text-[11px] md:text-sm'}`}>
                    {profile?.name ?? SITE.fullName}
                  </span>
                  
                  {/* Baris 2: Open for Work (Muncul dengan slide/fade jika active/hovered) */}
                  <div className={`flex items-center gap-1.5 transition-all duration-500 ease-in-out whitespace-nowrap ${
                    isHovered ? 'opacity-100 transform translate-y-0 h-4' : 'opacity-0 transform -translate-y-2 h-0 overflow-hidden pointer-events-none'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span className="text-[10px] md:text-xs font-bold">Open for Work</span>
                  </div>
                </div>
              </div>
            </div>
            
            <style>{`
              @keyframes swayHanging {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(5deg); }
              }
              @keyframes swayHangingDelayed {
                0%, 100% { transform: rotate(4deg); }
                50% { transform: rotate(-4deg); }
              }
              .animate-sway-hanging {
                animation: swayHanging 4.5s ease-in-out infinite;
              }
              .animate-sway-hanging-delayed {
                animation: swayHangingDelayed 5s ease-in-out infinite;
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center opacity-40">
        <p className="text-xs mb-1" style={{ color: '#8A7080' }}>scroll</p>
        <div className="w-0.5 h-8 mx-auto rounded-full" style={{ background: COLORS.orchid, animation: 'pulse 2s infinite' }} />
      </div>
    </section>
  )
}