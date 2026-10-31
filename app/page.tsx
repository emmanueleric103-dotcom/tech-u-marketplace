'use client'
export const dynamic = 'force-dynamic'
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProducts = async (search = '') => {
    setLoading(true)
    let q = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (search) {
      q = q.ilike('title', `%${search}%`)
    }
    const { data } = await q
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])
  
  useEffect(() => {
    const t = setTimeout(() => fetchProducts(query), 400)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div>
      <div className="py-10">
        <h1 className="text-4xl font-black tracking-tight">Buy and sell on campus</h1>
        <p className="text-zinc-500 mt-2">Real listings from Supabase, not hardcoded demo data.</p>
        <input 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="Search real products in DB (e.g. laptop, textbook)..." 
          className="mt-6 max-w-lg"
        />
      </div>

      {loading ? <p>Loading real listings...</p> : products.length === 0 ? (
        <div className="border border-dashed rounded-2xl p-16 text-center mt-8">
          <p className="text-xl font-semibold">No listings yet</p>
          <p className="text-zinc-500 mt-1">Be the first to post. Go to Sell.</p>
          <Link href="/sell" className="inline-block mt-4 bg-black text-white px-5 py-2 rounded-full">Create listing</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {products.map(p => (
            <Link key={p.id} href={`/product/${p.id}`} className="bg-white border rounded-2xl overflow-hidden hover:shadow-sm">
              <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">
                {p.images?.[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" /> : 'No image'}
              </div>
              <div className="p-3">
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-green-600 font-bold">₦{Number(p.price).toLocaleString()}</p>
                <p className="text-xs text-zinc-500 truncate">{p.pickup_location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
