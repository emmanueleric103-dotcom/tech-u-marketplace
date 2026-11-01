import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, anon)

export const supabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

export type Product = {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  seller_name: string
  seller_phone: string
  seller_whatsapp: string
  images: string[]
  status: 'pending' | 'approved' | 'rejected' | 'sold'
  created_at: string
}
