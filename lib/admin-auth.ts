import { jwtVerify, SignJWT } from 'jose'
const getSecret = () => new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || 'fallback-dev-only-change-me')
export async function createAdminToken() {
  return await new SignJWT({ role: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('8h').sign(getSecret())
}
export async function verifyAdminToken(token: string) {
  try { await jwtVerify(token, getSecret()); return true } catch { return false }
}
export async function requireAdmin(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const m = cookie.match(/techu-admin-session=([^;]+)/)
  if (!m) return false
  return await verifyAdminToken(decodeURIComponent(m[1]))
}
