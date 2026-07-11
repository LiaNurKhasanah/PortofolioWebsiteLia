import { ReactNode } from 'react'
import { Trophy, Award, CheckCircle2, ArrowRight, Star, BookOpen, FileCheck, Medal } from 'lucide-react'
import { Card, CardContent } from '../../lib/shadcn/card'
import { Badge } from '../../lib/shadcn/badge'
import FloralButton from '../shared/FloralButton'
import { Achievement, Certificate } from '../../models/types'

interface Props { achievements: Achievement[]; certificates: Certificate[] }

interface TypeMeta { icon: ReactNode; bg: string; color: string }

const typeMeta: Record<string, TypeMeta> = {
  competition:  { icon: <Medal className="w-4 h-4" />,      bg: 'rgba(213,105,137,0.08)', color: '#D56989' },
  ambassador:   { icon: <Star className="w-4 h-4" />,       bg: 'rgba(194,220,128,0.15)', color: '#4A7A2A' },
  publication:  { icon: <BookOpen className="w-4 h-4" />,   bg: 'rgba(123,104,170,0.1)',  color: '#7B68AA' },
  award:        { icon: <Trophy className="w-4 h-4" />,     bg: 'rgba(213,105,137,0.08)', color: '#D56989' },
  certificate:  { icon: <FileCheck className="w-4 h-4" />,  bg: 'rgba(194,220,128,0.15)', color: '#4A7A2A' },
}
const fallbackMeta: TypeMeta = { icon: <Award className="w-4 h-4" />, bg: 'rgba(213,105,137,0.08)', color: '#D56989' }

import { useState } from 'react'

