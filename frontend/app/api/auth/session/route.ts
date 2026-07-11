import { NextRequest, NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '../../../../lib/admin-auth'

export async function GET(req: NextRequest) {
  const session = getAdminSessionFromRequest(req)
  if (!session.ok) return NextResponse.json({ authenticated: false }, { status: 401 })
  return NextResponse.json({ authenticated: true, user: session.user })
}
