'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Link from 'next/link'

export default function HomePage(){
  const [products,setProducts]=useState<any[]>([])
  const [search,setSearch]=useState('')
  const [sort,setSort]=useState('newest')
  const [cat,setCat]=useState('all')
  const [dark,setDark]=useState(false)

  useEffect(()=>{
    const fetchP=async()=>{
      let q=supabase.from('products').select('*').eq('status','active')
      if(sort==='newest') q=q.order('created_at',{ascending:false})
      if(sort==='views') q=q.order('views',{ascending:false})
      const {data}=await q
      setProducts(data||[])
    }
    fetchP()
    if(typeof window!=='undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) setDark(true)
  },[sort])

  const categories=['all','electronics','phones','laptops','accessories','fashion','books','furniture']
  const filtered=products.filter(p=>{
    if(cat!=='all' && p.category!==cat) return false
    if(search && !`${p.title} ${p.seller_name} ${p.pickup_location}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a,b)=>{
    if(sort==='price-low') return a.price-b.price
    if(sort==='price-high') return b.price-a.price
    return 0
  })

  const featured=[...products].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,3)
  const counts=categories.reduce((acc:any,c)=>{acc[c]=c==='all'?products.length:products.filter(p=>p.category===c).length; return acc},{})
  const activeOnline=products.length

  return (
    <div className={dark?'dark':''}>
      <div className="min-h-screen bg-[#fbfdfb] dark:bg-[#060806] text-black dark:text-white">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-black/60 border-b border-black/[0.06] px-4 md:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-[10px] bg-[#0a7a2e] text-white grid place-items-center font-black">T</div><span className="font-black tracking-tight">TECH-U Marketplace</span><span className="ml-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-bold">{activeOnline} Active Online</span></div>
          <div className="flex items-center gap-2"><Link href="/sell" className="h-[36px] px-4 rounded-[12px] bg-[#0a7a2e] text-white font-bold text-[13px] flex items-center">Sell</Link><button onClick={()=>setDark(!dark)} className="w-9 h-9 rounded-[12px] bg-black/5 dark:bg-white/10 grid place-items-center">{dark?'☀':'🌙'}</button></div>
        </header>

        <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-6">
          <div className="bg-gradient-to-br from-[#0a7a2e] to-[#0f4d1f] rounded-[24px] p-6 md:p-10 text-white relative overflow-hidden">
            <h1 className="text-[32px] md:text-[44px] font-black leading-[0.9] tracking-tight">Buy & Sell<br/>Inside TECH-U</h1>
            <p className="mt-3 opacity-80 max-w-[420px] text-[14px]">Verified students, fast WhatsApp deals, pickup on campus. Restored advanced version.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, sellers, location..." className="flex-1 min-w-[240px] h-[46px] px-4 rounded-[14px] bg-white dark:bg-[#151a15] border shadow-sm outline-none" />
            <select value={sort} onChange={e=>setSort(e.target.value)} className="h-[46px] px-4 rounded-[14px] bg-white dark:bg-[#151a15] border shadow-sm text-[13px] font-bold">
              <option value="newest">Newest</option><option value="price-low">Price Low-High</option><option value="price-high">Price High-Low</option><option value="views">Most Viewed</option>
            </select>
          </div>

          <div className="mt-4 flex gap-2 overflow-auto pb-2">
            {categories.map(c=>(
              <button key={c} onClick={()=>setCat(c)} className={`h-[34px] px-4 rounded-full border text-[12px] font-bold capitalize whitespace-nowrap ${cat===c?'bg-black text-white dark:bg-white dark:text-black border-black':'bg-white dark:bg-[#151a15]'}`}>{c} ({counts[c]||0})</button>
            ))}
          </div>

          {featured.length>0 && (
            <div className="mt-8">
              <h2 className="font-black text-[18px]">Featured Most Viewed</h2>
              <div className="mt-3 grid md:grid-cols-3 gap-4">
                {featured.map(p=>(
                  <Link key={p.id} href={`/products/${p.id}`} className="bg-white dark:bg-[#151a15] rounded-[20px] p-3 border shadow-sm flex gap-3">
                    <img src={p.images?.[0]} className="w-[80px] h-[80px] rounded-[12px] object-cover bg-black/5" />
                    <div><p className="font-bold text-[13px] line-clamp-2">{p.title}</p><p className="font-black text-green-600 mt-1">₦{Number(p.price).toLocaleString()}</p><p className="text-[11px] opacity-60">👁 {p.views||0} • {p.pickup_location}</p></div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p=>(
              <Link key={p.id} href={`/products/${p.id}`} className="group bg-white dark:bg-[#151a15] rounded-[20px] overflow-hidden border shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition">
                <div className="relative aspect-[4/3] bg-black/5"><img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-[1.02] transition" /><span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/70 text-white text-[10px] font-bold">{p.condition}</span><span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 text-black text-[10px] font-bold">👁 {p.views||0}</span></div>
                <div className="p-4"><p className="font-bold text-[13px] leading-tight line-clamp-2">{p.title}</p><p className="font-black text-[16px] mt-2 text-green-600">₦{Number(p.price).toLocaleString()}</p><p className="text-[11px] opacity-60 mt-1 truncate">{p.pickup_location} • {p.seller_name}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

