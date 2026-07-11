# Implementation Plan

[Overview]
Strengthen the admin authentication and content integrity layer for the Next.js portfolio admin panel.

The current admin login returns a weak base64 token that is stored in `sessionStorage` and checked only by parsing token shape in protected API routes. This plan replaces that flow with an HTTP-only cookie session signed by a server secret, updates the requested admin credential configuration, and centralizes authorization checks so CRUD and upload routes use the same secure verification path.

The same pass will remove the highest-risk fake public fallbacks that can make the homepage show hardcoded contact, WhatsApp, YouTube, and simulated audio content when the database value is empty. Public UI should prefer real database profile fields and hide optional actions when required data is missing.

The admin CRUD route will also receive server-side validation and audit logging. Validation prevents arbitrary fields from being written to allowed tables, while audit logging records successful admin create, update, and delete activity without exposing secret values.

[Types]
The implementation adds explicit session, validation, audit, and UI helper types.

`frontend/lib/admin-auth.ts` will define:

```ts
export interface AdminSessionPayload {
  user: string
  iat: number
  exp: number
}

export interface VerifyAdminResult {
  ok: boolean
  user?: string
  reason?: string
}
```

Validation rules:
- `user`: non-empty string, expected to match `ADMIN_USERNAME`.
- `iat`: Unix milliseconds timestamp generated at login.
- `exp`: Unix milliseconds timestamp, default 24 hours after `iat`.
- Session data must be signed with `ADMIN_SESSION_SECRET` or `ADMIN_JWT_SECRET` fallback; unsigned or expired payloads are rejected.

`frontend/app/api/admin/crud/route.ts` will define table validation descriptors:

```ts
type PrimitiveKind = 'string' | 'number' | 'boolean'

interface FieldRule {
  type: PrimitiveKind
  required?: boolean
  nullable?: boolean
  maxLength?: number
}

type TableSchema = Record<string, FieldRule>
```

Payload validation rules:
- Unknown columns are rejected.
- Required fields are enforced on create only.
- String fields are trimmed, max length checked where specified, and empty optional strings may be normalized to `null` for nullable DB columns.
- Number fields must be finite numbers.
- Boolean fields must be actual booleans.
- `id` accepts finite numbers for serial tables and non-empty strings for UUID tables such as `character_values`.

`frontend/models/types.ts` will add:

```ts
export interface AdminAuditLog {
  id: number
  admin_user: string
  action: 'create' | 'update' | 'delete' | 'upload' | 'login'
  table_name: string | null
  record_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}
```

[Files]
This change modifies auth, CRUD, upload, public fallback rendering, and database migration files.

New files to create:
- `frontend/lib/admin-auth.ts`: shared signed cookie session utilities: credential validation, cookie creation, cookie verification, cookie clearing, and API authorization helper.
- `frontend/app/api/auth/logout/route.ts`: clears the admin session cookie.
- `frontend/app/api/auth/session/route.ts`: returns current admin session state for client route guards.
- `supabase/migrations/003_admin_audit_logs.sql`: creates `admin_audit_logs` table with RLS enabled and service-role-only access.

Existing files to modify:
- `frontend/app/api/auth/login/route.ts`: replace base64 token response with signed HTTP-only cookie response; use requested admin username through environment config; return only `{ success: true, user }`.
- `frontend/hooks/backend/admin.ts`: remove `sessionStorage` token dependency for `useLogin`, `adminCrudRequest`, and `useUpload`; use `credentials: 'include'`; add `useLogout` and `useAdminSession`; move contact status update to server route if feasible or leave as known follow-up if not in scope.
- `frontend/controllers/AdminLoginPage.tsx`: stop storing `lia_admin`; redirect after cookie login; optionally prefill username only if safe; keep password blank.
- `frontend/controllers/AdminDashboard.tsx`: replace `sessionStorage` guard with `/api/auth/session`; call `/api/auth/logout` on logout; show loading while session is checked.
- `frontend/app/api/admin/crud/route.ts`: import shared auth helper, validate table payloads by schema, write audit log after successful mutations, keep `revalidatePath('/')`.
- `frontend/app/api/upload/route.ts`: replace token presence check with shared cookie auth; log successful upload metadata without storing secrets.
- `frontend/.env.local.example`: update admin auth comments and add `ADMIN_SESSION_SECRET` guidance; change example username to `liabocil` while keeping password as placeholder.
- `frontend/controllers/PortfolioPage.tsx`: hide floating WhatsApp button if `profile.whatsapp` is empty.
- `frontend/views/public/VoiceOverSection.tsx`: hide WhatsApp CTA if no WhatsApp number; replace `AudioDemoPlayer` fallback with a real empty state such as `Audio belum tersedia`.
- `frontend/views/public/Footer.tsx`: render Instagram, YouTube, and Email buttons only when the corresponding profile value exists; remove generic `https://youtube.com` fallback.
- `frontend/views/public/ContactSection.tsx`: use `profile.location`, `profile.whatsapp`, `profile.email`, and `profile.instagram`; only render rows that have database values; stop falling back to `CONTACT` for user-specific contact details.
- `frontend/views/public/AboutSection.tsx`: remove duplicated hardcoded bio sentence or make it conditional only when profile bio exists; optionally remove hardcoded education badge if not represented by DB data.

