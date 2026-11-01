'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const CATS = ['all','electronics','fashion','books','hostel','furniture']

export default function ProductsPage(){
  const [products,setProducts]=useState<any[]>([])
  const [q,setQ]=useState('')
  const [cat,setCat]=useState('all')
  const [loading,setLoading]=useState(true)

  useEffect(()=>{ load() },[cat])
  async function load(){
    setLoading(true)
    let query=supabase.from('products').select('*').order('created_at',{ascending:false})
    if(cat!=='all') query=query.eq('category',cat)
    if(q) query=query.ilike('title',`%${q}%`)
    const {data}=await query
    setProducts(data||[]); setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-zinc-100 h-[64px] flex items-center px-6 justify-between">
        <Link href="/" className="font-black text-[22px]">TECH-U MARKET</Link>
        <Link href="/sell" className="rounded-full bg-green-600 text-white px-5 py-2 text-sm font-semibold">Sell</Link>
      </header>
      <div className="max-w-[1280px] mx-auto p-6">
        <div className="bg-white rounded-[20px] border shadow-sm p-4 flex gap-3 mb-6">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." className="flex-1 rounded-full bg-zinc-50 border px-5 h-12" />
          <button onClick={load} className="rounded-full bg-green-600 text-white px-6 font-semibold">Search</button>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {CATS.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full text-sm border capitalize ${cat===c?'bg-green-600 text-white border-green-600':'bg-zinc-100 border-zinc-100'}`}>{c}</button>)}
        </div>
        <p className="text-sm text-zinc-500 mb-4">{loading?'Loading...':`${products.length} products found`}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p=>(
            <div key={p.id} className="bg-white rounded-2xl border border-zinc-100 p-0 overflow-hidden shadow-sm">
              <div className="h-40 bg-zinc-100" />
              <div className="p-3"><p className="text-green-600 font-bold">₦{p.price}</p><p className="truncate text-sm">{p.title}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
