import { NextRequest, NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '../../../../lib/admin-auth'
import { writeAuditLog } from '../../../../lib/admin-audit'
import { getSupabaseServer } from '../../../../lib/supabase'

const ALLOWED_STATUSES = new Set(['unread', 'read', 'replied'])

function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}

function getAdminUser(req: NextRequest) {
  const session = getAdminSessionFromRequest(req)
  return session.ok && session.user ? session.user : null
}

function isValidId(id: unknown) {
  return (typeof id === 'number' && Number.isFinite(id)) || (typeof id === 'string' && id.trim().length > 0)
}

export async function GET(req: NextRequest) {
  const adminUser = getAdminUser(req)
  if (!adminUser) return unauthorized()

  const sb = getSupabaseServer()
  const { data, error } = await sb
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const adminUser = getAdminUser(req)
  if (!adminUser) return unauthorized()

  const body = await req.json().catch(() => null)
  const id = body?.id
  const status = body?.status

  if (!isValidId(id)) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 })
  }

  if (typeof status !== 'string' || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ message: 'Status tidak valid' }, { status: 400 })
  }

  const sb = getSupabaseServer()
  const { data, error } = await sb
    .from('contact_messages')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  await writeAuditLog(sb, {
    adminUser,
    action: 'update',
    tableName: 'contact_messages',
    recordId: id,
    metadata: { status },
  })

  return NextResponse.json({ data })
}