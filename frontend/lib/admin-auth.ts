import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const ADMIN_SESSION_COOKIE = 'lia_admin_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24

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

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? 'liabocil',
    password: process.env.ADMIN_PASSWORD ?? '',
  }
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_JWT_SECRET ?? 'dev-only-change-this-admin-session-secret'
}

function base64Url(input: string) {
  return Buffer.from(input, 'utf8').toString('base64url')
}

function signValue(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function isValidAdminCredential(username: unknown, password: unknown) {
  const creds = getAdminCredentials()
  if (typeof username !== 'string' || typeof password !== 'string') return false
  if (!creds.password) return false
  return username === creds.username && safeEqual(password, creds.password)
}

export function signAdminSession(payload: AdminSessionPayload) {
  const encoded = base64Url(JSON.stringify(payload))
  return `${encoded}.${signValue(encoded)}`
}

export function verifyAdminSessionToken(token: string | undefined): VerifyAdminResult {
  if (!token) return { ok: false, reason: 'missing' }

  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return { ok: false, reason: 'malformed' }
  if (!safeEqual(signature, signValue(encoded))) return { ok: false, reason: 'invalid-signature' }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Partial<AdminSessionPayload>
    const creds = getAdminCredentials()

    if (parsed.user !== creds.username) return { ok: false, reason: 'invalid-user' }
    if (typeof parsed.exp !== 'number' || Date.now() > parsed.exp) return { ok: false, reason: 'expired' }

    return { ok: true, user: parsed.user }
  } catch {
    return { ok: false, reason: 'invalid-payload' }
  }
}

export function getAdminSessionFromRequest(req: NextRequest) {
  return verifyAdminSessionToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value)
}

export function createAdminSessionResponse(user: string) {
  const now = Date.now()
  const token = signAdminSession({ user, iat: now, exp: now + SESSION_MAX_AGE_SECONDS * 1000 })
  const res = NextResponse.json({ success: true, user })

  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  return res
}

export function clearAdminSessionResponse() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return res
}
