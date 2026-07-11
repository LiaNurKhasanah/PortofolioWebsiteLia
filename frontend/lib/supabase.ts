import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/* ── Environment Variables ── */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/* ── Browser (public) client – singleton ── */
let _browser: SupabaseClient | null = null

export function getSupabaseBrowser(): SupabaseClient {
  if (_browser) return _browser
  _browser = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  return _browser
}

/* ── Server-side client (for Route Handlers / Server Components) ── */
export function getSupabaseServer(): SupabaseClient {
  // Server-side: always create a fresh client (no singleton)
  // Use service role key for admin operations if available
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return createClient(
    supabaseUrl,
    serviceKey ?? supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}

/* ── Convenience export for client components ── */
export const supabase = typeof window !== 'undefined'
  ? getSupabaseBrowser()
  : null