'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '🛍️' },
  { id: 'electronics', label: 'Electronics', icon: '💻' },
  { id: 'fashion', label: 'Fashion', icon: '👕' },
  { id: 'books', label: 'Books', icon: '📚' },
  { id: 'hostel', label: 'Hostel Items', icon: '🛏️' },
  { id: 'furniture', label: 'Furniture', icon: '🪑' },
]

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('all')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProducts() }, [activeCat])

  async function fetchProducts() {
    setLoading(true)
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (activeCat !== 'all') query = query.eq('category', activeCat)
    if (search) query = query.ilike('title', `%${search}%`)
    if (maxPrice) query = query.lte('price', Number(maxPrice))
    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="font-black text-[24px] tracking-tight">TECH-U MARKET</h1>
            <nav className="hidden md:flex gap-6 text-[14px] font-medium text-zinc-500">
              <Link href="/" className="text-zinc-900">Browse</Link>
              <Link href="/sell" className="hover:text-zinc-900">Sell</Link>
            </nav>
          </div>
          <Link href="/auth/login" className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium hover:bg-green-50 hover:border-green-500 hover:text-green-700 transition">Login</Link>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-[24px] shadow-sm border border-zinc-100 p-6 md:p-10 mb-8">
          <h2 className="text-[28px] md:text-[40px] font-bold tracking-tight mb-6">Find what you need on campus</h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400">⌕</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchProducts()} placeholder="Search for textbooks, electronics, furniture..." className="w-full h-[56px] rounded-full bg-zinc-50 border border-zinc-200 pl-12 pr-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white" />
            </div>
            <button onClick={fetchProducts} className="h-[56px] px-8 rounded-full bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700">Search</button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={()=>setActiveCat(cat.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition whitespace-nowrap ${activeCat===cat.id ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-zinc-100 text-zinc-600 border-zinc-100 hover:bg-green-50 hover:border-green-200 hover:text-green-700'}`}>
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8 mb-4">
          <p className="text-sm text-zinc-500">{loading ? 'Loading...' : `${products.length} products found`}</p>
          <div className="flex gap-2">
            <input placeholder="Max price ₦" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="w-28 rounded-full bg-white border border-zinc-200 px-4 py-2 text-sm" />
          </div>
        </div>

        {products.length===0 && !loading ? (
          <div className="bg-white rounded-[24px] border border-zinc-100 shadow-sm py-24 text-center">
            <div className="w-24 h-24 mx-auto bg-zinc-100 rounded-[20px] flex items-center justify-center mb-6"><span className="text-4xl">🛍️</span></div>
            <h3 className="text-xl font-bold mb-2">No products yet</h3>
            <p className="text-zinc-500 mb-6">Be the first to sell on TECH-U</p>
            <Link href="/sell" className="inline-flex px-6 py-3 rounded-full bg-green-600 text-white font-semibold">Sell an Item</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p=>(
              <div key={p.id} className="bg-white rounded-[16px] border border-zinc-100 shadow-sm hover:shadow-md transition overflow-hidden group">
                <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center"><span className="text-zinc-300 text-3xl">📦</span></div>
                <div className="p-3.5">
                  <p className="font-bold text-green-600">₦{p.price?.toLocaleString()}</p>
                  <p className="text-[13px] font-medium truncate mt-1">{p.title}</p>
                  <p className="text-[11px] text-zinc-400 mt-1">{p.location || 'TECH-U Campus'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
