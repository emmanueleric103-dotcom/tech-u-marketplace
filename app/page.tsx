'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from './lib/supabase'
export default function Home(){
  const [products,setProducts]=useState<any[]>([])
  const [search,setSearch]=useState('')
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    const fetch=async()=>{
      try{
        const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false})
        setProducts(data||[])
      }catch(e){setProducts([])}
      finally{setLoading(false)}
    }
    fetch()
  },[])
  const approved=products.filter(p=>!search || p.title?.toLowerCase().includes(search.toLowerCase())).filter(p=> p.status==='approved' || !p.status || p.status===null || p.status==='' )
  const featured=approved.slice(0,4)
  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="mt-4 rounded-[20px] overflow-hidden relative h-[220px] md:h-[320px] bg-[#1E1B4B]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
          <div className="relative z-10 p-5 md:p-8 h-full flex flex-col justify-center">
            <div className="inline-flex bg-white/20 backdrop-blur px-3 py-1 rounded-full text-[11px] text-white w-fit">🎓 TECH-U Community</div>
            <h1 className="mt-3 text-[22px] md:text-[34px] font-extrabold leading-[1.1] text-white max-w-[320px]">Buy Smart. Sell Easy. <span className="text-[#FACC15] underline">Campus Connected.</span></h1>
            <p className="mt-2 text-[12px] text-white/80 max-w-[320px]">The exclusive marketplace for TECH-U students.</p>
            <div className="mt-4 flex gap-2 max-w-[420px]">
              <div className="flex-1 bg-white rounded-full h-10 flex items-center px-4 gap-2"><span>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="flex-1 text-[13px] outline-none" /></div>
              <Link href="/sell" className="bg-[#5B21B6] text-white rounded-full px-5 h-10 flex items-center text-[13px] font-bold">Sell an Item</Link>
            </div>
          </div>
        </div>
        <div className="mt-6"><h2 className="text-[16px] font-bold text-[#1E1B4B]">Browse by Category</h2><div className="mt-3 grid grid-cols-4 md:grid-cols-8 gap-3">{[{n:'Electronics',i:'💻',b:'bg-blue-50'},{n:'Phones',i:'📱',b:'bg-purple-50'},{n:'Fashion',i:'👕',b:'bg-pink-50'},{n:'Books',i:'📚',b:'bg-yellow-50'},{n:'Home',i:'🏠',b:'bg-green-50'},{n:'Vehicles',i:'🚗',b:'bg-orange-50'},{n:'Sports',i:'⚽',b:'bg-red-50'},{n:'More',i:'⋯',b:'bg-gray-50'}].map(c=><div key={c.n} className={`${c.b} rounded-2xl h-[76px] flex flex-col items-center justify-center gap-1`}><span className="text-[20px]">{c.i}</span><span className="text-[11px] font-medium">{c.n}</span></div>)}</div></div>
        <div className="mt-8"><div className="flex justify-between"><h2 className="text-[16px] font-bold">Featured Listings</h2><span className="text-[12px] text-gray-500">{approved.length} items</span></div>{loading?<div className="mt-4 text-[13px] text-gray-500">Loading...</div>:<div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">{featured.map((p:any)=><Link key={p.id} href={`/products/${p.id}`} className="bg-white border border-gray-100 rounded-2xl overflow-hidden"><div className="h-[140px] bg-gray-100"><img src={p.image_url||p.images?.[0]||'https://via.placeholder.com/300'} alt="" className="w-full h-full object-cover" /></div><div className="p-3"><div className="text-[13px] font-bold truncate">{p.title}</div><div className="text-[13px] font-bold text-[#5B21B6]">₦{p.price}</div></div></Link>)}{featured.length===0&&<div className="col-span-4 text-[13px] text-gray-500 py-6 text-center">No approved listings yet. Approve in /admin</div>}</div>}</div>
      </div>
    </div>
  )
}
