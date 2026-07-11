import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../lib/shadcn/dialog'
import { Input } from '../../lib/shadcn/input'
import { Textarea } from '../../lib/shadcn/textarea'
import { Label } from '../../lib/shadcn/label'
import { Button } from '../../lib/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../lib/shadcn/select'
import { Badge } from '../../lib/shadcn/badge'
import { Loader2, Clock } from 'lucide-react'
import CrudManager, { Column } from './CrudManager'
import { useGetData } from '../../hooks/backend/portfolio'
import { useSaveVoiceOver, useDeleteVoiceOver } from '../../hooks/backend/admin'
import { VoiceOver } from '../../models/types'

const emptyForm = { title: '', category: 'commercial', description: '', voice_style: '', use_case: '', audio_url: '', duration_seconds: 0, is_featured: true, sort_order: 0 }
const cats = [
  { value: 'commercial',   label: 'Komersial'   },
  { value: 'corporate',    label: 'Korporat'    },
  { value: 'event',        label: 'Event'       },
  { value: 'education',    label: 'Edukasi'     },
  { value: 'storytelling', label: 'Storytelling' },
]

function fmtDur(sec: number | null) {
  if (!sec) return '–'
  return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`
}

export default function VoiceOverManager() {
  const { data, loading, trigger: load } = useGetData()
  const { trigger: save, loading: saving } = useSaveVoiceOver()
  const { trigger: del } = useDeleteVoiceOver()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<typeof emptyForm & { id?: number }>(emptyForm)

  useEffect(() => { load({}) }, [])

  const openAdd = () => { setForm(emptyForm); setOpen(true) }
  const openEdit = (v: VoiceOver) => {
    setForm({ id: v.id, title: v.title, category: v.category, description: v.description, voice_style: v.voice_style, use_case: v.use_case, audio_url: v.audio_url ?? '', duration_seconds: v.duration_seconds ?? 0, is_featured: v.is_featured, sort_order: v.sort_order })
    setOpen(true)
  }
  const handleDelete = async (id: number) => { await del(id); load({ skipCache: true }) }
  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault()
    await save({ ...form, audio_url: form.audio_url || undefined, duration_seconds: form.duration_seconds || undefined })
    setOpen(false); load({ skipCache: true })
  }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const columns: Column<VoiceOver>[] = [
    { header: 'Judul',        cell: v => <div><p className="font-medium text-sm">{v.title}</p><p className="text-xs italic" style={{ color: '#8A7080' }}>{v.voice_style}</p></div> },
    { header: 'Kategori',     cell: v => <Badge variant="secondary" className="text-xs" style={{ background: 'rgba(213,105,137,0.1)', color: '#D56989', border: 'none' }}>{cats.find(c=>c.value===v.category)?.label ?? v.category}</Badge> },
    { header: 'Durasi',       cell: v => <span className="text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{fmtDur(v.duration_seconds)}</span> },
    { header: 'Audio',        cell: v => v.audio_url ? <Badge className="text-xs" style={{ background: 'rgba(194,220,128,0.2)', color: '#4A7A2A', border: 'none' }}>Ada</Badge> : <span className="text-xs" style={{ color: '#8A7080' }}>Belum ada</span> },
  ]

  return (
    <>
      <CrudManager title="Demo Voice Over" description="Demo audio yang ditampilkan di halaman publik."
        columns={columns} data={data?.voiceOvers ?? []} loading={loading}
        onAdd={openAdd} onEdit={v => openEdit(v as VoiceOver)} onDelete={handleDelete} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ borderColor: 'rgba(213,105,137,0.2)', background: '#FFFFFF', color: '#1A1A1A' }}>
          <DialogHeader><DialogTitle>{form.id ? 'Edit Voice Over' : 'Tambah Voice Over'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Judul *</Label>
              <Input value={form.title} onChange={set('title')} required className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Kategori</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{cats.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Durasi (detik)</Label>
                <Input type="number" value={form.duration_seconds} onChange={e => setForm(f => ({ ...f, duration_seconds: Number(e.target.value) }))} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Gaya Suara</Label>
              <Input value={form.voice_style} onChange={set('voice_style')} placeholder="cth: Hangat, empatik, tulus" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Cocok Untuk</Label>
              <Input value={form.use_case} onChange={set('use_case')} placeholder="cth: Iklan produk, brand campaign" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Deskripsi</Label>
              <Textarea value={form.description} onChange={set('description')} rows={2} className="rounded-xl resize-none" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">URL Audio (opsional)</Label>
              <Input value={form.audio_url} onChange={set('audio_url')} placeholder="https://..." className="rounded-xl" />
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
