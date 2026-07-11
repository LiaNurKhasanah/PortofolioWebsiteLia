import { useEffect } from 'react'
import { Mail, Clock, CheckCircle2, MessageCircle } from 'lucide-react'
import { Badge } from '../../lib/shadcn/badge'
import { Button } from '../../lib/shadcn/button'
import { Card, CardContent } from '../../lib/shadcn/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../lib/shadcn/table'
import { Skeleton } from '../../lib/shadcn/skeleton'
import { useGetContacts, useUpdateContactStatus } from '../../hooks/backend/admin'
import { ContactMessage } from '../../models/types'

const statusMeta: Record<string, { label: string; bg: string; color: string }> = {
  unread:   { label: 'Belum Dibaca', bg: 'rgba(213,105,137,0.1)',  color: '#D56989' },
  read:     { label: 'Sudah Dibaca', bg: 'rgba(194,220,128,0.15)', color: '#4A7A2A' },
  replied:  { label: 'Sudah Dibalas', bg: 'rgba(123,104,170,0.1)', color: '#7B68AA' },
}

export default function ContactsManager() {
  const { data, loading, trigger: load } = useGetContacts()
  const { trigger: updateStatus } = useUpdateContactStatus()
  const messages = (data ?? []) as ContactMessage[]

  useEffect(() => { load({}) }, [])

  const setStatus = async (id: number, status: string) => {
    await updateStatus(id, status)
    load({ skipCache: true })
  }

  const unread = messages.filter(m => m.status === 'unread').length

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Pesan Masuk</h2>
          <p className="text-sm mt-1" style={{ color: '#8A7080' }}>
            Pesan dari form kontak halaman publik.
          </p>
        </div>
        {unread > 0 && (
          <Badge className="text-sm px-3 py-1" style={{ background: '#D56989', color: '#fff', border: 'none' }}>
            {unread} belum dibaca
          </Badge>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Pesan', val: messages.length,                              icon: <MessageCircle className="w-5 h-5" />, color: '#D56989'  },
          { label: 'Belum Dibaca', val: messages.filter(m=>m.status==='unread').length, icon: <Mail className="w-5 h-5" />,           color: '#EA9CAF'  },
          { label: 'Sudah Dibalas', val: messages.filter(m=>m.status==='replied').length,icon: <CheckCircle2 className="w-5 h-5" />,  color: '#4A7A2A'  },
        ].map(({ label, val, icon, color }) => (
          <Card key={label} className="border" style={{ borderColor: 'rgba(213,105,137,0.15)' }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(213,105,137,0.08)', color }}>
                {icon}
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>{val}</p>
                <p className="text-xs" style={{ color: '#8A7080' }}>{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabel */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(213,105,137,0.15)' }}>
        <Table>
          <TableHeader style={{ background: 'rgba(243,238,241,0.8)' }}>
            <TableRow style={{ borderColor: 'rgba(213,105,137,0.1)' }}>
              {['Pengirim','Subjek','Pesan','Waktu','Status','Aksi'].map(h => (
                <TableHead key={h} className="text-xs font-semibold" style={{ color: '#8A7080' }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full rounded-lg" /></TableCell></TableRow>
                ))
              : messages.length === 0
                ? <TableRow><TableCell colSpan={6} className="text-center py-12 text-sm" style={{ color: '#8A7080' }}>Belum ada pesan masuk.</TableCell></TableRow>
                : messages.map(m => {
                    const sm = statusMeta[m.status] ?? statusMeta['unread']!
                    return (
                      <TableRow key={m.id} className="transition-colors" style={{ borderColor: 'rgba(213,105,137,0.08)', background: m.status === 'unread' ? 'rgba(213,105,137,0.02)' : undefined }}>
                        <TableCell className="text-sm">
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-xs" style={{ color: '#8A7080' }}>{m.email}</p>
                        </TableCell>
                        <TableCell className="text-sm max-w-[120px]">
                          <p className="truncate">{m.subject ?? '–'}</p>
                          {m.service_type && <p className="text-xs mt-0.5" style={{ color: '#D56989' }}>{m.service_type}</p>}
                        </TableCell>
                        <TableCell className="text-sm max-w-[180px]">
                          <p className="line-clamp-2 text-xs" style={{ color: '#5A4A50' }}>{m.message}</p>
                        </TableCell>
                        <TableCell className="text-xs" style={{ color: '#8A7080' }}>
                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(m.created_at).toLocaleDateString('id-ID',{ day:'2-digit', month:'short', year:'numeric' })}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs whitespace-nowrap"
                            style={{ background: sm.bg, color: sm.color, border: 'none' }}>
                            {sm.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {m.status === 'unread' && (
                              <Button variant="ghost" size="sm" onClick={() => setStatus(m.id, 'read')}
                                className="h-7 text-xs rounded-lg px-2" style={{ color: '#4A7A2A' }}>
                                Tandai Dibaca
                              </Button>
                            )}
                            {m.status !== 'replied' && (
                              <Button variant="ghost" size="sm" onClick={() => setStatus(m.id, 'replied')}
                                className="h-7 text-xs rounded-lg px-2" style={{ color: '#7B68AA' }}>
                                Balas
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
