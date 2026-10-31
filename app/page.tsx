'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { name: 'Electronics', emoji: '📱', count: '1,204' },
  { name: 'Fashion', emoji: '👕', count: '892' },
  { name: 'Books', emoji: '📚', count: '445' },
  { name: 'Furniture', emoji: '🪑', count: '321' },
  { name: 'Hostel Items', emoji: '🛏️', count: '210' },
  { name: 'Services', emoji: '🔧', count: '156' },
]

type Product = {
  id: string
  title: string
  price: number
  category: string
  location: string
  created_at: string
  image_url?: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(24)
      if (!error && data) setProducts(data as Product[])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      {/* Hero - Jiji Style */}
      <div className="bg-white rounded-[16px] border shadow-sm p-6 md:p-10 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-[32px] md:text-[44px] font-extrabold leading-[0.95] tracking-tight">
              Find anything in <span className="text-[#16a34a]">TECH-U</span>
            </h1>
            <p className="text-zinc-500 mt-3 text-[15px] max-w-[520px]">
              Buy and sell everything from used phones to hostel furniture. Trusted by 3,000+ TECH-U students.
            </p>
            <div className="mt-6 flex gap-2 max-w-[560px]">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">⌕</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="I am looking for..."
                  className="w-full h-[48px] pl-10 pr-4 bg-[#f3f4f6] rounded-full border border-transparent focus:border-[#16a34a] focus:bg-white outline-none text-[15px]"
                />
              </div>
              <button className="h-[48px] px-7 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-full text-[15px]">
                Search
              </button>
            </div>
          </div>
          <Link href="/sell" className="hidden md:flex h-[48px] px-6 items-center justify-center bg-black text-white rounded-full font-semibold text-[14px] hover:bg-zinc-800">
            + Sell now — free
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-8">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="bg-[#fafafa] hover:bg-white border hover:shadow-sm rounded-[14px] p-4 cursor-pointer transition-all group">
              <div className="text-[24px]">{cat.emoji}</div>
              <div className="font-semibold text-[13px] mt-2 group-hover:text-[#16a34a]">{cat.name}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">{cat.count} ads</div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[18px]">Trending in TECH-U</h2>
        <span className="text-[12px] text-zinc-500 bg-white border px-3 py-1 rounded-full">{filtered.length} items</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-[14px] border p-3 animate-pulse">
              <div className="h-[140px] bg-zinc-100 rounded-[10px]" />
              <div className="h-4 bg-zinc-100 rounded mt-3 w-3/4" />
              <div className="h-3 bg-zinc-100 rounded mt-2 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[20px] border shadow-sm py-20 px-6 text-center">
          <div className="w-[88px] h-[88px] mx-auto rounded-full bg-[#dcfce7] flex items-center justify-center text-[36px]">📦</div>
          <h3 className="font-bold text-[20px] mt-5">No products yet</h3>
          <p className="text-zinc-500 text-[14px] mt-2 max-w-[360px] mx-auto">
            Be the first to sell on TECH-U Marketplace. Post your item in 30 seconds and reach thousands of students.
          </p>
          <Link href="/sell" className="inline-flex mt-6 h-[44px] px-7 bg-[#16a34a] text-white rounded-full font-semibold items-center hover:bg-[#15803d]">
            Sell your first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-[14px] border shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="h-[160px] bg-[#f9fafb] relative">
                {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[32px]">🖼️</div>}
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/70 text-white px-2 py-1 rounded-full">{p.category}</span>
              </div>
              <div className="p-3">
                <div className="font-bold text-[#16a34a] text-[16px]">₦{Number(p.price).toLocaleString()}</div>
                <div className="font-medium text-[13px] leading-tight mt-1 line-clamp-2">{p.title}</div>
                <div className="text-[11px] text-zinc-500 mt-1">{p.location || 'TECH-U Campus'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
