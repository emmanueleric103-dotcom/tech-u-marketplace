import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createAdminToken } from '../../../../lib/admin-auth'
export const dynamic = 'force-dynamic'
export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const hash = process.env.ADMIN_PASSWORD_HASH || ''
    if (!hash || !password) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const ok = await bcrypt.compare(password, hash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const token = await createAdminToken()
    const res = NextResponse.json({ ok: true })
    res.cookies.set('techu-admin-session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 8*60*60 })
    return res
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
