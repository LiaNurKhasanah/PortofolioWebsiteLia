import { useEffect, useState } from 'react'
import { Save, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../lib/shadcn/card'
import { Input } from '../../lib/shadcn/input'
import { Textarea } from '../../lib/shadcn/textarea'
import { Label } from '../../lib/shadcn/label'
import { Button } from '../../lib/shadcn/button'
import { useGetData } from '../../hooks/backend/portfolio'
import { useSaveProfile } from '../../hooks/backend/admin'
import { Profile } from '../../models/types'
import { GmailIcon, InstagramIcon, TikTokIcon, YoutubeIcon } from '../shared/BrandIcons'

export default function ProfileEditor() {
  const { data, trigger: load } = useGetData()
  const { trigger: save, loading: saving } = useSaveProfile()
  const [form, setForm] = useState<Partial<Profile>>({})
  const [msg, setMsg] = useState('')

  useEffect(() => { load({}) }, [])
  useEffect(() => { if (data?.profile) setForm(data.profile) }, [data])

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    try {
      await save({
        id:           form.id           ?? 1,
        name:         form.name         ?? '',
        tagline:      form.tagline      ?? '',
        headline:     form.headline     ?? '',
        bio:          form.bio          ?? '',
        email:        form.email        ?? '',
        whatsapp:     form.whatsapp     ?? '',
        instagram:    form.instagram    ?? '',
        linkedin:     form.linkedin     ?? '',
        youtube:      form.youtube      ?? '',
        tiktok:       form.tiktok       ?? '',
        location:     form.location     ?? '',
        ...(form.cv_url ? { cv_url: form.cv_url } : {}),
        ...(form.photo_url ? { photo_url: form.photo_url } : {}),
        ...(form.about_photo_url ? { about_photo_url: form.about_photo_url } : {}),
      })
      setMsg('OK Profil berhasil disimpan!')
    } catch {
      setMsg('ERR Gagal menyimpan. Coba lagi.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Edit Profil</h2>
        <p className="text-sm mt-1" style={{ color: '#8A7080' }}>Informasi yang ditampilkan di halaman utama.</p>
      </div>

      <form onSubmit={submit}>
        <Card className="border" style={{ borderColor: 'rgba(213,105,137,0.2)', background: '#FFFFFF', color: '#1A1A1A' }}>
          <CardHeader className="pb-2">
            <p className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Informasi Dasar</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs" style={{ color: '#6B5B65' }}>Nama Lengkap</Label>
                <Input value={form.name ?? ''} onChange={set('name')} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" style={{ color: '#6B5B65' }}>WhatsApp</Label>
                <Input value={form.whatsapp ?? ''} onChange={set('whatsapp')} placeholder="08xxx" className="rounded-xl" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs" style={{ color: '#6B5B65' }}>LinkedIn URL</Label>
                <Input value={form.linkedin ?? ''} onChange={set('linkedin')} className="rounded-xl" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs" style={{ color: '#6B5B65' }}>Lokasi</Label>
                <Input value={form.location ?? ''} onChange={set('location')} placeholder="Yogyakarta, Indonesia" className="rounded-xl" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs" style={{ color: '#6B5B65' }}>Link Foto Utama (Home / Hero) (URL)</Label>
                <Input value={form.photo_url ?? ''} onChange={set('photo_url')} placeholder="https://..." className="rounded-xl" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs" style={{ color: '#6B5B65' }}>Link Foto Bagian About (Kenali Aku Lebih Dekat) (URL)</Label>
                <Input value={form.about_photo_url ?? ''} onChange={set('about_photo_url')} placeholder="https://..." className="rounded-xl" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs" style={{ color: '#6B5B65' }}>Link CV (URL)</Label>
                <Input value={form.cv_url ?? ''} onChange={set('cv_url')} placeholder="https://..." className="rounded-xl" />
              </div>
            </div>

            <div className="rounded-2xl border p-4 space-y-4" style={{ borderColor: 'rgba(213,105,137,0.18)', background: 'rgba(213,105,137,0.03)' }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Atur Media Sosial</p>
                <p className="text-xs mt-1" style={{ color: '#8A7080' }}>Isi akun yang ingin ditampilkan di kontak dan footer publik.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-2" style={{ color: '#6B5B65' }}><GmailIcon className="w-4 h-4" /> Email</Label>
                  <Input type="email" value={form.email ?? ''} onChange={set('email')} placeholder="nama@email.com" className="rounded-xl bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-2" style={{ color: '#6B5B65' }}><InstagramIcon className="w-4 h-4" /> Instagram</Label>
                  <Input value={form.instagram ?? ''} onChange={set('instagram')} placeholder="@username" className="rounded-xl bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-2" style={{ color: '#6B5B65' }}><YoutubeIcon className="w-4 h-4" /> YouTube</Label>
                  <Input value={form.youtube ?? ''} onChange={set('youtube')} placeholder="https://youtube.com/@channel" className="rounded-xl bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-2" style={{ color: '#6B5B65' }}><TikTokIcon className="w-4 h-4" /> TikTok</Label>
                  <Input value={form.tiktok ?? ''} onChange={set('tiktok')} placeholder="@username atau URL TikTok" className="rounded-xl bg-white" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: '#6B5B65' }}>Headline</Label>
              <Input value={form.headline ?? ''} onChange={set('headline')}
                placeholder="Mahasiswi Ilmu Komunikasi | Voice Over Talent | ..." className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: '#6B5B65' }}>Tagline</Label>
              <Input value={form.tagline ?? ''} onChange={set('tagline')}
                placeholder="Kutipan singkat..." className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: '#6B5B65' }}>Bio</Label>
              <Textarea value={form.bio ?? ''} onChange={set('bio')} rows={5}
                placeholder="Ceritakan tentang diri kamu..." className="rounded-xl resize-none" />
            </div>

            {msg && (
              <div className="text-sm px-3 py-2 rounded-xl flex items-center gap-2"
                style={{ background: msg.startsWith('OK') ? 'rgba(194,220,128,0.15)' : 'rgba(213,105,137,0.1)', color: msg.startsWith('OK') ? '#4A7A2A' : '#D56989' }}>
                {msg.startsWith('OK') ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                {msg.replace(/^(OK|ERR) /, '')}
              </div>
            )}

            <Button type="submit" disabled={saving} className="gap-2 rounded-xl"
              style={{ background: '#D56989', color: '#fff', border: 'none' }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
