import { ReactNode } from 'react'
import { Megaphone, Building2, Sparkles, BookOpen, BookMarked, Mic, Clock, ShoppingBag } from 'lucide-react'
import { Card, CardContent } from '../../lib/shadcn/card'
import { Badge } from '../../lib/shadcn/badge'
import FloralButton from '../shared/FloralButton'
import { VoiceOver } from '../../models/types'

interface Props { voiceOvers: VoiceOver[]; whatsapp?: string }

interface CategoryMeta { icon: ReactNode; color: string; bg: string }

const categoryMeta: Record<string, CategoryMeta> = {
  commercial:   { icon: <Megaphone className="w-5 h-5" />,  color: '#D56989', bg: 'rgba(213,105,137,0.1)'  },
  corporate:    { icon: <Building2 className="w-5 h-5" />,  color: '#7B68AA', bg: 'rgba(123,104,170,0.1)'  },
  event:        { icon: <Sparkles className="w-5 h-5" />,   color: '#D4845A', bg: 'rgba(212,132,90,0.1)'   },
  education:    { icon: <BookOpen className="w-5 h-5" />,   color: '#4A7A2A', bg: 'rgba(194,220,128,0.18)' },
  storytelling: { icon: <BookMarked className="w-5 h-5" />, color: '#D56989', bg: 'rgba(213,105,137,0.1)'  },
}
const fallbackMeta: CategoryMeta = { icon: <Mic className="w-5 h-5" />, color: '#D56989', bg: 'rgba(213,105,137,0.1)' }

function fmtDur(sec: number | null) {
  if (!sec) return null
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
}

export default function VoiceOverSection({ voiceOvers, whatsapp }: Props) {
  const waUrl = whatsapp?.trim()
    ? `https://wa.me/62${whatsapp.trim().replace(/^0/, '')}?text=Halo%20Lia%2C%20saya%20ingin%20memesan%20voice%20over.`
    : null

  return (
    <section id="voiceover" className="py-12 md:py-16 lg:py-16" style={{ background: '#FFFFFF' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10" data-aos="fade-up">
          <Badge variant="outline" className="mb-2 text-xs tracking-widest uppercase rounded-full px-3 py-1 bg-pink-50"
            style={{ borderColor: '#EA9CAF', color: '#D56989' }}>
            Suara Saya
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{ color: '#D56989' }}>
            Demo Voice Over
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto mt-2"
            style={{ background: 'linear-gradient(90deg,#D56989,#EA9CAF)' }} />
          <p className="mt-3 text-xs max-w-lg mx-auto" style={{ color: '#6B5B65' }}>
            Gaya suara yang <span style={{ color: '#D56989', fontWeight: 600 }}>hangat, jelas, dan komunikatif</span> — siap disesuaikan untuk kebutuhan brand, organisasi, maupun konten digital.
          </p>
        </div>

        {/* 3 audio player cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mb-10" data-aos="fade-up" data-aos-delay="100">
          {voiceOvers.map((vo) => {
            const meta = categoryMeta[vo.category] ?? fallbackMeta
            return (
              <Card key={vo.id} className="border-0 rounded-2xl transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl overflow-hidden"
                style={{ boxShadow: '0 4px 12px rgba(213,105,137,0.05)', background: '#FFFFFF', color: '#D56989' }}>
                <CardContent className="p-5">
                  {/* Header icon + durasi */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                      style={{ background: meta.bg, color: meta.color }}>
                      <div className="scale-75 flex items-center justify-center">
                        {meta.icon}
                      </div>
                    </div>
                    {fmtDur(vo.duration_seconds) && (
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 flex items-center gap-1"
                        style={{ background: 'rgba(194,220,128,0.2)', color: '#4A7A2A', border: 'none' }}>
                        <Clock className="w-2.5 h-2.5" />
                        {fmtDur(vo.duration_seconds)}
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-xs mb-0.5 line-clamp-1" style={{ color: '#D56989' }}>{vo.title}</h3>
                  <p className="text-[10px] mb-2" style={{ color: meta.color, fontStyle: 'italic' }}>{vo.voice_style}</p>
                  <p className="text-[11px] leading-relaxed mb-3 line-clamp-3" style={{ color: '#6B5B65' }}>{vo.description}</p>

                  {/* Audio demo player berbentuk bunga */}
                  <div className="flex justify-center mt-2">
                    {vo.audio_url ? (
                      <audio controls className="w-full h-8 rounded-xl">
                        <source src={vo.audio_url} type="audio/mpeg" />
                      </audio>
                    ) : (
                      <div className="w-full rounded-xl px-3 py-2 text-center text-[10px] font-medium"
                        style={{ background: meta.bg, color: meta.color }}>
                        Audio belum tersedia
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {voiceOvers.length === 0 && (
            <div className="col-span-full rounded-2xl p-8 text-center"
              style={{ background: 'rgba(213,105,137,0.05)', border: '1px dashed rgba(213,105,137,0.2)' }}>
              <p className="text-xs" style={{ color: '#8A7080' }}>Belum ada demo voice over yang ditambahkan.</p>
            </div>
          )}
        </div>

        {waUrl && (
          <div className="text-center" data-aos="fade-up" data-aos-delay="200">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3.5 px-6 py-4.5 rounded-2xl"
              style={{ background: 'linear-gradient(135deg,rgba(213,105,137,0.07),rgba(234,156,175,0.05))', border: '1px solid rgba(213,105,137,0.18)' }}>
              <div className="text-left">
                <p className="font-extrabold text-sm" style={{ color: '#D56989' }}>Butuh Voice Over Profesional?</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B5B65' }}>Hubungi langsung via WhatsApp</p>
              </div>
              <FloralButton variant="orchid" href={waUrl}>
                <ShoppingBag className="w-3.5 h-3.5" /> Pesan Voice Over
              </FloralButton>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
