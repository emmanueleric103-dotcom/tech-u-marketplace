"use client"
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

const cats = [{id:'all',label:'All',icon:'🛍️'},{id:'electronics',label:'Electronics',icon:'📱'},{id:'fashion',label:'Fashion',icon:'👕'},{id:'books',label:'Books',icon:'📚'},{id:'hostel',label:'Hostel',icon:'🛏️'},{id:'accessories',label:'Accessories',icon:'⌚'}]

export default function Home(){
  const [products,setProducts]=useState<any[]>([])
  const [q,setQ]=useState('')
  const [cat,setCat]=useState('all')
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const load=async()=>{
      setLoading(true)
      // FIXED: only approved products show - pending needs admin approval first
      const {data} = await supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false}).limit(50)
      if(data) setProducts(data)
      setLoading(false)
    }
    load()
  },[])

  const filtered = products.filter(p=>{
    const matchQ = !q || p.title?.toLowerCase().includes(q.toLowerCase())
    const matchCat = cat==='all' || p.category===cat || p.category?.toLowerCase()===cat
    return matchQ && matchCat
  })

  return <div className="pt-6">
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 border border-green-100 dark:border-slate-800 p-6 md:p-10">
      <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[0.9]">Campus <span className="bg-gradient-to-br from-[#16a34a] to-emerald-600 bg-clip-text text-transparent">Marketplace</span><br/>Built for TECH-U</h1>
      <p className="mt-3 text-sm opacity-70 max-w-xl">Buy & sell without buyer accounts. Sellers post in 30s, admin verifies, buyers WhatsApp directly. No scam.</p>
      <div className="mt-6 max-w-2xl flex items-center gap-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border p-2">
        <span className="pl-3">🔍</span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Car, Smart watch..." className="flex-1 outline-none bg-transparent py-2 text-sm"/>
        <Link href="/sell" className="bg-[#16a34a] text-white px-5 py-2.5 rounded-xl font-bold">Sell</Link>
      </div>
    </div>

    <div className="mt-5 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {cats.map(c=><button key={c.id} onClick={()=>setCat(c.id)} className={`whitespace-nowrap px-4 py-2.5 rounded-full border font-bold text-sm transition ${cat===c.id?'bg-[#16a34a] text-white border-[#16a34a] shadow':'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>{c.icon} {c.label}</button>)}
    </div>

    <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading? Array.from({length:6}).map((_,i)=><div key={i} className="rounded-[20px] bg-white dark:bg-slate-800 border p-3"><div className="h-32 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-xl"/><div className="h-4 bg-slate-100 dark:bg-slate-700 animate-pulse rounded mt-3"/><div className="h-4 bg-slate-100 dark:bg-slate-700 animate-pulse rounded mt-2 w-2/3"/></div>)
      : filtered.length===0? <div className="col-span-full py-16 text-center bg-white dark:bg-slate-800 rounded-[20px] border"><div className="text-5xl">🛒</div><p className="mt-3 font-bold">No approved listings yet</p><p className="text-xs opacity-60">Pending products need admin approval at /admin/pending</p><Link href="/sell" className="inline-block mt-4 bg-[#16a34a] text-white px-6 py-2.5 rounded-full font-bold">Sell now</Link></div>
      : filtered.map(p=><Link key={p.id} href={`/products/${p.id}`} className="group rounded-[20px] overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700"><img src={p.images?.[0]||p.image_url||''} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/><div className="absolute top-2 left-2 text-[10px] font-black px-2 py-1 rounded-full bg-black/60 text-white uppercase">{p.category||'General'}</div></div>
        <div className="p-3"><h3 className="font-bold text-[13px] leading-tight line-clamp-2">{p.title}</h3><p className="mt-1 font-black text-[#16a34a]">₦{Number(p.price).toLocaleString()}</p><p className="mt-1 text-[11px] opacity-60">📍 {p.pickup_location||p.location||'TECH-U'} • {p.seller_name||'Student'}</p></div>
      </Link>)}
    </div>

    <div className="mt-6 text-center text-xs opacity-50">Showing only approved listings • Pending needs admin at /admin/pending</div>
  </div>
}