Files not to delete:
- `frontend/views/shared/AudioDemoPlayer.tsx`: keep component for future real demo UI reuse, but stop using it for missing audio data.
- `frontend/models/constants.ts`: keep design constants and generic site fallbacks, but stop using `CONTACT` as real public contact data fallback.

[Functions]
This implementation centralizes admin auth, modifies route handlers, and removes client-side token handling.

New functions:
- `getAdminCredentials(): { username: string; password: string }` in `frontend/lib/admin-auth.ts`; reads `ADMIN_USERNAME` and `ADMIN_PASSWORD`, defaulting username to `liabocil` only when env is missing.
- `signAdminSession(payload: AdminSessionPayload): Promise<string>` in `frontend/lib/admin-auth.ts`; signs payload using HMAC SHA-256 via Node `crypto`.
- `verifyAdminSessionToken(token: string | undefined): VerifyAdminResult` in `frontend/lib/admin-auth.ts`; validates signature, JSON structure, username, and expiration.
- `getAdminSessionFromRequest(req: NextRequest): VerifyAdminResult` in `frontend/lib/admin-auth.ts`; reads the HTTP-only cookie.
- `createAdminSessionResponse(user: string): NextResponse` in `frontend/lib/admin-auth.ts`; creates JSON response and sets secure cookie.
- `clearAdminSessionResponse(): NextResponse` in `frontend/lib/admin-auth.ts`; expires admin cookie.
- `sanitizePayload(table: string, payload: Record<string, unknown>, mode: 'create' | 'update'): Record<string, unknown>` in `frontend/app/api/admin/crud/route.ts`; validates fields before database mutation.
- `writeAuditLog(sb: SupabaseClient, input: AuditInput): Promise<void>` in `frontend/app/api/admin/crud/route.ts` or `frontend/lib/admin-audit.ts`; inserts non-blocking audit rows.
- `formatWhatsappUrl(whatsapp: string, text?: string): string` in `frontend/controllers/PortfolioPage.tsx` or small helper file; only called when value exists.

Modified functions:
- `POST(req: NextRequest)` in `frontend/app/api/auth/login/route.ts`: validate credentials, set cookie, stop returning token.
- `isAuthorized(req: NextRequest)` in `frontend/app/api/admin/crud/route.ts`: replace or remove in favor of `getAdminSessionFromRequest`.
- `readBody(req: NextRequest)` in `frontend/app/api/admin/crud/route.ts`: keep table allowlist but return raw body for schema validation.
- `POST`, `PATCH`, `DELETE` in `frontend/app/api/admin/crud/route.ts`: use cookie auth, sanitize payload, write audit logs, revalidate public page.
- `POST(req: NextRequest)` in `frontend/app/api/upload/route.ts`: use cookie auth and audit upload.
- `adminCrudRequest<T>()` in `frontend/hooks/backend/admin.ts`: remove Authorization header and include cookies.
- `useLogin()` in `frontend/hooks/backend/admin.ts`: return user/session state without token.
- `useUpload()` in `frontend/hooks/backend/admin.ts`: remove Authorization header and include cookies.
- `AdminDashboard()` in `frontend/controllers/AdminDashboard.tsx`: replace sessionStorage guard and logout behavior.
- `AdminLoginPage()` in `frontend/controllers/AdminLoginPage.tsx`: stop storing session token.
- `PortfolioPage()`, `VoiceOverSection()`, `Footer()`, `ContactSection()`, and `AboutSection()` public render functions: remove misleading hardcoded public data fallbacks.

