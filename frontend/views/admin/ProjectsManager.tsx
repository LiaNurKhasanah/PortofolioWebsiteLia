import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../lib/shadcn/dialog'
import { Input } from '../../lib/shadcn/input'
import { Textarea } from '../../lib/shadcn/textarea'
import { Label } from '../../lib/shadcn/label'
import { Button } from '../../lib/shadcn/button'
import { Badge } from '../../lib/shadcn/badge'
import { Check } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import CrudManager, { Column } from './CrudManager'
import { useGetData } from '../../hooks/backend/portfolio'
import { useSaveProject, useDeleteProject } from '../../hooks/backend/admin'
import { Project } from '../../models/types'

const emptyForm = { title: '', category: '', role: '', period: '', description: '', responsibilities: '', tools: '', results: '', project_url: '', is_featured: true, sort_order: 0 }

export default function ProjectsManager() {
  const { data, loading, trigger: load } = useGetData()
  const { trigger: save, loading: saving } = useSaveProject()
  const { trigger: del } = useDeleteProject()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<typeof emptyForm & { id?: number }>(emptyForm)

  useEffect(() => { load({}) }, [])

  const openAdd = () => { setForm(emptyForm); setOpen(true) }
  const openEdit = (p: Project) => {
    setForm({ id: p.id, title: p.title, category: p.category, role: p.role, period: p.period ?? '', description: p.description, responsibilities: p.responsibilities ?? '', tools: p.tools ?? '', results: p.results ?? '', project_url: p.project_url ?? '', is_featured: p.is_featured, sort_order: p.sort_order })
    setOpen(true)
  }
  const handleDelete = async (id: number) => { await del(id); load({ skipCache: true }) }
  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault()
    await save({ ...form, period: form.period || undefined, responsibilities: form.responsibilities || undefined, tools: form.tools || undefined, results: form.results || undefined, project_url: form.project_url || undefined })
    setOpen(false); load({ skipCache: true })
  }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const columns: Column<Project>[] = [
    { header: 'Judul',     cell: p => <div><p className="font-medium text-sm">{p.title}</p><p className="text-xs" style={{ color: '#8A7080' }}>{p.role}</p></div> },
    { header: 'Kategori',  cell: p => <Badge variant="secondary" className="text-xs" style={{ background: 'rgba(213,105,137,0.1)', color: '#D56989', border: 'none' }}>{p.category}</Badge> },
    { header: 'Tools',     cell: p => <span className="text-xs line-clamp-1">{p.tools ?? '–'}</span> },
    { header: 'Unggulan',  cell: p => p.is_featured ? <Badge className="text-xs" style={{ background: 'rgba(194,220,128,0.2)', color: '#4A7A2A', border: 'none' }}><Check className="w-3 h-3" /></Badge> : <span className="text-xs text-muted-foreground">–</span> },
  ]

  return (
    <>
      <CrudManager title="Portofolio" description="Daftar proyek yang ditampilkan di halaman publik."
        columns={columns} data={data?.projects ?? []} loading={loading}
        onAdd={openAdd} onEdit={p => openEdit(p as Project)} onDelete={handleDelete} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ borderColor: 'rgba(213,105,137,0.2)', background: '#FFFFFF', color: '#1A1A1A' }}>
          <DialogHeader><DialogTitle>{form.id ? 'Edit Proyek' : 'Tambah Proyek'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Judul Proyek *</Label>
                <Input value={form.title} onChange={set('title')} required className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Kategori *</Label>
                <Input value={form.category} onChange={set('category')} placeholder="cth: Social Media" required className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Peran/Posisi *</Label>
                <Input value={form.role} onChange={set('role')} required className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Periode</Label>
                <Input value={form.period} onChange={set('period')} placeholder="cth: Jan–Mar 2024" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Deskripsi *</Label>
              <Textarea value={form.description} onChange={set('description')} required rows={3} className="rounded-xl resize-none" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tanggung Jawab (pisahkan dengan koma)</Label>
              <Textarea value={form.responsibilities} onChange={set('responsibilities')} rows={2} className="rounded-xl resize-none" placeholder="Tugas A, Tugas B, Tugas C" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tools (pisahkan dengan koma)</Label>
                <Input value={form.tools} onChange={set('tools')} placeholder="Canva, Notion, ..." className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Link Proyek (URL)</Label>
                <Input value={form.project_url} onChange={set('project_url')} placeholder="https://..." className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Hasil & Dampak</Label>
              <Textarea value={form.results} onChange={set('results')} rows={2} className="rounded-xl resize-none" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="feat" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
                <Label htmlFor="feat" className="text-xs cursor-pointer">Tampilkan sebagai proyek unggulan</Label>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Label className="text-xs">Urutan</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="rounded-xl w-20" />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Batal</Button>
              <Button type="submit" disabled={saving} className="rounded-xl gap-2" style={{ background: '#D56989', color: '#fff', border: 'none' }}>
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
