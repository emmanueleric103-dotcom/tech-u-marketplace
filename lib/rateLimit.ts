// Simple in-memory rate limit for spam protection
// Max 3 posts per hour per IP - keeps costs low, works on Render

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function checkRateLimit(ip: string, limit = 3, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  store.set(ip, entry);
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// Cleanup every 30 mins
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store.entries()) {
      if (now > v.resetAt) store.delete(k);
    }
  }, 30 * 60 * 1000);
}
