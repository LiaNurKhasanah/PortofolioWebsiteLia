import { useState } from 'react'
import { Building2, Tv, Radio, BookOpen, Users, Calendar, Briefcase, GraduationCap } from 'lucide-react'
import { Badge } from '../../lib/shadcn/badge'
import { Card, CardContent } from '../../lib/shadcn/card'
import { Experience } from '../../models/types'

interface Props { experiences: Experience[] }

// Ikon per nama organisasi
const orgIcon: Record<string, React.ReactNode> = {
  'SKID':           <BookOpen className="w-5 h-5" />,
  'ICA TV UMP':     <Tv className="w-5 h-5" />,
  'WARDAH TV UMP':  <Tv className="w-5 h-5" />,
  'MAMET FM 95.7':  <Radio className="w-5 h-5" />,
  'IPR UMP':        <Users className="w-5 h-5" />,
}

const roleLabel: Record<string, string> = {
  organization: 'Organisasi',
  organisasi:   'Organisasi',
  freelance:    'Freelance',
  pekerjaan:    'Pekerjaan',
  internship:   'Magang',
  magang:       'Magang',
  fulltime:     'Full-time',
}

export default function ExperienceSection({ experiences }: Props) {
  const [activeTab, setActiveTab] = useState<'professional' | 'academic'>('professional')

  // Filter pengalaman berdasarkan tipe karir (mendukung baik Inggris maupun Indonesia untuk kompatibilitas data)
  const professionalExps = experiences.filter(exp => {
    const role = exp.role_type?.toLowerCase()
    return role === 'freelance' || role === 'internship' || role === 'fulltime' || 
           role === 'pekerjaan' || role === 'magang'
  })
  const academicExps = experiences.filter(exp => {
    const role = exp.role_type?.toLowerCase()
    return role === 'organization' || role === 'organisasi'
  })

  const activeExps = activeTab === 'professional' ? professionalExps : academicExps

  return (
    <section id="pengalaman" className="py-12 md:py-16 lg:py-16" style={{ background: '#FFFFFF' }}>
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8" data-aos="fade-up">
          <Badge variant="outline" className="mb-2 text-xs tracking-widest uppercase rounded-full px-3 py-1 bg-pink-50"
            style={{ borderColor: '#EA9CAF', color: '#D56989' }}>
            Rekam Jejak
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{ color: '#D56989' }}>
            Pengalaman
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto mt-2"
            style={{ background: 'linear-gradient(90deg,#D56989,#EA9CAF)' }} />
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2.5 mb-8" data-aos="fade-up" data-aos-delay="50">
          <button
            onClick={() => setActiveTab('professional')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              activeTab === 'professional'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-200/50'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
            style={{ borderRadius: '0.75rem' }}
          >
            <Briefcase className="w-3.5 h-3.5" /> Karir & Profesional ({professionalExps.length})
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              activeTab === 'academic'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-200/50'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
            style={{ borderRadius: '0.75rem' }}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Organisasi ({academicExps.length})
          </button>
        </div>

        {/* List pengalaman */}
        <div className="space-y-3" data-aos="fade-up" data-aos-delay="100">
          {activeExps.map((exp, i) => {
            const icon = orgIcon[exp.organization] ?? <Building2 className="w-4 h-4" />
            const isFirst = i === 0
            return (
              <Card key={exp.id} className="border-0 rounded-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ boxShadow: '0 4px 15px rgba(213,105,137,0.05)', borderLeft: `5px solid ${isFirst ? '#D56989' : 'rgba(213,105,137,0.2)'}`, background: '#FFFFFF', color: '#D56989' }}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Logo org */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: isFirst ? '#D56989' : 'rgba(213,105,137,0.1)', color: isFirst ? '#fff' : '#D56989' }}>
                      {icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-1">
                        <div>
                          <h3 className="font-bold text-xs md:text-sm animate-fade-in" style={{ color: '#D56989' }}>
                            {exp.title}
                          </h3>
                          <p className="font-semibold text-xs mt-0.5" style={{ color: '#D56989' }}>
                            {exp.organization}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] px-2 py-0"
                            style={{ background: 'rgba(213,105,137,0.1)', color: '#D56989', border: 'none' }}>
                            {roleLabel[exp.role_type] ?? exp.role_type}
                          </Badge>
                          {exp.is_current && (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0"
                              style={{ background: 'rgba(194,220,128,0.2)', color: '#4A7A2A', border: 'none' }}>
                              Aktif
                            </Badge>
                          )}
                        </div>
                      </div>

                      {(exp.period_start ?? exp.period_end) && (
                        <p className="text-[10px] mt-1 mb-1.5 flex items-center gap-1" style={{ color: '#8A7080' }}>
                          <Calendar className="w-3 h-3" />
                          {[exp.period_start, exp.period_end].filter(Boolean).join(' – ')}
                        </p>
                      )}
                      <p className="text-xs leading-relaxed" style={{ color: '#5A4A50' }}>
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {activeExps.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-400 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              Belum ada riwayat untuk kategori ini.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
