import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../lib/shadcn/dialog'
import { Input } from '../../lib/shadcn/input'
import { Label } from '../../lib/shadcn/label'
import { Button } from '../../lib/shadcn/button'
import { Badge } from '../../lib/shadcn/badge'
import { Loader2, ExternalLink, Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import CrudManager, { Column } from './CrudManager'
import { useGetData } from '../../hooks/backend/portfolio'
import { useSaveCertificate, useDeleteCertificate } from '../../hooks/backend/admin'
import { Certificate } from '../../models/types'
import { toast } from 'sonner'

const emptyForm = { title: '', issuer: '', issued_date: '', credential_url: '', image_url: '', category: '', is_featured: true, sort_order: 0 }

export default function CertificatesManager() {
  const { data, loading, trigger: load } = useGetData()
  const { trigger: save, loading: saving } = useSaveCertificate()
  const { trigger: del } = useDeleteCertificate()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<typeof emptyForm & { id?: number }>(emptyForm)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { load({}) }, [])

  const openAdd = () => { setForm(emptyForm); setOpen(true) }
  const openEdit = (c: Certificate) => {
    setForm({ id: c.id, title: c.title, issuer: c.issuer ?? '', issued_date: c.issued_date ?? '', credential_url: c.credential_url ?? '', image_url: c.image_url ?? '', category: c.category ?? '', is_featured: c.is_featured, sort_order: c.sort_order })
    setOpen(true)
  }
  const handleDelete = async (id: number) => { await del(id); load({ skipCache: true }) }

  // Canvas WebP converter
  const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas context not available'))
            return
          }
          ctx.drawImage(img, 0, 0)
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob)
              else reject(new Error('Canvas conversion to blob failed'))
            },
            'image/webp',
            0.85
          )
        }
        img.onerror = () => reject(new Error('Image failed to load'))
        img.src = event.target?.result as string
      }
      reader.onerror = () => reject(new Error('FileReader failed'))
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0]
    if (!rawFile) return

    setUploading(true)
    let fileToUpload = rawFile
    const isImage = rawFile.type.startsWith('image/')
    const isSvgOrWebpOrGif = rawFile.type === 'image/svg+xml' || rawFile.type === 'image/webp' || rawFile.type === 'image/gif'

    if (isImage && !isSvgOrWebpOrGif) {
      const convertingToastId = toast.loading(`Mengonversi ${rawFile.name} ke WebP...`)
      try {
        const webpBlob = await convertToWebP(rawFile)
        const newName = rawFile.name.substring(0, rawFile.name.lastIndexOf('.')) + '.webp'
        fileToUpload = new File([webpBlob], newName, { type: 'image/webp' })
        toast.dismiss(convertingToastId)
      } catch (err) {
        toast.dismiss(convertingToastId)
        console.error('WebP conversion failed:', err)
      }
    }

    const formData = new FormData()
    formData.append('file', fileToUpload)
    formData.append('folder', 'certificates')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const body = await res.json()
      if (res.ok && body.url) {
        setForm(f => ({ ...f, image_url: body.url }))
        toast.success('Gambar sertifikat berhasil diunggah')
      } else {
        toast.error(body.message ?? 'Gagal mengunggah gambar')
      }
    } catch (err) {
      toast.error('Gagal mengunggah gambar ke server')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault()
    await save({ 
      ...form, 
      issuer: form.issuer || undefined, 
      issued_date: form.issued_date || undefined, 
      credential_url: form.credential_url || undefined, 
      image_url: form.image_url || undefined,
      category: form.category || undefined 
    })
    setOpen(false); load({ skipCache: true })
  }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const columns: Column<Certificate>[] = [
    { 
      header: 'Pratinjau', 
      cell: c => (
        <div className="w-10 h-8 rounded border overflow-hidden bg-gray-50 flex items-center justify-center">
          {c.image_url ? (
            <img src={c.image_url} alt={c.title} className="object-cover w-full h-full" />
          ) : (
            <ImageIcon className="w-4 h-4 text-gray-300" />
          )}
        </div>
      ) 
    },
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
        <DialogContent style={{ borderColor: 'rgba(213,105,137,0.2)', background: '#FFFFFF', color: '#1A1A1A' }} className="max-h-[90vh] overflow-y-auto">
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
              <Label className="text-xs">Gambar Sertifikat (Opsional)</Label>
              {form.image_url ? (
                <div className="relative group w-full max-w-[180px] aspect-[4/3] rounded-xl border border-pink-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img src={form.image_url} alt="Pratinjau Sertifikat" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 border border-dashed border-pink-200 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer hover:border-[#D56989] hover:bg-pink-50/10 transition-colors w-full h-12">
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#D56989]" />
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-[#D56989]" />
                        <span>Pilih Gambar Sertifikat</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      disabled={uploading} 
                    />
                  </label>
                </div>
              )}
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
