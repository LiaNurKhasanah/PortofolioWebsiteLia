import type { SupabaseClient } from '@supabase/supabase-js'

export type AdminAuditAction = 'create' | 'update' | 'delete' | 'upload' | 'login'

interface AuditInput {
  adminUser: string
  action: AdminAuditAction
  tableName?: string | null
  recordId?: string | number | null
  metadata?: Record<string, unknown> | null
}

export async function writeAuditLog(sb: SupabaseClient, input: AuditInput) {
  const { error } = await sb.from('admin_audit_logs').insert({
    admin_user: input.adminUser,
    action: input.action,
    table_name: input.tableName ?? null,
    record_id: input.recordId == null ? null : String(input.recordId),
    metadata: input.metadata ?? null,
  })

  if (error && error.code !== '42P01') {
    console.warn('Failed to write admin audit log:', error.message)
  }
}
