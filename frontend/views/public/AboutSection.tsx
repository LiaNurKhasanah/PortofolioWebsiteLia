import Image from 'next/image'
import { MessageCircle, Sparkles, Briefcase, Handshake, Star, Heart, Target } from 'lucide-react'
import { Card, CardContent } from '../../lib/shadcn/card'
import { Badge } from '../../lib/shadcn/badge'
import { Profile, CharacterValue } from '../../models/types'
import { COLORS } from '../../models/constants'
import LiaPhoto from './Assets/LiaNurKhasanah.png'
import Lily4 from './Assets/lily4.png'

interface Props { 
  profile: Profile | null
  characterValues: CharacterValue[] 
}

const topikKetertarikan = ['Komunikasi Digital','Content Writing','Personal Branding','Public Speaking','Voice Over','Social Media']

// Helper to map string to actual Lucide component
function getIcon(name: string) {
  switch (name) {
    case 'MessageCircle': return <MessageCircle className="w-5 h-5" />
    case 'Sparkles': return <Sparkles className="w-5 h-5" />
    case 'Briefcase': return <Briefcase className="w-5 h-5" />
    case 'Handshake': return <Handshake className="w-5 h-5" />
    case 'Star': return <Star className="w-5 h-5" />
    case 'Heart': return <Heart className="w-5 h-5" />
    case 'Target': return <Target className="w-5 h-5" />
    default: return <Star className="w-5 h-5" />
  }
}

export default function AboutSection({ profile, characterValues }: Props) {
  const bio = profile?.bio?.trim()

  return (
    <section id="about" className="py-12 md:py-16 lg:py-16 relative overflow-visible" style={{ background: '#FFFFFF' }}>
      {/* Lily 4 sits on the pink/white boundary between Hero and About. */}
      <div
        className="absolute top-[-34px] -translate-y-1/2 left-0 w-40 h-40 md:w-56 md:h-56 xl:w-72 xl:h-72 pointer-events-none z-0 select-none opacity-100 hidden md:block"
        style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.95)) drop-shadow(0 0 44px rgba(255,255,255,0.75))' }}
      >
        <Image src={Lily4} alt="Left lily decoration on About boundary" className="object-contain" fill />
      </div>
      <div
        className="absolute top-[-34px] -translate-y-1/2 right-0 w-40 h-40 md:w-56 md:h-56 xl:w-72 xl:h-72 pointer-events-none z-0 select-none opacity-100 hidden md:block"
        style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.95)) drop-shadow(0 0 44px rgba(255,255,255,0.75))' }}
      >
        <Image src={Lily4} alt="Right lily decoration on About boundary" className="object-contain scale-x-[-1]" fill />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10" data-aos="fade-up">
          <Badge variant="outline" className="mb-2 text-xs tracking-widest uppercase rounded-full px-3 py-1 bg-pink-50"
            style={{ borderColor: COLORS.pink, color: COLORS.orchid }}>
            Tentang Saya
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: COLORS.orchid }}>
            Kenali Aku Lebih Dekat
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto mt-2" style={{ background: `linear-gradient(90deg,${COLORS.orchid},${COLORS.pink})` }} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Kiri – foto profil bulat */}
          <div className="flex justify-center md:justify-start" data-aos="fade-right">
            <div className="relative">
              <div className="w-56 h-56 flex items-center justify-center relative transition-all hover:scale-[1.03] duration-500"
                style={{
                  border: 'none',
                  filter: 'drop-shadow(0 16px 28px rgba(213,105,137,0.35))',
                }}>
                <Image
                  src={profile?.about_photo_url || profile?.photo_url || LiaPhoto}
                  alt={profile?.name ?? 'Foto Profil'}
                  fill
                  sizes="224px"
                  className="object-contain"
                />
              </div>
              {/* Kartu dekorasi */}
              <div className="absolute -bottom-1 -right-1 px-3 py-1.5 rounded-xl shadow-md transition-transform hover:scale-105"
                style={{ background: COLORS.green, color: '#3A5A1A', border: '2px solid #fff' }}>
                <p className="text-[9px] font-bold flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" /> {profile?.tagline ?? 'Profil'}</p>
              </div>
            </div>
          </div>

          {/* Kanan – bio */}
          <div data-aos="fade-left" data-aos-delay="150" className="flex flex-col justify-between h-full">
            {bio ? (
              <div>
                <div className="text-2xl font-serif mb-1" style={{ color: COLORS.pink }}>"</div>
                <p className="text-xs md:text-sm leading-relaxed mb-3 text-justify" style={{ color: '#3A2A30' }}>
                  {bio}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl p-4 mb-3 text-xs font-medium text-center"
                style={{ background: 'rgba(213,105,137,0.08)', color: COLORS.orchid }}>
                Bio profil belum tersedia.
              </div>
            )}

            {/* Topik ketertarikan */}
            <div className="flex flex-wrap gap-1 mb-2">
              {topikKetertarikan.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-md text-[9px] font-medium"
                  style={{ background: 'rgba(194,220,128,0.2)', color: '#4A7A2A', border: '1px solid rgba(194,220,128,0.4)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Kartu nilai dinamis dari database (Full Width di bawah Grid Foto & Bio) */}
        {characterValues && characterValues.length > 0 && (
          <div className="mt-10" data-aos="fade-up" data-aos-delay="200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {characterValues.map((cv, i) => {
                const colors = [
                  { bg: 'linear-gradient(135deg, rgba(213,105,137,0.08), rgba(234,156,175,0.12))', iconBg: COLORS.orchid, iconColor: '#fff' },
                  { bg: 'linear-gradient(135deg, rgba(194,220,128,0.12), rgba(194,220,128,0.2))', iconBg: '#C2DC80', iconColor: '#3A5A1A' },
                  { bg: 'linear-gradient(135deg, rgba(234,156,175,0.1), rgba(213,105,137,0.06))', iconBg: COLORS.pink, iconColor: '#fff' },
                  { bg: 'linear-gradient(135deg, rgba(194,220,128,0.08), rgba(213,105,137,0.06))', iconBg: COLORS.orchid, iconColor: '#fff' },
                ]
                const c = colors[i % colors.length]
                return (
                  <div key={cv.id}
                    className="group rounded-xl p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
                    style={{ background: c.bg }}>
                    {/* Dekorasi lingkaran blur */}
                    <div className="absolute -top-6 -right-6 w-14 h-14 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"
                      style={{ background: c.iconBg, filter: 'blur(20px)' }} />
                    <div className="relative z-10">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-105 group-hover:rotate-3"
                        style={{ background: c.iconBg, color: c.iconColor, boxShadow: `0 3px 8px ${c.iconBg}22` }}>
                        {getIcon(cv.icon_name)}
                      </div>
                      <p className="font-bold text-[11px] mb-0.5" style={{ color: COLORS.orchid }}>{cv.title}</p>
                      <p className="text-[10px] leading-relaxed text-justify" style={{ color: '#8A7080' }}>{cv.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}