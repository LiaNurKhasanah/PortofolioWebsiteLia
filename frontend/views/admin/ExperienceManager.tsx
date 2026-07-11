import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../lib/shadcn/dialog'
import { Input } from '../../lib/shadcn/input'
import { Textarea } from '../../lib/shadcn/textarea'
import { Label } from '../../lib/shadcn/label'
import { Button } from '../../lib/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../lib/shadcn/select'
import { Badge } from '../../lib/shadcn/badge'
import { Loader2 } from 'lucide-react'
import CrudManager, { Column } from './CrudManager'
import { useGetData } from '../../hooks/backend/portfolio'
import { useSaveExperience, useDeleteExperience } from '../../hooks/backend/admin'
import { Experience } from '../../models/types'

const emptyForm = { title: '', organization: '', role_type: 'organization', period_start: '', period_end: '', description: '', is_current: false, sort_order: 0 }
const roleOptions = [
  { value: 'organization', label: 'Organisasi' },
  { value: 'freelance',    label: 'Freelance'  },
  { value: 'internship',   label: 'Magang'     },
  { value: 'fulltime',     label: 'Full-time'  },
]

export default function ExperienceManager() {
  const { data, loading, trigger: load } = useGetData()
  const { trigger: save, loading: saving } = useSaveExperience()
  const { trigger: del } = useDeleteExperience()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<typeof emptyForm & { id?: number }>(emptyForm)

  useEffect(() => { load({}) }, [])

  const openAdd = () => { setForm(emptyForm); setOpen(true) }
  const openEdit = (e: Experience) => {
    setForm({ id: e.id, title: e.title, organization: e.organization, role_type: e.role_type, period_start: e.period_start ?? '', period_end: e.period_end ?? '', description: e.description, is_current: e.is_current, sort_order: e.sort_order })
    setOpen(true)
  }
  const handleDelete = async (id: number) => { await del(id); load({ skipCache: true }) }
  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault()
    await save({ ...form, period_start: form.period_start || undefined, period_end: form.period_end || undefined })
    setOpen(false); load({ skipCache: true })
  }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const columns: Column<Experience>[] = [
    { header: 'Posisi',       cell: e => <div><p className="font-medium text-sm">{e.title}</p><p className="text-xs" style={{ color: '#D56989' }}>{e.organization}</p></div> },
    { header: 'Tipe',         cell: e => <Badge variant="secondary" className="text-xs" style={{ background: 'rgba(213,105,137,0.1)', color: '#D56989', border: 'none' }}>{roleOptions.find(r => r.value === e.role_type)?.label ?? e.role_type}</Badge> },
    { header: 'Periode',      cell: e => <span className="text-xs">{[e.period_start, e.period_end].filter(Boolean).join(' – ') || '–'}</span> },
    { header: 'Status',       cell: e => e.is_current ? <Badge className="text-xs" style={{ background: 'rgba(194,220,128,0.2)', color: '#4A7A2A', border: 'none' }}>Aktif</Badge> : null },
  ]

  return (
    <>
      <CrudManager title="Pengalaman" description="Riwayat organisasi, magang, dan freelance."
        columns={columns} data={data?.experiences ?? []} loading={loading}
        onAdd={openAdd} onEdit={(e) => openEdit(e as Experience)} onDelete={handleDelete} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ borderColor: 'rgba(213,105,137,0.2)', background: '#FFFFFF', color: '#1A1A1A' }}>
          <DialogHeader><DialogTitle>{form.id ? 'Edit Pengalaman' : 'Tambah Pengalaman'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Posisi/Jabatan *</Label>
                <Input value={form.title} onChange={set('title')} required className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Nama Organisasi *</Label>
                <Input value={form.organization} onChange={set('organization')} required className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tipe</Label>
                <Select value={form.role_type} onValueChange={v => setForm(f => ({ ...f, role_type: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{roleOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Urutan</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Mulai (cth: Jan 2023)</Label>
                <Input value={form.period_start} onChange={set('period_start')} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Selesai (atau "Sekarang")</Label>
                <Input value={form.period_end} onChange={set('period_end')} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Deskripsi</Label>
              <Textarea value={form.description} onChange={set('description')} rows={3} className="rounded-xl resize-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_cur" checked={form.is_current} onChange={e => setForm(f => ({ ...f, is_current: e.target.checked }))} />
              <Label htmlFor="is_cur" className="text-xs cursor-pointer">Masih aktif hingga sekarang</Label>
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
