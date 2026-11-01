// lib/rateLimit.ts - FIXED - no MapIterator iteration
type Entry = { count: number; resetAt: number }
const store = new Map<string, Entry>()

export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }
  if (entry.count >= max) return true
  entry.count++
  return false
}

// Cleanup without MapIterator iteration - use forEach
setInterval(() => {
  const now = Date.now()
  store.forEach((v, k) => {
    if (now > v.resetAt) store.delete(k)
  })
}, 30 * 60 * 1000)
