'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase'

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setUser(data.user)
      supabase.from('products').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }).then(({ data })=>{ if(data) setProducts(data) })
    })
  }, [])

  if (!user) return (
    <div className="min-h-[60vh] grid place-items-center px-4">
      <div className="rounded-[20px] bg-white border p-8 text-center"><p className="font-bold">Please login</p><Link href="/auth/login" className="mt-4 inline-flex h-10 px-6 rounded-full bg-[#16a34a] text-white font-semibold items-center">Go to Login</Link></div>
    </div>
  )

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      <h1 className="text-2xl font-black">My Listings</h1>
      <p className="text-sm text-zinc-500 mt-1">Where user_id = your id • {products.length} items</p>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p=>(
          <div key={p.id} className="rounded-2xl bg-white border shadow-sm p-3">
            <div className="aspect-square rounded-xl bg-zinc-100" />
            <h3 className="mt-3 font-semibold text-sm line-clamp-1">{p.title}</h3>
            <p className="font-black text-[#16a34a]">₦{Number(p.price).toLocaleString()}</p>
          </div>
        ))}
      </div>
      {products.length===0 && <div className="mt-8 rounded-2xl border-2 border-dashed bg-white p-12 text-center text-zinc-500">You have no listings yet. <Link href="/sell" className="text-[#16a34a] font-semibold">Sell something</Link></div>}
    </div>
  )
}
