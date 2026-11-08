import { NextResponse } from 'next/server'
import { requireAdmin } from '../../../../lib/admin-auth'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  const ok = await requireAdmin(req)
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 })
  return NextResponse.json({ ok: true })
}
