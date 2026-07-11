import { PenLine, FileText, Share2, Mic, Users, Scissors } from 'lucide-react'
import { Card, CardContent } from '../../lib/shadcn/card'
import { Badge } from '../../lib/shadcn/badge'
import { Skill } from '../../models/types'

interface Props { skills: Skill[] }

// Ikon & warna default per nama skill
const skillConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Penulisan Konten': { icon: <PenLine className="w-7 h-7" />,   color: '#D56989', bg: 'rgba(213,105,137,0.1)'  },
  'Copywriting':      { icon: <FileText className="w-7 h-7" />,  color: '#4A7A2A', bg: 'rgba(194,220,128,0.2)'  },
  'Media Sosial':     { icon: <Share2 className="w-7 h-7" />,    color: '#D56989', bg: 'rgba(213,105,137,0.1)'  },
  'Voice Over':       { icon: <Mic className="w-7 h-7" />,       color: '#4A7A2A', bg: 'rgba(194,220,128,0.2)'  },
  'Public Speaking':  { icon: <Users className="w-7 h-7" />,     color: '#D56989', bg: 'rgba(213,105,137,0.1)'  },
  'Editing':          { icon: <Scissors className="w-7 h-7" />,  color: '#D56989', bg: 'rgba(213,105,137,0.1)'  },
}

const fallbackConfig = { icon: <PenLine className="w-7 h-7" />, color: '#D56989', bg: 'rgba(213,105,137,0.1)' }

export default function SkillsSection({ skills }: Props) {
  return (
    <section id="keahlian" className="py-12 md:py-16 lg:py-16" style={{ background: '#F3EEF1' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10" data-aos="fade-up">
          <Badge variant="outline" className="mb-2 text-xs tracking-widest uppercase rounded-full px-3 py-1 bg-pink-50"
            style={{ borderColor: '#EA9CAF', color: '#D56989' }}>
            Apa yang Aku Bisa
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{ color: '#D56989' }}>
            Keahlian & Layanan
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto mt-2"
            style={{ background: 'linear-gradient(90deg,#D56989,#EA9CAF)' }} />
          <p className="mt-3 text-xs max-w-md mx-auto" style={{ color: '#6B5B65' }}>
            Kemampuan yang terus diasah melalui pengalaman nyata, organisasi, dan proyek kreatif.
          </p>
        </div>

        {/* Grid layout yang lebih ringkas dan hemat ruang */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5" data-aos="fade-up" data-aos-delay="100">
          {skills.map((skill) => {
            const cfg = skillConfig[skill.name] ?? fallbackConfig
            return (
              <Card key={skill.id}
                className="border-0 rounded-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default group"
                style={{ boxShadow: '0 4px 12px rgba(213,105,137,0.05)', background: '#FFFFFF', color: '#D56989' }}>
                <CardContent className="p-3 text-center">
                  {/* Ikon yang disesuaikan ukurannya agar lebih proporsional */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2.5 transition-transform group-hover:scale-110"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {/* Skala ukuran ikon di dalamnya */}
                    <div className="scale-[0.65] flex items-center justify-center">
                      {cfg.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-[11px] md:text-xs line-clamp-2 px-1 leading-snug" style={{ color: '#D56989' }}>
                    {skill.name}
                  </h3>
                  {/* Garis bawah dekorasi */}
                  <div className="w-5 h-0.5 rounded-full mx-auto mt-1.5 opacity-40"
                    style={{ background: cfg.color }} />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
