import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '../../../lib/admin-auth';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await supabaseAdmin.rpc('increment_product_views', { p_id: id })
  return NextResponse.json({ ok: true })
}
