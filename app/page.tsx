'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
export const dynamic = 'force-dynamic'

export default function Home(){
  const [products,setProducts] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [cat,setCat] = useState('All')
  const cats = ['All','Phones','Laptops','Accessories','Gadgets']

  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.from('products').select('*').order('created_at',{ascending:false})
      setProducts(data||[])
      setLoading(false)
    })()
  },[])

  const filtered = cat==='All' ? products : products.filter(p=>p.category===cat)

  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      {/* MESH GRADIENT HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-cyan-100 to-violet-200 dark:from-emerald-950 dark:via-slate-900 dark:to-violet-950 opacity-80" />
        <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-emerald-400/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] bg-cyan-400/30 rounded-full blur-[100px]" />
        <div className="relative max-w-[1280px] mx-auto px-6 py-14 md:py-20">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border text-[11px] font-bold tracking-widest uppercase">🇳🇬 Lagos • Trusted Sellers</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">Jiji-Level Design</span>
          </div>
          <h1 className="text-[40px] md:text-[64px] font-black tracking-[-0.03em] leading-[0.9] max-w-[720px]">
            Tech that sells itself.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600"> Expert, not simple.</span>
          </h1>
          <div className="flex gap-6 mt-8">
            <div><div className="text-[28px] font-black">{products.length}+</div><div className="text-[11px] uppercase tracking-widest text-slate-500">Active Listings</div></div>
            <div className="w-px bg-slate-200 dark:bg-slate-800" />
            <div><div className="text-[28px] font-black">4.9/5</div><div className="text-[11px] uppercase tracking-widest text-slate-500">Seller Rating</div></div>
            <div className="w-px bg-slate-200 dark:bg-slate-800" />
            <div><div className="text-[28px] font-black">Same-day</div><div className="text-[11px] uppercase tracking-widest text-slate-500">Delivery Lagos</div></div>
          </div>
          {/* Trust bar */}
          <div className="mt-10 flex flex-wrap gap-3 text-[12px] text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"/>Verified sellers</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"/>Escrow payment</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"/>Image bucket: Image</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Category pills with icons */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-none">
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(c)} className={`whitespace-nowrap px-5 h-[40px] rounded-full border text-[14px] font-semibold transition-all ${cat===c?'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 scale-105 shadow-lg':'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:scale-[1.02]'}`}>
              {c==='All'?'◍':c==='Phones'?'◐':c==='Laptops'?'◑':'◒'} {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({length:8}).map((_,i)=>(
              <div key={i} className="rounded-[20px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 animate-pulse">
                <div className="aspect-[4/3] rounded-[14px] bg-slate-100 dark:bg-slate-800 shimmer" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded mt-3 w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length===0 ? (
          <div className="py-24 text-center">
            <div className="w-24 h-24 mx-auto rounded-[24px] bg-slate-100 dark:bg-slate-900 grid place-items-center text-3xl">◍</div>
            <p className="mt-4 font-bold text-lg">No {cat} yet</p>
            <p className="text-sm text-slate-500">Post first product and it appears here instantly with image</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map(p=>(
              <div key={p.id} className="group rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 dark:bg-slate-900">
                  <img src={p.image_url || p.images?.[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-white/90 dark:bg-black/60 text-[10px] font-bold uppercase tracking-widest">{p.category}</div>
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-black/60 grid place-items-center">♡</div>
                </div>
                <div className="p-3.5">
                  <div className="font-semibold leading-tight line-clamp-2">{p.title}</div>
                  <div className="mt-1 font-black text-emerald-600">₦{Number(p.price).toLocaleString()}</div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><span>●</span>{p.location} • {p.seller_name || 'Verified'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

