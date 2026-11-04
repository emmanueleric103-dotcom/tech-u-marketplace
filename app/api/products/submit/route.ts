import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { checkRateLimit } from '@/app/lib/rateLimit'
import { verifyTurnstile } from '@/app/lib/turnstile'

function clean(v: any) {
  if (!v) return null
  const t = String(v).trim()
  return t === '' ? null : t
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const { allowed, blockedUntil } = await checkRateLimit(`ip:${ip}:submit`, 5, 15)
    if (!allowed) return NextResponse.json({ error: 'Too many attempts', blockedUntil }, { status: 429 })
    
    const body = await req.json()
    const token = body.turnstileToken
    if (!(await verifyTurnstile(token, ip))) return NextResponse.json({ error: 'Captcha failed' }, { status: 400 })

    // Preserve existing values - never overwrite, separate WhatsApp vs Call
    const title = clean(body.title)
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    // Hash IP for privacy
    const ip_hash = ip === 'unknown' ? null : Buffer.from(ip).toString('base64').slice(0,20)

    const submission = {
      title,
      description: clean(body.description),
      price: body.price ? parseInt(body.price) : null,
      category: clean(body.category) || 'General',
      condition: clean(body.condition) || 'New',
      campus_location: clean(body.campus_location) || clean(body.location) || 'Campus',
      location: clean(body.location),
      whatsapp_number: clean(body.whatsapp_number) || clean(body.whatsapp), // verified WhatsApp only
      call_number: clean(body.call_number) || clean(body.phone), // telephone only
      images: Array.isArray(body.images) ? body.images.slice(0,4) : [],
      business_name: clean(body.business_name),
      seller_id: clean(body.seller_id), // existing seller id if seller exists
      ip_hash,
      status: 'pending_submission'
    }

    const { data, error } = await supabaseAdmin.from('product_submissions').insert(submission).select().single()
    if (error) throw error
    return NextResponse.json({ ok: true, id: data.id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
