"use client"
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home(){
  const [products,setProducts]=useState<any[]>([])
  const [q,setQ]=useState('')
  const [cat,setCat]=useState('all')
  const [sort,setSort]=useState('newest')
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    (async()=>{
      setLoading(true)
      const {data} = await supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false})
      setProducts(data||[])
      setLoading(false)
    })()
  },[])

  const filtered = products.filter(p=>{
    const matchQ = !q || p.title?.toLowerCase().includes(q.toLowerCase()) || p.description?.toLowerCase().includes(q.toLowerCase())
    const matchCat = cat==='all' || p.category===cat
    return matchQ && matchCat
  }).sort((a,b)=>{
    if(sort==='price-low') return a.price - b.price
    if(sort==='price-high') return b.price - a.price
    if(sort==='views') return (b.views||0)-(a.views||0)
    return 0
  })

  const cats = ['all','electronics','phones','laptops','accessories','fashion','books','furniture']
  const catCounts:any = {all: products.length}
  products.forEach((p:any)=>{catCounts[p.category]=(catCounts[p.category]||0)+1})
  const featured = [...products].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,3)
  const activeCount = products.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="font-black text-xl flex items-center gap-2"><span className="bg-green-600 text-white w-8 h-8 rounded-lg flex items-center justify-center">T</span>TECH-U_MARKET</Link>
          <Link href="/sell" className="bg-green-600 text-white px-5 py-2 rounded-full font-bold">Sell</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">🟢 {activeCount} active now</h2>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="border rounded-full px-3 py-1 text-sm">
              <option value="newest">Newest</option><option value="price-low">Price Low-High</option><option value="price-high">Price High-Low</option><option value="views">Most Viewed</option>
            </select>
          </div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Smart watch, phones..." className="w-full border rounded-full px-5 py-3 mb-4"/>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {cats.map(c=>(<button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap capitalize ${cat===c?'bg-green-600 text-white':'bg-gray-100 dark:bg-zinc-800'}`}>{c} {catCounts[c]?`(${catCounts[c]})`:''}</button>))}
          </div>
        </div>
        {featured.length>0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-3">⭐ Featured - Most Viewed</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featured.map((p:any)=>(<Link key={'f'+p.id} href={`/products/${p.id}`} className="bg-white dark:bg-zinc-900 rounded-[20px] overflow-hidden shadow hover:shadow-xl transition"><img src={p.images?.[0]||p.image_url||'/placeholder.png'} className="w-full h-40 object-cover"/><div className="p-3"><p className="font-bold truncate">{p.title}</p><p className="text-green-600 font-black">₦{Number(p.price).toLocaleString()}</p></div></Link>))}
            </div>
          </div>
        )}
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p:any)=>(
              <Link key={p.id} href={`/products/${p.id}`} className="bg-white dark:bg-zinc-900 rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all">
                <div className="relative"><img src={p.images?.[0]||p.image_url} alt={p.title} className="w-full h-44 object-cover"/><span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full capitalize">{p.condition||'Used'}</span><span className="absolute top-2 right-2 bg-white text-black text-[10px] px-2 py-1 rounded-full">👁️ {p.views||0}</span></div>
                <div className="p-3"><p className="font-bold text-sm truncate">{p.title}</p><p className="text-green-600 font-black">₦{Number(p.price).toLocaleString()}</p><p className="text-[11px] text-gray-500 mt-1">📍{p.pickup_location||p.location} • {p.seller_name||'Student'}</p></div>
              </Link>
            ))}
          </div>
        )}
        {filtered.length===0 && !loading && <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[24px]"><p className="text-5xl mb-4">📦</p><p>No products found</p></div>}
      </main>
    </div>
  )
}
