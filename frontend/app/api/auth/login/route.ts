import { NextRequest, NextResponse } from 'next/server'
import { createAdminSessionResponse, isValidAdminCredential } from '../../../../lib/admin-auth'
import { getSupabaseServer } from '../../../../lib/supabase'
import { writeAuditLog } from '../../../../lib/admin-audit'

import { rateLimit } from '../../../../lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const limiter = rateLimit(ip, { windowMs: 15 * 60 * 1000, max: 10 }) // 10 attempts per 15 minutes
    if (!limiter.success) {
      return NextResponse.json(
        { message: 'Terlalu banyak percobaan login. Silakan coba lagi nanti.' },
        { status: 429 }
      )
    }

    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    if (!isValidAdminCredential(username, password)) {
      return NextResponse.json(
        { message: 'Username atau password salah' },
        { status: 401 }
      )
    }

    const sb = getSupabaseServer()
    await writeAuditLog(sb, { adminUser: username, action: 'login', metadata: { source: 'admin-login' } })

    return createAdminSessionResponse(username)
  } catch {
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}