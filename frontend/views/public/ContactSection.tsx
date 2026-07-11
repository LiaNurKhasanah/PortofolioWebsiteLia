import { ReactElement, useState } from 'react'
import { MapPin, Send, Loader2, CheckCircle2, Handshake } from 'lucide-react'
import { GmailIcon, InstagramIcon, TikTokIcon, WhatsAppIcon, YoutubeIcon } from '../shared/BrandIcons'
import { Input } from '../../lib/shadcn/input'
import { Textarea } from '../../lib/shadcn/textarea'
import { Label } from '../../lib/shadcn/label'
import FloralButton from '../shared/FloralButton'
import { useSubmitContact } from '../../hooks/backend/portfolio'
import { Profile } from '../../models/types'
import { COLORS } from '../../models/constants'

interface Props { profile: Profile | null }

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

function whatsappUrl(value: string) {
  return `https://wa.me/62${value.replace(/\D/g, '').replace(/^0/, '')}`
}

function instagramUrl(value: string) {
  return value.startsWith('http') ? value : `https://instagram.com/${value.replace('@','')}`
}

function youtubeUrl(value: string) {
  return value.startsWith('http') ? value : `https://www.youtube.com/${value.startsWith('@') ? value : `@${value}`}`
}

function tiktokUrl(value: string) {
  return value.startsWith('http') ? value : `https://www.tiktok.com/@${value.replace('@','')}`
}

function validateForm(f: { name: string; email: string; message: string }): FieldErrors {
  const errs: FieldErrors = {}
  if (!f.name.trim()) errs.name = 'Nama wajib diisi'
  else if (f.name.trim().length < 2) errs.name = 'Nama minimal 2 karakter'

  if (!f.email.trim()) errs.email = 'Email wajib diisi'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = 'Format email tidak valid'

  if (!f.message.trim()) errs.message = 'Pesan wajib diisi'
  else if (f.message.trim().length < 10) errs.message = 'Pesan minimal 10 karakter'

  return errs
}

