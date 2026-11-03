"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from './lib/supabase'

export default function Home(){
  const [listings,setListings]=useState<any[]>([])
  const [q,setQ]=useState('')
  useEffect(()=>{
    supabase.from('listings').select('*').eq('status','approved').order('created_at',{ascending:false}).then(({data})=>{ if(data) setListings(data) })
  },[])
  const cats = [
    {id:'electronics',label:'Electronics',icon:'💻',bg:'#EDE9FE'},
    {id:'phones',label:'Phones',icon:'📱',bg:'#DBEAFE'},
    {id:'fashion',label:'Fashion',icon:'👕',bg:'#FCE7F3'},
    {id:'books',label:'Books',icon:'📚',bg:'#FEF3C7'},
    {id:'home',label:'Home',icon:'🛋️',bg:'#D1FAE5'},
    {id:'vehicles',label:'Vehicles',icon:'🚲',bg:'#E0E7FF'},
    {id:'sports',label:'Sports',icon:'⚽',bg:'#FFEDD5'},
    {id:'more',label:'More',icon:'⊞',bg:'#F3F4F6'},
  ]
  const filtered = listings.filter(l=> l.title.toLowerCase().includes(q.toLowerCase()))
  const featured = filtered.filter(l=>l.featured)
  const latest = filtered
  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-3 pb-10">
      {/* Compact Hero 220 mobile 320 desktop */}
      <div className="relative rounded-[20px] overflow-hidden min-h-[220px] md:min-h-[320px] bg-[#5B21B6]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5B21B6] via-[#4C1D95] to-[#1E1B4B]" />
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 30% 20%, #FACC15 0%, transparent 40%), radial-gradient(circle at 80% 80%, white 0%, transparent 30%)'}} />
        <div className="relative p-5 md:p-10 flex flex-col justify-center h-full">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs px-3 py-1 rounded-full w-fit backdrop-blur">🎓 TECH-U Community • Verified Sellers</span>
          <h1 className="mt-3 text-[28px] md:text-[40px] font-bold leading-[1.05] text-white max-w-[520px]">
            Buy Smart. Sell Easy. <span className="text-[#FACC15] underline decoration-4 underline-offset-4 decoration-[#FACC15]">Campus Connected.</span>
          </h1>
          <p className="mt-2 text-white/80 text-[14px] md:text-[15px] max-w-[420px] line-clamp-2">The exclusive marketplace for First Technical University Ibadan. No spam, just campus deals.</p>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <div className="flex items-center bg-white rounded-full p-1.5 pl-4 w-full max-w-[360px]">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search phones, books, hostel items..." className="flex-1 outline-none text-[14px] text-[#1E1B4B]" />
              <button className="bg-[#5B21B6] text-white rounded-full px-5 h-9 text-sm font-semibold">Search</button>
            </div>
            <Link href="/sell" className="bg-[#FACC15] text-[#1E1B4B] rounded-full px-5 h-11 font-semibold text-sm grid place-items-center">Sell an Item</Link>
          </div>
        </div>
      </div>

      {/* Categories - horizontal scroll mobile grid desktop */}
      <section id="categories" className="mt-6">
        <h2 className="font-bold text-[16px]">Browse by Category</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-none md:grid md:grid-cols-8">
          {cats.map(c=>(
            <Link key={c.id} href={`/?cat=${c.id}`} className="shrink-0 w-[84px] md:w-auto flex flex-col items-center gap-2">
              <span className="w-[64px] h-[64px] rounded-2xl grid place-items-center text-xl" style={{background:c.bg}}>{c.icon}</span>
              <span className="text-[12px] font-medium text-center">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured + Latest */}
      <section className="mt-6">
        <div className="flex items-center justify-between"><h2 className="font-bold">Featured Listings</h2><span className="text-xs bg-[#FACC15] px-2 py-1 rounded-full">Trusted</span></div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.map((p:any)=>(
            <Link key={p.id} href={`/products/${p.id}`} className="bg-white rounded-2xl overflow-hidden border border-[#E9E5FF]">
              <div className="h-[140px] bg-[#F5F3FF] grid place-items-center relative">
                <span className="text-3xl">{p.emoji || '📦'}</span>
                <span className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full bg-white font-semibold">{p.status==='sold'?'SOLD':'Available'}</span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-[13px] leading-tight line-clamp-2 text-[#1E1B4B]">{p.title}</p>
                <p className="mt-1 font-bold text-[#5B21B6] text-[14px]">₦{Number(p.price).toLocaleString()}</p>
                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">📍 {p.location} • 👁️ {p.views}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-bold">Latest Listings</h2>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {latest.map((p:any)=>(
            <Link key={p.id} href={`/products/${p.id}`} className="bg-white rounded-2xl overflow-hidden border border-[#E9E5FF]">
              <div className="h-[140px] bg-[#F5F3FF] grid place-items-center relative">
                <span className="text-3xl">{p.emoji || '📦'}</span>
                <span className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full bg-white">{p.condition}</span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-[13px] line-clamp-2">{p.title}</p>
                <p className="font-bold text-[#5B21B6] text-[14px] mt-1">₦{Number(p.price).toLocaleString()}</p>
                <p className="text-[11px] text-gray-500 mt-1">📍 {p.location}</p>
                <span className="mt-2 inline-flex text-[11px] font-semibold text-[#5B21B6]">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div id="safety" className="mt-8 bg-[#FFFBEB] border border-[#FDE68A] rounded-[20px] p-4 flex gap-3">
        <span className="w-10 h-10 rounded-full bg-[#FACC15] grid place-items-center shrink-0">🛡️</span>
        <div><p className="font-bold text-[14px]">Stay Safe on TECH-U Market</p><p className="text-[12px] text-gray-600 mt-1">Meet in public campus spots, verify items, never pay upfront. Report suspicious sellers.</p></div>
      </div>
    </div>
  )
}
