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
import { useSaveSkill, useDeleteSkill } from '../../hooks/backend/admin'
import { Skill } from '../../models/types'

const kategori = ['writing','digital','media','communication','soft','organization','general']
const emptyForm = { name: '', category: 'writing', sort_order: 0, is_active: true }

export default function SkillsManager() {
  const { data, loading, trigger: load } = useGetData()
  const { trigger: save, loading: saving } = useSaveSkill()
  const { trigger: del } = useDeleteSkill()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<typeof emptyForm & { id?: number }>(emptyForm)

  useEffect(() => { load({}) }, [])

  const openAdd = () => { setForm(emptyForm); setOpen(true) }
  const openEdit = (s: Skill) => {
    setForm({ id: s.id, name: s.name, category: s.category, sort_order: s.sort_order, is_active: s.is_active })
    setOpen(true)
  }
  const handleDelete = async (id: number) => { await del(id); load({ skipCache: true }) }
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await save(form)
    setOpen(false)
    load({ skipCache: true })
  }

  const columns: Column<Skill>[] = [
    { header: 'Nama',      cell: s => <span className="font-medium">{s.name}</span> },
    { header: 'Kategori',  cell: s => <Badge variant="secondary" className="text-xs" style={{ background: 'rgba(213,105,137,0.1)', color: '#D56989', border: 'none' }}>{s.category}</Badge> },
    { header: 'Urutan',    cell: s => <span className="text-center">{s.sort_order}</span> },
    { header: 'Status',    cell: s => <Badge variant={s.is_active ? 'default' : 'secondary'} className="text-xs" style={{ background: s.is_active ? 'rgba(194,220,128,0.2)' : 'rgba(107,91,101,0.1)', color: s.is_active ? '#4A7A2A' : '#8A7080', border: 'none' }}>{s.is_active ? 'Aktif' : 'Nonaktif'}</Badge> },
  ]

  return (
    <>
      <CrudManager
        title="Keahlian (Skills)"
        description="Kemampuan yang ditampilkan di halaman portofolio."
        columns={columns}
        data={data?.skills ?? []}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ borderColor: 'rgba(213,105,137,0.2)', background: '#FFFFFF', color: '#1A1A1A' }}>
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit Keahlian' : 'Tambah Keahlian'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nama Keahlian</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required placeholder="cth: Penulisan Konten" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Kategori</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="rounded-xl bg-white"><SelectValue /></SelectTrigger>
                <SelectContent className="z-[100] bg-white border-pink-100 text-[#1A1A1A] shadow-2xl">
                  {kategori.map(k => <SelectItem key={k} value={k} className="bg-white focus:bg-pink-50 focus:text-[#D56989]">{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Nomor Urut</Label>
              <Input type="number" value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                className="rounded-xl" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_active" checked={form.is_active}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
              <Label htmlFor="is_active" className="text-xs cursor-pointer">Tampilkan di halaman publik</Label>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Batal</Button>
              <Button type="submit" disabled={saving} className="rounded-xl gap-2"
                style={{ background: '#D56989', color: '#fff', border: 'none' }}>
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
