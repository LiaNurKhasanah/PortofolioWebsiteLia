import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../lib/shadcn/dialog'
import { Input } from '../../lib/shadcn/input'
import { Label } from '../../lib/shadcn/label'
import { Button } from '../../lib/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../lib/shadcn/select'
import { Badge } from '../../lib/shadcn/badge'
import { Loader2 } from 'lucide-react'
import CrudManager, { Column } from './CrudManager'
import { useGetData } from '../../hooks/backend/portfolio'
import { useSaveAchievement, useDeleteAchievement } from '../../hooks/backend/admin'
import { Achievement } from '../../models/types'

const emptyForm = { title: '', type: 'competition', year: new Date().getFullYear().toString(), level: '', organizer: '', description: '', is_featured: true, sort_order: 0 }
const typeOptions  = [
  { value:'competition',label:'Lomba'},
  { value:'ambassador',label:'Duta'},
  { value:'publication',label:'Publikasi'},
  { value:'award',label:'Penghargaan'},
  { value:'certificate',label:'Sertifikat'}
]
const levelOptions = ['Nasional','Internasional','Provinsi','Universitas','Kabupaten','Sekolah','Lainnya']

// Map legacy data types for backward compatibility
const mapType = (type: string): string => {
  const t = type?.toLowerCase()
  if (t === 'lomba') return 'competition'
  if (t === 'prestasi') return 'award'
  if (t === 'karya') return 'publication'
  return type
}

export default function AchievementsManager() {
  const { data, loading, trigger: load } = useGetData()
  const { trigger: save, loading: saving } = useSaveAchievement()
  const { trigger: del } = useDeleteAchievement()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{
    id?: number
    title: string
    type: string
    year: string
    level: string
    organizer: string
    description: string
    is_featured: boolean
    sort_order: number
  }>({
    title: '',
    type: 'competition',
    year: new Date().getFullYear().toString(),
    level: '',
    organizer: '',
    description: '',
    is_featured: true,
    sort_order: 0
  })

  useEffect(() => { load({}) }, [])

  const openAdd = () => { setForm(emptyForm); setOpen(true) }
  const openEdit = (a: Achievement) => {
    setForm({
      id: a.id,
      title: a.title,
      type: mapType(a.type),
      year: a.year ? a.year.toString() : '',
      level: a.level ?? '',
      organizer: a.organizer ?? '',
      description: a.description ?? '',
      is_featured: a.is_featured,
      sort_order: a.sort_order
    })
    setOpen(true)
  }
  const handleDelete = async (id: number) => { await del(id); load({ skipCache: true }) }
  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault()
    // Parse year: jika kosong simpan null, jika ada parse jadi number
    const parsedYear = form.year && form.year.trim() !== '' ? Number(form.year) : null
    const parsedLevel = form.level === 'none' || form.level === '' ? null : form.level

    await save({
      ...form,
      year: parsedYear as any,
      level: parsedLevel as any,
      organizer: form.organizer || undefined,
      description: form.description || undefined
    })
    setOpen(false); load({ skipCache: true })
  }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const columns: Column<Achievement>[] = [
    { header: 'Judul',   cell: a => <p className="font-medium text-sm max-w-xs">{a.title}</p> },
    { header: 'Tipe',    cell: a => {
      const typeVal = mapType(a.type)
      const label = typeOptions.find(t=>t.value===typeVal)?.label ?? a.type
      return <Badge variant="secondary" className="text-xs" style={{ background: 'rgba(213,105,137,0.1)', color: '#D56989', border: 'none' }}>{label}</Badge>
    } },
    { header: 'Tingkat', cell: a => a.level ? <Badge variant="secondary" className="text-xs" style={{ background: 'rgba(194,220,128,0.15)', color: '#4A7A2A', border: 'none' }}>{a.level}</Badge> : <span className="text-xs text-muted-foreground">–</span> },
    { header: 'Tahun',   cell: a => <span className="text-xs">{a.year ?? '–'}</span> },
  ]

  return (
    <>
      <CrudManager title="Prestasi" description="Penghargaan, lomba, dan pencapaian yang pernah diraih."
        columns={columns} data={data?.achievements ?? []} loading={loading}
        onAdd={openAdd} onEdit={a => openEdit(a as Achievement)} onDelete={handleDelete} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ borderColor: 'rgba(213,105,137,0.2)', background: '#FFFFFF', color: '#1A1A1A' }}>
          <DialogHeader><DialogTitle>{form.id ? 'Edit Prestasi' : 'Tambah Prestasi'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nama Prestasi *</Label>
              <Input value={form.title} onChange={set('title')} required className="rounded-xl" placeholder="cth: Juara 1 Lomba ..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tipe</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{typeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tingkat</Label>
                <Select value={form.level || 'none'} onValueChange={v => setForm(f => ({ ...f, level: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih tingkat" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa Tingkat (Kosong)</SelectItem>
                    {levelOptions.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tahun</Label>
                <Input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} className="rounded-xl" placeholder="cth: 2025" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Penyelenggara</Label>
                <Input value={form.organizer} onChange={set('organizer')} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Urutan Sortir</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="rounded-xl" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="feat_a" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
              <Label htmlFor="feat_a" className="text-xs cursor-pointer">Tampilkan di halaman publik</Label>
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
