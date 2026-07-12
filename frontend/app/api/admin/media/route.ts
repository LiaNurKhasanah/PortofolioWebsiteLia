import { NextRequest, NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '../../../../lib/admin-auth'
import { listFromR2, deleteFromR2 } from '../../../../lib/r2'
import { getSupabaseServer } from '../../../../lib/supabase'
import { writeAuditLog } from '../../../../lib/admin-audit'

function badRequest(message: string, status = 400) {
  return NextResponse.json({ message }, { status })
}

export async function GET(req: NextRequest) {
  const session = getAdminSessionFromRequest(req)
  if (!session.ok || !session.user) {
    return badRequest('Unauthorized', 401)
  }

  try {
    const files = await listFromR2()
    return NextResponse.json({ success: true, data: files })
  } catch (error) {
    console.error('List media error:', error)
    return badRequest(error instanceof Error ? error.message : 'Gagal memuat daftar file', 500)
  }
}

export async function DELETE(req: NextRequest) {
  const session = getAdminSessionFromRequest(req)
  if (!session.ok || !session.user) {
    return badRequest('Unauthorized', 401)
  }

  try {
    const { key } = await req.json().catch(() => ({}))
    if (!key) {
      return badRequest('Key file wajib diisi')
    }

    await deleteFromR2(key)

    // Write audit log
    await writeAuditLog(getSupabaseServer(), {
      adminUser: session.user,
      action: 'delete',
      tableName: 'media',
      recordId: key,
      metadata: { deletedKey: key },
    })

    return NextResponse.json({ success: true, message: 'File berhasil dihapus' })
  } catch (error) {
    console.error('Delete media error:', error)
    return badRequest(error instanceof Error ? error.message : 'Gagal menghapus file', 500)
  }
}
