import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSupabaseServer } from '../../../../lib/supabase'
import { getAdminSessionFromRequest } from '../../../../lib/admin-auth'
import { writeAuditLog } from '../../../../lib/admin-audit'

type CrudAction = 'create' | 'update' | 'delete'

// Define validation schemas using Zod for each table
const TABLE_SCHEMAS: Record<string, z.ZodObject<any>> = {
  profile: z.object({
    name: z.string().trim().min(1, 'Nama wajib diisi').max(160, 'Maksimal 160 karakter'),
    tagline: z.string().trim().min(1, 'Tagline wajib diisi').max(300, 'Maksimal 300 karakter'),
    headline: z.string().trim().min(1, 'Headline wajib diisi').max(500, 'Maksimal 500 karakter'),
    bio: z.string().trim().min(1, 'Bio wajib diisi').max(5000, 'Maksimal 5000 karakter'),
    photo_url: z.string().trim().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
    about_photo_url: z.string().trim().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
    cv_url: z.string().trim().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
    email: z.string().trim().email('Format email tidak valid').max(254, 'Maksimal 254 karakter'),
    whatsapp: z.string().trim().min(1, 'Nomor WhatsApp wajib diisi').max(40, 'Maksimal 40 karakter'),
    instagram: z.string().trim().max(120, 'Maksimal 120 karakter').nullable().optional(),
    linkedin: z.string().trim().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
    youtube: z.string().trim().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
    tiktok: z.string().trim().max(120, 'Maksimal 120 karakter').nullable().optional(),
    location: z.string().trim().max(180, 'Maksimal 180 karakter').nullable().optional(),
  }),
  skills: z.object({
    name: z.string().trim().min(1, 'Nama keahlian wajib diisi').max(160, 'Maksimal 160 karakter'),
    category: z.string().trim().min(1, 'Kategori wajib diisi').max(120, 'Maksimal 120 karakter'),
    icon: z.string().trim().max(120, 'Maksimal 120 karakter').nullable().optional(),
    sort_order: z.number().int().finite().default(0),
    is_active: z.boolean().default(true),
  }),
  experiences: z.object({
    title: z.string().trim().min(1, 'Judul peran wajib diisi').max(220, 'Maksimal 220 karakter'),
    organization: z.string().trim().min(1, 'Nama organisasi wajib diisi').max(220, 'Maksimal 220 karakter'),
    role_type: z.string().trim().min(1, 'Tipe peran wajib diisi').max(80, 'Maksimal 80 karakter'),
    period_start: z.string().trim().max(80, 'Maksimal 80 karakter').nullable().optional(),
    period_end: z.string().trim().max(80, 'Maksimal 80 karakter').nullable().optional(),
    description: z.string().trim().max(5000, 'Maksimal 5000 karakter').nullable().optional(),
    is_current: z.boolean().default(false),
    sort_order: z.number().int().finite().default(0),
  }),
  projects: z.object({
    title: z.string().trim().min(1, 'Judul proyek wajib diisi').max(220, 'Maksimal 220 karakter'),
    category: z.string().trim().min(1, 'Kategori wajib diisi').max(120, 'Maksimal 120 karakter'),
    role: z.string().trim().min(1, 'Peran wajib diisi').max(160, 'Maksimal 160 karakter'),
    period: z.string().trim().max(120, 'Maksimal 120 karakter').nullable().optional(),
    description: z.string().trim().min(1, 'Deskripsi wajib diisi').max(5000, 'Maksimal 5000 karakter'),
    responsibilities: z.string().trim().max(5000, 'Maksimal 5000 karakter').nullable().optional(),
    tools: z.string().trim().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
    results: z.string().trim().max(5000, 'Maksimal 5000 karakter').nullable().optional(),
    project_url: z.string().trim().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
    is_featured: z.boolean().default(true),
    sort_order: z.number().int().finite().default(0),
  }),
  voice_overs: z.object({
    title: z.string().trim().min(1, 'Judul VO wajib diisi').max(220, 'Maksimal 220 karakter'),
    category: z.string().trim().min(1, 'Kategori wajib diisi').max(120, 'Maksimal 120 karakter'),
    description: z.string().trim().max(5000, 'Maksimal 5000 karakter').nullable().optional(),
    voice_style: z.string().trim().max(220, 'Maksimal 220 karakter').nullable().optional(),
    use_case: z.string().trim().max(500, 'Maksimal 500 karakter').nullable().optional(),
    audio_url: z.string().trim().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
    duration_seconds: z.number().int().finite().nullable().optional(),
    is_featured: z.boolean().default(true),
    sort_order: z.number().int().finite().default(0),
  }),
  achievements: z.object({
    title: z.string().trim().min(1, 'Nama prestasi wajib diisi').max(220, 'Maksimal 220 karakter'),
    type: z.string().trim().min(1, 'Tipe prestasi wajib diisi').max(120, 'Maksimal 120 karakter'),
    year: z.number().int().finite().nullable().optional(),
    level: z.string().trim().max(120, 'Maksimal 120 karakter').nullable().optional(),
    organizer: z.string().trim().max(220, 'Maksimal 220 karakter').nullable().optional(),
    description: z.string().trim().max(5000, 'Maksimal 5000 karakter').nullable().optional(),
    is_featured: z.boolean().default(true),
    sort_order: z.number().int().finite().default(0),
  }),
  certificates: z.object({
    title: z.string().trim().min(1, 'Nama sertifikat wajib diisi').max(220, 'Maksimal 220 karakter'),
    issuer: z.string().trim().max(220, 'Maksimal 220 karakter').nullable().optional(),
    issued_date: z.string().trim().max(120, 'Maksimal 120 karakter').nullable().optional(),
    credential_url: z.string().trim().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
    image_url: z.string().trim().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
    category: z.string().trim().max(120, 'Maksimal 120 karakter').nullable().optional(),
    is_featured: z.boolean().default(true),
    sort_order: z.number().int().finite().default(0),
  }),
  character_values: z.object({
    title: z.string().trim().min(1, 'Judul wajib diisi').max(160, 'Maksimal 160 karakter'),
    description: z.string().trim().min(1, 'Deskripsi wajib diisi').max(1000, 'Maksimal 1000 karakter'),
    icon_name: z.string().trim().min(1, 'Nama ikon wajib diisi').max(80, 'Maksimal 80 karakter'),
    order_index: z.number().int().finite().default(0),
  }),
}

