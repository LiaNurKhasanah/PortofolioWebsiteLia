import { NextRequest, NextResponse } from 'next/server'
import { uploadToR2, generateR2Key } from '../../../lib/r2'
import { getAdminSessionFromRequest } from '../../../lib/admin-auth'
import { getSupabaseServer } from '../../../lib/supabase'
import { writeAuditLog } from '../../../lib/admin-audit'

export async function POST(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req)
    if (!session.ok || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) ?? 'uploads'

    if (!file) {
      return NextResponse.json(
        { message: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Ukuran file maksimal 10MB' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'application/pdf',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Tipe file tidak didukung' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = generateR2Key(folder, file.name)
    const url = await uploadToR2(buffer, key, file.type)
    await writeAuditLog(getSupabaseServer(), {
      adminUser: session.user,
      action: 'upload',
      tableName: null,
      recordId: key,
      metadata: { folder, type: file.type, size: file.size },
    })

    return NextResponse.json({ success: true, url, key })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { message: 'Gagal mengupload file' },
      { status: 500 }
    )
  }
}