Removed functions or behavior:
- Remove base64 token creation from `frontend/app/api/auth/login/route.ts`.
- Remove `sessionStorage.setItem('lia_admin', ...)` and `sessionStorage.removeItem('lia_admin')` behavior.
- Remove `Authorization: Bearer ${token}` admin client headers.
- Remove simulated audio preview display for missing `voice_overs.audio_url`.

[Classes]
No class-based architecture changes are required.

No new classes will be introduced. The codebase is function and React component based. Existing React function components will be modified in place. No classes will be removed.

[Dependencies]
The plan avoids adding runtime dependencies unless schema validation with a package is explicitly preferred.

No package installation is required for auth signing because Node `crypto` is available in Next.js route handlers. Server-side validation can be implemented manually with local table schemas to avoid adding dependencies. If the implementation agent chooses Zod for maintainability, add `zod` to `frontend/package.json` and `frontend/package-lock.json`, then build after install; otherwise no dependency changes are needed.

Environment changes:
- `ADMIN_USERNAME` should be set to `liabocil` in local environment.
- `ADMIN_PASSWORD` should be updated to the user-provided new password in local environment, but the literal secret must not be committed to example files or the plan.
- `ADMIN_SESSION_SECRET` should be a random 32+ character secret. If missing, implementation may fall back to `ADMIN_JWT_SECRET`, but production should set `ADMIN_SESSION_SECRET`.

[Testing]
Testing will combine route-level manual checks and a production build.

Validation steps:
- Run `npm --prefix .\frontend run build` and confirm compile, type checking, and static generation pass.
- Login with username `liabocil` and the new password; verify no token is written to `sessionStorage`.
- Verify browser has an HTTP-only admin session cookie after login.
- Open `/kelola/panel`; verify session check permits access after login and redirects to `/kelola` after logout.
- Exercise admin create/update/delete for at least `profile`, `skills`, and `character_values`; verify Supabase data persists and homepage updates.
- Verify unauthenticated calls to `/api/admin/crud` and `/api/upload` return 401 without a valid cookie.
- Verify invalid CRUD payloads reject unknown fields and wrong types.
- Verify `admin_audit_logs` receives successful CRUD and upload audit records.
- Verify homepage no longer shows fake WhatsApp, YouTube, contact rows, or simulated audio when database values are empty.

[Implementation Order]
Implementation should first secure auth, then enforce validation/audit, then clean public fallbacks, and finally validate the full app.

1. [x] Add `frontend/lib/admin-auth.ts` with signed cookie helpers and shared request verification.
2. [x] Update `.env.local` locally with the requested admin username and password; update `.env.local.example` with safe placeholders and session secret guidance.
3. [x] Rewrite `frontend/app/api/auth/login/route.ts` to set HTTP-only cookie sessions.
4. [x] Add `frontend/app/api/auth/session/route.ts` and `frontend/app/api/auth/logout/route.ts`.
5. [x] Update `frontend/hooks/backend/admin.ts`, `frontend/controllers/AdminLoginPage.tsx`, and `frontend/controllers/AdminDashboard.tsx` to stop using `sessionStorage` and rely on cookie-backed session APIs.
6. [x] Update `frontend/app/api/admin/crud/route.ts` to use shared cookie auth.
7. [x] Add table schema validation and field sanitization to `frontend/app/api/admin/crud/route.ts`.
8. [x] Create `supabase/migrations/003_admin_audit_logs.sql` and add audit logging for successful admin CRUD operations.
9. [x] Update `frontend/app/api/upload/route.ts` to use shared cookie auth and audit successful uploads.
10. [x] Remove misleading public fallbacks in `PortfolioPage`, `VoiceOverSection`, `Footer`, `ContactSection`, and `AboutSection`.
11. [x] Run `npm --prefix .\frontend run build` and fix any TypeScript/build errors.
12. [x] Manually verify login, logout, CRUD persistence, unauthorized API protection, audit logs, and empty-data public UI behavior.
13. [x] Implementasikan rate limiting pada API publik (/api/contact dan /api/auth/login) untuk pertahanan spam/brute-force.
14. [x] Selaraskan style/warna ikon medsos di Footer agar konsisten dengan desain web (warna putih solid atau solid bertema).
