import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '../../../lib/supabase'

import { rateLimit } from '../../../lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const limiter = rateLimit(ip, { windowMs: 15 * 60 * 1000, max: 5 }) // max 5 messages per 15 minutes per IP
    if (!limiter.success) {
      return NextResponse.json(
        { message: 'Terlalu banyak mengirim pesan. Silakan coba lagi nanti.' },
        { status: 429 }
      )
    }

    const { name, email, subject, message, service_type } = await req.json()
    const cleanName = typeof name === 'string' ? name.trim() : ''
    const cleanEmail = typeof email === 'string' ? email.trim() : ''
    const cleanSubject = typeof subject === 'string' ? subject.trim() : ''
    const cleanMessage = typeof message === 'string' ? message.trim() : ''
    const cleanServiceType = typeof service_type === 'string' ? service_type.trim() : ''

    // Validation
    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json(
        { message: 'Nama, email, dan pesan harus diisi' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { message: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    if (cleanName.length > 160 || cleanEmail.length > 254 || cleanSubject.length > 220 || cleanMessage.length > 5000) {
      return NextResponse.json(
        { message: 'Pesan terlalu panjang' },
        { status: 400 }
      )
    }

    const sb = getSupabaseServer()
    const { error } = await sb.from('contact_messages').insert({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      service_type: cleanServiceType,
      status: 'unread',
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Contact insert error:', error)
      return NextResponse.json(
        { message: 'Gagal menyimpan pesan' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}