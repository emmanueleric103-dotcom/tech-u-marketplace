'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../lib/supabase'

type Product = {
  id: string
  title: string
  price: number
  category: string
  description: string
  image_url?: string
  created_at: string
}

const CATEGORIES = ['All', 'Books', 'Electronics', 'Fashion', 'Hostel Essentials', 'Services']

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (!error && data) setProducts(data as Product[])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCat === 'All' || p.category === activeCat
    return matchSearch && matchCat
  })

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      {/* Hero Search */}
      <div className="rounded-[24px] bg-white border shadow-sm p-6 md:p-8">
        <h1 className="text-[28px] md:text-[40px] font-black tracking-tight leading-none">Everything for TECH-U life, <span className="text-[#16a34a]">in one place.</span></h1>
        <p className="mt-3 text-zinc-500 max-w-[560px]">Buy and sell from verified students. No scams, no fake iPhone posts. Just campus essentials.</p>
        <div className="mt-6 flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search books, gadgets, room items..." className="w-full h-[52px] pl-11 pr-4 rounded-full border bg-[#f8faf8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all" />
          </div>
          <Link href="/sell" className="hidden md:grid h-[52px] px-7 rounded-full bg-[#16a34a] text-white font-semibold place-items-center hover:bg-[#15803d] transition">Sell</Link>
        </div>
        <div className="mt-5 flex gap-2 overflow-auto scrollbar-none">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={()=>setActiveCat(cat)} className={`whitespace-nowrap rounded-full border px-4 h-9 text-sm font-medium transition ${activeCat===cat ? 'bg-[#16a34a] text-white border-[#16a34a]' : 'bg-white hover:bg-zinc-50'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">{activeCat} • {filtered.length} items</h2>
          <Link href="/products" className="text-sm font-semibold text-[#16a34a] hover:underline">View all →</Link>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_,i)=>(<div key={i} className="rounded-2xl bg-white border shadow-sm p-3 animate-pulse"><div className="aspect-square rounded-xl bg-zinc-100"/><div className="mt-3 h-4 bg-zinc-100 rounded"/><div className="mt-2 h-3 w-2/3 bg-zinc-100 rounded"/></div>))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-[20px] border-2 border-dashed bg-white p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#f0fdf4] grid place-items-center text-[#16a34a] text-xl">◍</div>
            <h3 className="mt-4 font-bold text-lg">No listings yet</h3>
            <p className="mt-1 text-sm text-zinc-500 max-w-[360px] mx-auto">This is real Supabase data — no fake iPhone, no 404. Be the first to list something for TECH-U.</p>
            <Link href="/sell" className="mt-5 inline-flex h-10 px-5 rounded-full bg-[#16a34a] text-white text-sm font-semibold items-center hover:bg-[#15803d]">List an item</Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map(p=>(
              <div key={p.id} className="rounded-2xl bg-white border shadow-sm overflow-hidden hover:shadow-md transition group">
                <div className="aspect-[4/3] bg-zinc-50 overflow-hidden">
                  {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition" /> : <div className="w-full h-full grid place-items-center text-zinc-300 text-2xl">Image</div>}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold leading-tight line-clamp-2 text-[14px]">{p.title}</h3>
                  <p className="mt-1 font-black text-[#16a34a]">₦{Number(p.price).toLocaleString()}</p>
                  <p className="mt-1 text-[11px] text-zinc-500 uppercase tracking-wide">{p.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
