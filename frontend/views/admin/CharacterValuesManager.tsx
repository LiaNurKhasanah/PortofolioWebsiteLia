'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Edit2, Handshake, Heart, Loader2, MessageCircle, Plus, Save, Sparkles, Star, Target, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/shadcn/card'
import { Button } from '../../lib/shadcn/button'
import { Input } from '../../lib/shadcn/input'
import { Textarea } from '../../lib/shadcn/textarea'
import { Label } from '../../lib/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../lib/shadcn/select'
import { CharacterValue } from '../../models/types'
import { getSupabaseBrowser } from '../../lib/supabase'
import { useDeleteCharacterValue, useSaveCharacterValue } from '../../hooks/backend/admin'

const iconOptions = [
  { name: 'MessageCircle', label: 'Komunikatif', icon: MessageCircle },
  { name: 'Sparkles', label: 'Kreatif', icon: Sparkles },
  { name: 'Briefcase', label: 'Profesional', icon: Briefcase },
  { name: 'Handshake', label: 'Kolaborasi', icon: Handshake },
  { name: 'Star', label: 'Unggulan', icon: Star },
  { name: 'Heart', label: 'Empati', icon: Heart },
  { name: 'Target', label: 'Fokus', icon: Target },
] as const

function IconPreview({ name, className = 'w-5 h-5' }: { name?: string; className?: string }) {
  const match = iconOptions.find(icon => icon.name === name) ?? iconOptions.find(icon => icon.name === 'Star')!
  const Icon = match.icon
  return <Icon className={className} />
}

export default function CharacterValuesManager() {
  const [items, setItems] = useState<CharacterValue[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<CharacterValue>>({})
  const { trigger: saveCharacterValue } = useSaveCharacterValue()
  const { trigger: deleteCharacterValue } = useDeleteCharacterValue()

  const load = async () => {
    try {
      const sb = getSupabaseBrowser()
      const { data, error } = await sb.from('character_values').select('*').order('order_index')
      if (error) throw error
      setItems(data || [])
      setErr('')
    } catch (e: any) {
      if (e.code === '42P01') {
        // Table doesn't exist yet, we'll create it via SQL or just show empty for now
        setErr('Tabel character_values belum ada di Supabase. Jalankan migration 004_socials_and_character_values.sql lalu refresh schema cache.')
      } else {
        setErr(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const startEdit = (item: CharacterValue) => {
    setEditingId(item.id)
    setForm(item)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({})
  }

  const startAdd = () => {
    setEditingId('new')
    setForm({ title: '', description: '', icon_name: 'Star', order_index: items.length + 1 })
  }

  const save = async () => {
    setSaving(true)
    setErr('')
    try {
      await saveCharacterValue(editingId === 'new' ? form : { ...form, id: editingId })
      await load()
      cancelEdit()
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Hapus nilai karakter ini?')) return
    setSaving(true)
    try {
      await deleteCharacterValue(id)
      await load()
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#D56989' }}>Nilai Karakter</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola 4 kartu nilai (Komunikatif, Kreatif, dll) di halaman About</p>
        </div>
        {!editingId && (
          <Button onClick={startAdd} className="gap-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl">
            <Plus className="w-4 h-4" /> Tambah Baru
          </Button>
        )}
      </div>

      {err && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{err}</div>}

      {editingId && (
        <Card className="border-pink-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-pink-600">{editingId === 'new' ? 'Tambah Karakter' : 'Edit Karakter'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Misal: Komunikatif" />
              </div>
              <div className="space-y-2">
                <Label>Icon Lucide</Label>
                <Select value={form.icon_name || 'Star'} onValueChange={value => setForm({ ...form, icon_name: value })}>
                  <SelectTrigger className="rounded-xl bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-white border-pink-100 text-[#1A1A1A] shadow-2xl">
                    {iconOptions.map(({ name, label, icon: Icon }) => (
                      <SelectItem key={name} value={name} className="bg-white focus:bg-pink-50 focus:text-[#D56989]">
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{name}</span>
                          <span className="text-xs text-gray-400">{label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-3 rounded-xl border border-pink-100 bg-pink-50/60 px-3 py-2 text-sm text-pink-600">
                  <span className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <IconPreview name={form.icon_name} />
                  </span>
                  <span>Preview icon: {form.icon_name || 'Star'}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input type="number" value={form.order_index || 0} onChange={e => setForm({ ...form, order_index: parseInt(e.target.value) })} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={cancelEdit} disabled={saving}>Batal</Button>
              <Button onClick={save} disabled={saving} className="bg-pink-500 hover:bg-pink-600 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Simpan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!editingId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <Card key={item.id} className="border border-gray-100 hover:border-pink-200 transition-colors">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  <IconPreview name={item.icon_name} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="text-gray-400 hover:text-pink-600">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && !loading && (
            <div className="col-span-full p-8 text-center bg-gray-50 rounded-2xl text-gray-500 border border-dashed">
              Belum ada nilai karakter.
            </div>
          )}
        </div>
      )}
    </div>
  )
}