import { useState } from 'react'
import Image from 'next/image'
import { Play, FolderOpen, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '../../lib/shadcn/card'
import { Badge } from '../../lib/shadcn/badge'
import { Button } from '../../lib/shadcn/button'
import { Project } from '../../models/types'
import ProjectModal from '../shared/ProjectModal'

interface Props { projects: Project[] }

const gradients = [
  'linear-gradient(135deg,#FAE8EE,#F0D8E8)',
  'linear-gradient(135deg,#EEF3E8,#E0EDD8)',
  'linear-gradient(135deg,#EEF0FA,#E0E4F8)',
]

import FloralButton from '../shared/FloralButton'

export default function PortfolioSection({ projects }: Props) {
  const [selected, setSelected] = useState<Project | null>(null)
  const [showAll, setShowAll] = useState(false)

  // Tampilkan max 3 proyek secara default agar homepage tidak memanjang
  const visibleProjects = showAll ? projects : projects.slice(0, 3)

  return (
    <section id="portofolio" className="py-12 md:py-16 lg:py-16" style={{ background: '#F3EEF1' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10" data-aos="fade-up">
          <Badge variant="outline" className="mb-2 text-xs tracking-widest uppercase rounded-full px-3 py-1 bg-pink-50"
            style={{ borderColor: '#EA9CAF', color: '#D56989' }}>
            Karya Saya
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{ color: '#D56989' }}>
            Portofolio Pilihan
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto mt-2"
            style={{ background: 'linear-gradient(90deg,#D56989,#EA9CAF)' }} />
          <p className="mt-3 text-xs max-w-md mx-auto" style={{ color: '#6B5B65' }}>
            Klik kartu untuk melihat detail proyek yang telah saya kerjakan.
          </p>
        </div>

        {/* Grid kartu yang lebih kompak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-aos="fade-up" data-aos-delay="100">
          {visibleProjects.map((p, i) => (
            <Card key={p.id}
              className="border-0 rounded-2xl overflow-hidden cursor-pointer group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ boxShadow: '0 4px 12px rgba(213,105,137,0.05)', background: '#FFFFFF', color: '#D56989' }}
              onClick={() => setSelected(p)}>

              {/* Thumbnail yang lebih kecil */}
              <div className="relative h-32 overflow-hidden flex items-center justify-center"
                style={{ background: p.thumbnail_url ? undefined : gradients[i % gradients.length] }}>
                {p.thumbnail_url
                  ? <Image src={p.thumbnail_url} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <FolderOpen className="w-8 h-8 opacity-30" style={{ color: '#D56989' }} />}

                {/* Tombol play – tampil saat hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(213,105,137,0.25)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: '#D56989', boxShadow: '0 4px 12px rgba(213,105,137,0.3)' }}>
                    <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                  </div>
                </div>

                <Badge className="absolute top-2 left-2 text-[9px] px-1.5 py-0.5"
                  style={{ background: 'rgba(253,248,250,0.9)', color: '#D56989', border: 'none' }}>
                  {p.category}
                </Badge>
              </div>

              {/* Isi kartu yang lebih compact */}
              <CardContent className="p-3.5" style={{ background: '#FFFFFF' }}>
                <h3 className="font-bold text-xs mb-0.5 line-clamp-1" style={{ color: '#D56989' }}>
                  {p.title}
                </h3>
                <p className="text-[10px] font-medium mb-1" style={{ color: '#EA9CAF' }}>{p.role}</p>
                <p className="text-[11px] leading-relaxed line-clamp-2 mb-2.5" style={{ color: '#6B5B65' }}>
                  {p.description}
                </p>
                <Button variant="ghost" size="sm"
                  className="p-0 h-auto text-[10px] font-semibold gap-1 hover:gap-1.5 transition-all hover:bg-transparent"
                  style={{ color: '#D56989' }}>
                  Lihat Proyek <ArrowRight className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tombol Lihat Semua */}
        {projects.length > 3 && (
          <div className="flex justify-center mt-12" data-aos="fade-up">
            <FloralButton 
              variant="orchid" 
              onClick={() => setShowAll(prev => !prev)}
            >
              {showAll ? 'Sembunyikan Proyek' : 'Lihat Semua Portofolio'} 
              <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${showAll ? 'rotate-90' : ''}`} />
            </FloralButton>
          </div>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