export default function ContactSection({ profile }: Props) {
  const { trigger, loading } = useSubmitContact()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', service_type: '' })
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const contactItems = [
    { icon: <MapPin className="w-4.5 h-4.5" />, label: 'Lokasi', val: profile?.location?.trim() },
    { icon: <WhatsAppIcon className="w-4.5 h-4.5" />, label: 'WhatsApp', val: profile?.whatsapp?.trim(), href: profile?.whatsapp?.trim() ? whatsappUrl(profile.whatsapp.trim()) : undefined },
    { icon: <GmailIcon className="w-4.5 h-4.5" />, label: 'Email', val: profile?.email?.trim(), href: profile?.email?.trim() ? `mailto:${profile.email.trim()}` : undefined },
    { icon: <InstagramIcon className="w-4.5 h-4.5" />, label: 'Instagram', val: profile?.instagram?.trim(), href: profile?.instagram?.trim() ? instagramUrl(profile.instagram.trim()) : undefined },
    { icon: <YoutubeIcon className="w-4.5 h-4.5" />, label: 'YouTube', val: profile?.youtube?.trim(), href: profile?.youtube?.trim() ? youtubeUrl(profile.youtube.trim()) : undefined },
    { icon: <TikTokIcon className="w-4.5 h-4.5" />, label: 'TikTok', val: profile?.tiktok?.trim(), href: profile?.tiktok?.trim() ? tiktokUrl(profile.tiktok.trim()) : undefined },
  ].filter((item): item is { icon: ReactElement; label: string; val: string; href?: string } => !!item.val)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    // Real-time validation on touched fields
    if (touched.has(k)) {
      const newForm = { ...form, [k]: e.target.value }
      const errs = validateForm(newForm)
      setFieldErrors(prev => ({ ...prev, [k]: errs[k as keyof FieldErrors] }))
    }
  }

  const blur = (k: string) => () => {
    setTouched(prev => new Set(prev).add(k))
    const errs = validateForm(form)
    setFieldErrors(prev => ({ ...prev, [k]: errs[k as keyof FieldErrors] }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const errs = validateForm(form)
    setFieldErrors(errs)
    setTouched(new Set(['name', 'email', 'message']))
    if (Object.keys(errs).length > 0) return

    try {
      await trigger(form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '', service_type: '' })
      setFieldErrors({})
      setTouched(new Set())
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Gagal mengirim pesan. Coba lagi.')
    }
  }

  return (
    <section id="kontak" className="py-12 md:py-16 lg:py-16 relative overflow-hidden" style={{ background: COLORS.pink }}>
      {/* Grid Pattern (kotak-kotak) */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            <span className="flex items-center justify-center gap-2">
              Mari Berkolaborasi!
              <Handshake className="w-6 h-6" />
            </span>
          </h2>
          <p className="text-xs md:text-sm max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.85)' }}>
            Saya terbuka untuk kerja sama, konten kreatif, voice over, hingga proyek digital lainnya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl p-6 shadow-xl" data-aos="fade-right" data-aos-delay="100">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                   style={{ background: 'rgba(194,220,128,0.2)' }}>
                  <CheckCircle2 className="w-6 h-6" style={{ color: '#4A7A2A' }} />
                </div>
                <h3 className="font-bold text-base mb-1.5" style={{ color: COLORS.pink }}>Pesan Terkirim!</h3>
                <p className="text-xs" style={{ color: '#6B5B65' }}>
                  Terima kasih sudah menghubungi. Saya akan segera membalas pesan kamu.
                </p>
                <FloralButton variant="pink" onClick={() => setSent(false)} className="mt-4">
                  Kirim Pesan Lain
                </FloralButton>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3.5">
                <h3 className="font-bold text-base mb-3" style={{ color: COLORS.pink }}>Kirim Pesan</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px]" style={{ color: '#6B5B65' }}>Nama *</Label>
                    <Input value={form.name} onChange={set('name')} onBlur={blur('name')} placeholder="Nama kamu"
                      className={`rounded-xl text-xs h-9 ${fieldErrors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
                      style={{ borderColor: fieldErrors.name ? '#f87171' : 'rgba(213,105,137,0.3)' }} />
                    {fieldErrors.name && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors.name}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]" style={{ color: '#6B5B65' }}>Email *</Label>
                    <Input type="email" value={form.email} onChange={set('email')} onBlur={blur('email')} placeholder="email@kamu.com"
                      className={`rounded-xl text-xs h-9 ${fieldErrors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                      style={{ borderColor: fieldErrors.email ? '#f87171' : 'rgba(213,105,137,0.3)' }} />
                    {fieldErrors.email && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors.email}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]" style={{ color: '#6B5B65' }}>Subjek</Label>
                  <Input value={form.subject} onChange={set('subject')} placeholder="Topik pesan"
                    className="rounded-xl text-xs h-9" style={{ borderColor: 'rgba(213,105,137,0.3)' }} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]" style={{ color: '#6B5B65' }}>Pesan *</Label>
                  <Textarea value={form.message} onChange={set('message')} onBlur={blur('message')} rows={3}
                    placeholder="Ceritakan kebutuhan kamu..."
                    className={`rounded-xl text-xs resize-none ${fieldErrors.message ? 'border-red-400 focus:ring-red-300' : ''}`}
                    style={{ borderColor: fieldErrors.message ? '#f87171' : 'rgba(213,105,137,0.3)' }} />
                  {fieldErrors.message && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors.message}</p>}
                </div>
                {err && <p className="text-[10px] text-red-500">{err}</p>}
                <FloralButton variant="orchid" type="submit" disabled={loading} className="w-full justify-center">
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </FloralButton>
              </form>
            )}
          </div>

          {/* Info kontak */}
          <div className="flex flex-col justify-center gap-4" data-aos="fade-left" data-aos-delay="200">
            {contactItems.map(({ icon, label, val, href }) => {
              const content = (
                <>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                  {icon}
                </div>
                <div>
                  <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</p>
                  <p className="text-xs font-semibold text-white">{val}</p>
                </div>
                </>
              )

              return href ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 bg-white/15 rounded-xl px-4 py-3 transition hover:bg-white/25">
                  {content}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-3.5 bg-white/15 rounded-xl px-4 py-3">
                  {content}
                </div>
              )
            })}
            {contactItems.length === 0 && (
              <div className="bg-white/15 rounded-xl px-4 py-5 text-xs font-medium text-white text-center">
                Informasi kontak belum tersedia.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}