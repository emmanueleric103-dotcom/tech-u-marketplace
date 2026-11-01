// FIXED: old code used for...of on Map that crashed on Termux node
// Now uses forEach which is safe
const hits = new Map<string, { count: number, time: number }>()
export function rateLimit(ip: string, limit = 10, windowMs = 60000) {
  const now = Date.now()
  // cleanup old with forEach - FIX
  hits.forEach((v, k) => { if (now - v.time > windowMs) hits.delete(k) })
  const cur = hits.get(ip)
  if (!cur) { hits.set(ip, { count: 1, time: now }); return true }
  if (now - cur.time > windowMs) { hits.set(ip, { count: 1, time: now }); return true }
  if (cur.count >= limit) return false
  cur.count++; return true
}