function badRequest(message: string, status = 400) {
  return NextResponse.json({ message }, { status })
}

function authorize(req: NextRequest) {
  const session = getAdminSessionFromRequest(req)
  return session.ok && session.user ? session.user : null
}

async function readBody(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const table = body?.table as string | undefined

  if (!table || !TABLE_SCHEMAS[table]) throw new Error('Tabel tidak valid')
  return body as { table: string; id?: number | string; payload?: Record<string, unknown> }
}

function isValidId(id: unknown) {
  return (typeof id === 'number' && Number.isFinite(id)) || (typeof id === 'string' && id.trim().length > 0)
}

function validatePayload(table: string, payload: Record<string, unknown> | undefined, mode: 'create' | 'update') {
  const schema = TABLE_SCHEMAS[table]
  if (!payload || typeof payload !== 'object') throw new Error('Payload tidak valid')

  let validationSchema = schema
  if (mode === 'update') {
    // For update, allow partial validation (only validate fields provided in payload)
    validationSchema = schema.partial()
  }

  const result = validationSchema.safeParse(payload)
  if (!result.success) {
    const errorMsg = result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
    throw new Error(`Validasi gagal: ${errorMsg}`)
  }

  return result.data
}

function revalidatePublicPages() {
  revalidatePath('/')
}

async function audit(action: CrudAction, adminUser: string, table: string, recordId: number | string | null, metadata?: Record<string, unknown>) {
  await writeAuditLog(getSupabaseServer(), { 
    adminUser, 
    action, 
    tableName: table, 
    recordId,
    metadata
  })
}

export async function POST(req: NextRequest) {
  const adminUser = authorize(req)
  if (!adminUser) return badRequest('Unauthorized', 401)

  try {
    const { table, payload } = await readBody(req)
    const clean = validatePayload(table, payload, 'create')
    const sb = getSupabaseServer()
    const { data, error } = await sb.from(table).insert(clean).select().single()

    if (error) return badRequest(error.message, 500)
    await audit('create', adminUser, table, data?.id ?? null)
    revalidatePublicPages()
    return NextResponse.json({ data })
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : 'Gagal menambah data')
  }
}

export async function PATCH(req: NextRequest) {
  const adminUser = authorize(req)
  if (!adminUser) return badRequest('Unauthorized', 401)

  try {
    const { table, id, payload } = await readBody(req)
    if (!isValidId(id)) return badRequest('ID tidak valid')

    const clean = validatePayload(table, payload, 'update')
    const sb = getSupabaseServer()
    const { data, error } = await sb.from(table).update(clean).eq('id', id).select().single()

    if (error) return badRequest(error.message, 500)
    await audit('update', adminUser, table, id ?? null)
    revalidatePublicPages()
    return NextResponse.json({ data })
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : 'Gagal mengubah data')
  }
}

export async function DELETE(req: NextRequest) {
  const adminUser = authorize(req)
  if (!adminUser) return badRequest('Unauthorized', 401)

  try {
    const { table, id } = await readBody(req)
    if (!isValidId(id)) return badRequest('ID tidak valid')

    const sb = getSupabaseServer()
    const { error } = await sb.from(table).delete().eq('id', id)

    if (error) return badRequest(error.message, 500)
    await audit('delete', adminUser, table, id ?? null)
    revalidatePublicPages()
    return NextResponse.json({ success: true })
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : 'Gagal menghapus data')
  }
}
