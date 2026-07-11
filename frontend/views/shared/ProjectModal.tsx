import { Tag, ExternalLink, Wrench, ListChecks, Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../lib/shadcn/dialog'
import { Badge } from '../../lib/shadcn/badge'
import { Button } from '../../lib/shadcn/button'
import { Separator } from '../../lib/shadcn/separator'
import { Project } from '../../models/types'

interface Props { project: Project | null; onClose: () => void }

export default function ProjectModal({ project, onClose }: Props) {
  if (!project) return null

  return (
    <Dialog open={!!project} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ borderColor: 'rgba(234,156,175,0.3)', background: '#FFFFFF', color: '#D56989' }}>
        <DialogHeader>
          <div className="flex items-start gap-3 pr-6">
            <div>
              <Badge className="mb-2 text-xs" style={{ background: 'rgba(213,105,137,0.1)', color: '#D56989', border: 'none' }}>
                {project.category}
              </Badge>
              <DialogTitle className="text-xl font-bold leading-tight" style={{ color: '#D56989', fontFamily: 'Georgia, serif' }}>
                {project.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Meta */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs flex items-center gap-1.5"
              style={{ borderColor: 'rgba(213,105,137,0.3)', color: '#D56989' }}>
              <Tag className="w-3 h-3" /> {project.role}
            </Badge>
            {project.period && (
              <Badge variant="outline" className="text-xs"
                style={{ borderColor: 'rgba(194,220,128,0.4)', color: '#4A7A2A' }}>
                <Calendar className="w-3 h-3" /> {project.period}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Deskripsi */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#8A7080' }}>
              Tentang Proyek
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#3A2A30' }}>
              {project.description}
            </p>
          </div>

          {/* Tanggung jawab */}
          {project.responsibilities && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#8A7080' }}>
                <ListChecks className="w-3.5 h-3.5" style={{ color: '#D56989' }} /> Tanggung Jawab
              </p>
              <ul className="space-y-1.5">
                {project.responsibilities.split(',').map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#3A2A30' }}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#D56989' }} />
                    {r.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tools */}
          {project.tools && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: '#8A7080' }}>
                <Wrench className="w-3.5 h-3.5" style={{ color: '#C2DC80' }} /> Tools yang Digunakan
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tools.split(',').map((t, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(194,220,128,0.2)', color: '#4A7A2A' }}>
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hasil */}
          {project.results && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#8A7080' }}>
                Hasil & Dampak
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#3A2A30' }}>
                {project.results}
              </p>
            </div>
          )}

          {/* Tombol */}
          <div className="flex gap-3 pt-2">
            {project.project_url && (
              <Button asChild size="sm" className="rounded-full gap-1.5"
                style={{ background: '#D56989', color: '#fff', border: 'none' }}>
                <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                  Lihat Proyek <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-full"
              style={{ borderColor: '#D56989', color: '#D56989' }}>
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
