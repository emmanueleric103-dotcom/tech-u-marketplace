import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { checkRateLimit } from '@/app/lib/rateLimit'

function clean(v:any){ const s=String(v||'').trim(); return s==='' ? null : s }

export async function POST(req: NextRequest){
  try{
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const { allowed, blockedUntil } = await checkRateLimit(`ip:${ip}:create_seller`, 5, 15)
    if(!allowed) return NextResponse.json({error:'Too many attempts', blockedUntil}, {status:429})

    const body = await req.json()
    const business_name = clean(body.business_name)
    const whatsapp_number = clean(body.whatsapp_number)
    const call_number = clean(body.call_number)
    const pin = clean(body.pin)
    const description = clean(body.description)

    if(!business_name) return NextResponse.json({error:'Business name required'}, {status:400})
    if(!whatsapp_number && !call_number) return NextResponse.json({error:'At least one contact required'}, {status:400})

    // Secure insert via service_role - never expose service_role in frontend
    const { data, error } = await supabaseAdmin.from('sellers').insert({
      business_name,
      description,
      whatsapp_number,
      call_number,
      pin
    }).select('id').single()

    if(error) throw error
    return NextResponse.json({ok:true, id: data.id})
  }catch(e:any){
    return NextResponse.json({error:e.message}, {status:500})
  }
}
