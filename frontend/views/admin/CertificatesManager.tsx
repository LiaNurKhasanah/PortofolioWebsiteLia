import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../lib/shadcn/dialog'
import { Input } from '../../lib/shadcn/input'
import { Label } from '../../lib/shadcn/label'
import { Button } from '../../lib/shadcn/button'
import { Badge } from '../../lib/shadcn/badge'
import { Loader2, ExternalLink } from 'lucide-react'
import CrudManager, { Column } from './CrudManager'
import { useGetData } from '../../hooks/backend/portfolio'
import { useSaveCertificate, useDeleteCertificate } from '../../hooks/backend/admin'
import { Certificate } from '../../models/types'

const emptyForm = { title: '', issuer: '', issued_date: '', credential_url: '', category: '', is_featured: true, sort_order: 0 }

export default function CertificatesManager() {
  const { data, loading, trigger: load } = useGetData()
  const { trigger: save, loading: saving } = useSaveCertificate()
  const { trigger: del } = useDeleteCertificate()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<typeof emptyForm & { id?: number }>(emptyForm)

  useEffect(() => { load({}) }, [])

  const openAdd = () => { setForm(emptyForm); setOpen(true) }
  const openEdit = (c: Certificate) => {
    setForm({ id: c.id, title: c.title, issuer: c.issuer ?? '', issued_date: c.issued_date ?? '', credential_url: c.credential_url ?? '', category: c.category ?? '', is_featured: c.is_featured, sort_order: c.sort_order })
    setOpen(true)
  }
  const handleDelete = async (id: number) => { await del(id); load({ skipCache: true }) }
  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault()
    await save({ ...form, issuer: form.issuer || undefined, issued_date: form.issued_date || undefined, credential_url: form.credential_url || undefined, category: form.category || undefined })
    setOpen(false); load({ skipCache: true })
  }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const columns: Column<Certificate>[] = [
    { header: 'Nama Sertifikat', cell: c => <div><p className="font-medium text-sm">{c.title}</p><p className="text-xs" style={{ color: '#8A7080' }}>{c.issuer ?? '–'}</p></div> },
    { header: 'Tanggal',         cell: c => <span className="text-xs">{c.issued_date ?? '–'}</span> },
    { header: 'Kategori',        cell: c => c.category ? <Badge variant="secondary" className="text-xs" style={{ background: 'rgba(194,220,128,0.15)', color: '#4A7A2A', border: 'none' }}>{c.category}</Badge> : <span className="text-xs text-muted-foreground">–</span> },
    { header: 'Link',            cell: c => c.credential_url ? <a href={c.credential_url} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1" style={{ color: '#D56989' }}><ExternalLink className="w-3 h-3" />Lihat</a> : <span className="text-xs text-muted-foreground">–</span> },
  ]

  return (
    <>
      <CrudManager title="Sertifikat" description="Sertifikat pelatihan dan penghargaan."
        columns={columns} data={data?.certificates ?? []} loading={loading}
        onAdd={openAdd} onEdit={c => openEdit(c as Certificate)} onDelete={handleDelete} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ borderColor: 'rgba(213,105,137,0.2)', background: '#FFFFFF', color: '#1A1A1A' }}>
          <DialogHeader><DialogTitle>{form.id ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nama Sertifikat *</Label>
              <Input value={form.title} onChange={set('title')} required className="rounded-xl" placeholder="cth: Sertifikat Voice Over Workshop" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Penerbit/Lembaga</Label>
                <Input value={form.issuer} onChange={set('issuer')} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tanggal Terbit</Label>
                <Input value={form.issued_date} onChange={set('issued_date')} placeholder="cth: Jan 2024" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Kategori</Label>
                <Input value={form.category} onChange={set('category')} placeholder="cth: Komunikasi, Broadcast" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Nomor Urut</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Link Verifikasi (URL)</Label>
              <Input value={form.credential_url} onChange={set('credential_url')} placeholder="https://..." className="rounded-xl" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="feat_c" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
              <Label htmlFor="feat_c" className="text-xs cursor-pointer">Tampilkan di halaman publik</Label>
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
