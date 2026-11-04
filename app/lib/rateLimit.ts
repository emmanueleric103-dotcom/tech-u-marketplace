import { supabaseAdmin } from './supabaseAdmin'

export async function checkRateLimit(key: string, maxAttempts = 5, windowMinutes = 15): Promise<{ allowed: boolean, blockedUntil?: string }> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - windowMinutes * 60000)
  // Atomic upsert - handles first-request race
  const { data, error } = await supabaseAdmin.rpc('check_rate_limit_atomic', {
    p_key: key,
    p_max: maxAttempts,
    p_window_minutes: windowMinutes
  })
  if (error) {
    // Fallback if rpc not yet deployed - direct upsert
    const { data: existing } = await supabaseAdmin.from('rate_limits').select('*').eq('key', key).maybeSingle()
    if (!existing) {
      await supabaseAdmin.from('rate_limits').insert({ key, attempts: 1, window_start: now, last_attempt: now })
      return { allowed: true }
    }
    if (existing.blocked_until && new Date(existing.blocked_until) > now) {
      return { allowed: false, blockedUntil: existing.blocked_until }
    }
    const start = new Date(existing.window_start)
    if (start < windowStart) {
      await supabaseAdmin.from('rate_limits').update({ attempts: 1, window_start: now, last_attempt: now, blocked_until: null }).eq('key', key)
      return { allowed: true }
    }
    if (existing.attempts >= maxAttempts) {
      const blockedUntil = new Date(now.getTime() + 15*60000).toISOString()
      await supabaseAdmin.from('rate_limits').update({ attempts: existing.attempts, last_attempt: now, blocked_until: blockedUntil }).eq('key', key)
      return { allowed: false, blockedUntil }
    }
    await supabaseAdmin.from('rate_limits').update({ attempts: existing.attempts+1, last_attempt: now }).eq('key', key)
    return { allowed: true }
  }
  return data as any
}
