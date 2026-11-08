import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminToken } from './lib/admin-auth'
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (path === '/admin/login' || path === '/api/admin/login' || path === '/api/admin/logout') return NextResponse.next()
  if (path === '/admin' || path.startsWith('/admin/') || path.startsWith('/api/admin/')) {
    const token = req.cookies.get('techu-admin-session')?.value
    const valid = token ? await verifyAdminToken(token) : false
    if (!valid) {
      if (path.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }
  return NextResponse.next()
}
export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