export default function AchievementsSection({ achievements, certificates }: Props) {
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [showAllCertificates, setShowAllCertificates] = useState(false)

  // Batasi default tampilan: 3 prestasi dan 4 sertifikat
  const visibleAchievements = showAllAchievements ? achievements : achievements.slice(0, 3)
  const visibleCertificates = showAllCertificates ? certificates : certificates.slice(0, 4)

  return (
    <section id="prestasi" className="py-12 md:py-16 lg:py-16" style={{ background: '#F3EEF1' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10" data-aos="fade-up">
          <Badge variant="outline" className="mb-2 text-xs tracking-widest uppercase rounded-full px-3 py-1 bg-pink-50"
            style={{ borderColor: '#EA9CAF', color: '#D56989' }}>
            Pencapaian
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{ color: '#D56989' }}>
            Prestasi & Sertifikat
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto mt-2"
            style={{ background: 'linear-gradient(90deg,#D56989,#EA9CAF)' }} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Kolom kiri – prestasi */}
          <div data-aos="fade-right" data-aos-delay="100">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4" style={{ color: '#D56989' }} />
              <h3 className="font-bold text-base" style={{ color: '#D56989' }}>Prestasi</h3>
            </div>
            <div className="space-y-2.5">
              {visibleAchievements.map((a) => {
                const tVal = a.type?.toLowerCase()
                const typeKey = tVal === 'lomba' ? 'competition' : 
                                tVal === 'prestasi' ? 'award' : 
                                tVal === 'karya' ? 'publication' : 
                                a.type
                const meta = typeMeta[typeKey] ?? fallbackMeta
                return (
                  <Card key={a.id} className="border-0 rounded-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{
                      borderLeft: '5px solid #D56989',
                      boxShadow: '0 4px 12px rgba(213,105,137,0.05)',
                      background: '#FFFFFF',
                      color: '#D56989',
                    }}>
                    <CardContent className="p-4 flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110"
                        style={{ background: meta.bg, color: meta.color }}>
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs leading-snug" style={{ color: '#D56989' }}>
                          {a.title}
                        </p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {a.level && (
                            <Badge variant="secondary" className="text-[10px]"
                              style={{ background: 'rgba(213,105,137,0.1)', color: '#D56989', border: 'none' }}>
                              {a.level}
                            </Badge>
                          )}
                          {a.year && (
                            <span className="text-[10px]" style={{ color: '#8A7080' }}>{a.year}</span>
                          )}
                        </div>
                      </div>
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#C2DC80' }} />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            {achievements.length > 3 && (
              <FloralButton 
                variant="orchid" 
                onClick={() => setShowAllAchievements(prev => !prev)}
                className="mt-4"
              >
                {showAllAchievements ? 'Sembunyikan Prestasi' : 'Lihat Semua Prestasi'}{' '}
                <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllAchievements ? 'rotate-90' : ''}`} />
              </FloralButton>
            )}
          </div>

          {/* Kolom kanan – sertifikat */}
          <div data-aos="fade-left" data-aos-delay="200" className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4" style={{ color: '#C2DC80' }} />
              <h3 className="font-bold text-base" style={{ color: '#D56989' }}>Sertifikat</h3>
            </div>

            {certificates.length > 0 ? (
              <>
                {showAllCertificates ? (
                  /* Grid list jika "Lihat Semua" diklik */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-aos="fade-in">
                    {certificates.map((c) => (
                      <Card key={c.id} className="border-0 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                        style={{ boxShadow: '0 4px 15px rgba(194,220,128,0.15)', background: '#FFFFFF', color: '#D56989' }}
                        onClick={() => {
                          if (c.credential_url) {
                            window.open(c.credential_url, '_blank', 'noopener,noreferrer')
                          }
                        }}>
                        <CardContent className="p-4">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                            style={{ background: 'rgba(194,220,128,0.15)', color: '#4A7A2A' }}>
                            <FileCheck className="w-4.5 h-4.5" />
                          </div>
                          <p className="font-semibold text-xs leading-snug line-clamp-2" style={{ color: '#D56989' }}>
                            {c.title}
                          </p>
                          {c.issuer && <p className="text-[10px] mt-0.5 truncate" style={{ color: '#8A7080' }}>{c.issuer}</p>}
                          {c.issued_date && <p className="text-[10px] mt-0.5" style={{ color: '#8A7080' }}>{c.issued_date}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  /* Stacked Sheets Layout (max 3 lembar bertumpuk secara visual) */
                  <div className="relative h-[220px] w-full flex items-center justify-center" style={{ perspective: '1000px' }}>
                    {certificates.slice(0, 3).map((c, index) => {
                      // Desain style rotasi, skala, z-index, dan offset translasi
                      // Lembar teratas (index 0) tegak lurus, lembar ke-2 & ke-3 di bawahnya bergeser & miring sedikit
                      const depth = index
                      const rotate = index === 0 ? 0 : index === 1 ? -4 : 4
                      const translate = index === 0 ? 0 : index === 1 ? -6 : 6
                      const zIndex = 30 - depth * 10
                      const scale = 1 - depth * 0.04
                      const opacity = 1 - depth * 0.15

                      return (
                        <div
                          key={c.id}
                          className="absolute w-full max-w-[340px] transition-all duration-500 ease-out cursor-pointer hover:scale-[1.03]"
                          style={{
                            transform: `translateY(${translate}px) rotate(${rotate}deg) scale(${scale})`,
                            zIndex: zIndex,
                            opacity: opacity,
                            transformOrigin: 'bottom center',
                          }}
                          onClick={() => {
                            if (c.credential_url) {
                              window.open(c.credential_url, '_blank', 'noopener,noreferrer')
                            }
                          }}
                        >
                          <Card className="border-0 rounded-2xl shadow-lg border-2"
                            style={{ 
                              borderColor: 'rgba(194,220,128,0.2)',
                              boxShadow: '0 8px 30px rgba(194,220,128,0.18)', 
                              background: '#FFFFFF', 
                              color: '#D56989' 
                            }}>
                            <CardContent className="p-5 flex flex-col justify-between h-[180px]">
                              <div>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                                  style={{ background: 'rgba(194,220,128,0.15)', color: '#4A7A2A' }}>
                                  <FileCheck className="w-4.5 h-4.5" />
                                </div>
                                <p className="font-bold text-xs leading-snug line-clamp-2" style={{ color: '#D56989' }}>
                                  {c.title}
                                </p>
                              </div>
                              <div className="flex justify-between items-end mt-2">
                                <div className="min-w-0 flex-1 pr-2">
                                  {c.issuer && <p className="text-[10px] font-semibold truncate" style={{ color: '#4A7A2A' }}>{c.issuer}</p>}
                                  {c.issued_date && <p className="text-[9px] mt-0.5" style={{ color: '#8A7080' }}>{c.issued_date}</p>}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                                  style={{ background: 'rgba(213,105,137,0.1)', color: '#D56989' }}>
                                  Buka
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )
                    })}
                  </div>
                )}
                {certificates.length > 1 && (
                  <FloralButton 
                    variant="green" 
                    onClick={() => setShowAllCertificates(prev => !prev)}
                    className="mt-4"
                  >
                    {showAllCertificates ? 'Tampilan Tumpukan' : 'Lihat Semua Sertifikat'}{' '}
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllCertificates ? 'rotate-90' : ''}`} />
                  </FloralButton>
                )}
              </>
            ) : (
              <div className="rounded-2xl p-8 text-center"
                style={{ background: 'rgba(194,220,128,0.1)', border: '1px dashed rgba(194,220,128,0.4)' }}>
                <Award className="w-10 h-10 mx-auto mb-3" style={{ color: '#C2DC80' }} />
                <p className="text-sm font-medium" style={{ color: '#4A7A2A' }}>
                  Sertifikat akan segera ditambahkan
                </p>
                <p className="text-xs mt-1" style={{ color: '#8A7080' }}>
                  Kelola sertifikat melalui panel admin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
