'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Product = { id: string; title: string; price: number; category: string; created_at: string }

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) { router.push('/auth/login'); return }
      setUser(data.user)
      const { data: prods } = await supabase.from('products').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false })
      if (prods) setProducts(prods as Product[])
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="p-10 text-center text-sm text-zinc-500">Loading your listings...</div>

  return (
    <div className="max-w-[960px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-extrabold">My Listings</h1>
          <p className="text-[13px] text-zinc-500 mt-1">{products.length} active ads • Real count from DB where user_id = you</p>
        </div>
        <Link href="/sell" className="h-[40px] px-5 bg-[#16a34a] text-white rounded-full text-[13px] font-semibold flex items-center hover:bg-[#15803d]">+ Sell new</Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border rounded-[16px] p-12 text-center">
          <div className="text-[36px]">📦</div>
          <div className="font-bold mt-3">No listings yet</div>
          <p className="text-[13px] text-zinc-500 mt-1">Your ads will appear here once you publish.</p>
          <Link href="/sell" className="inline-flex mt-4 h-[40px] px-6 bg-black text-white rounded-full text-[13px] font-semibold items-center">Post your first ad</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-3">
          {products.map(p => (
            <div key={p.id} className="bg-white border rounded-[14px] p-4">
              <div className="font-semibold text-[14px]">{p.title}</div>
              <div className="text-[#16a34a] font-bold mt-1">₦{Number(p.price).toLocaleString()}</div>
              <div className="text-[11px] text-zinc-500 mt-1">{p.category} • {new Date(p.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
