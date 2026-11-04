'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { isUUID } from '../../lib/seller'
import Link from 'next/link'
export default function StorePage({ params }: { params: { id: string } }){
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{const check=()=>{const s=localStorage.getItem('techu-theme'); setIsDark(document.documentElement.classList.contains('dark')||s==='dark')}; check(); const obs=new MutationObserver(check); obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']}); window.addEventListener('theme-change',check as any); return ()=>{obs.disconnect(); window.removeEventListener('theme-change',check as any)}},[])
  const storeId=params.id
  const [seller,setSeller]=useState<any>(null)
  const [products,setProducts]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    const load=async()=>{
      try{
        if(isUUID(storeId)){
          const {data:s}=await supabase.from('sellers').select('*').eq('id',storeId).maybeSingle()
          setSeller(s)
          const {data:prods}=await supabase.from('products').select('*').eq('seller_id',storeId).eq('status','approved').order('created_at',{ascending:false})
          if(prods) setProducts(prods)
        } else {
          // Old whatsapp URL backward compat - find seller by phone then load by seller_id (no includes bug)
          const clean=storeId.replace(/\D/g,'')
          const {data:sellersList}=await supabase.from('sellers').select('*')
          const matched=sellersList?.find((s:any)=>{const wa=s.whatsapp_number?.replace(/\D/g,'')||''; return wa===clean})
          if(matched){
            setSeller(matched)
            const {data:prods}=await supabase.from('products').select('*').eq('seller_id',matched.id).eq('status','approved').order('created_at',{ascending:false})
            if(prods) setProducts(prods)
          }
        }
      }finally{setLoading(false)}
    }
    load()
  },[storeId])
  if(loading) return <div className={`p-8 text-center ${isDark?'bg-[#0F0F12] text-white':'bg-white'}`}>Loading...</div>
  const name=seller?.business_name||`Seller ${storeId.slice(-4)}`
  const logo=seller?.logo_url||products[0]?.image_url||'https://via.placeholder.com/200'
  let waClean=String(seller?.whatsapp_number||products[0]?.whatsapp_number||'').replace(/\D/g,''); if(waClean.startsWith('0')) waClean='234'+waClean.slice(1)
  const bg=isDark?'bg-[#0F0F12]':'bg-white'; const card=isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-white border-gray-100'; const textMain=isDark?'text-white':'text-[#1E1B4B]'; const textMuted=isDark?'text-gray-400':'text-gray-500'
  return (
    <div className={`min-h-screen pb-28 ${bg}`}>
      <div className="max-w-[900px] mx-auto px-4 pt-4">
        <Link href="/" className={`text-[13px] ${textMuted}`}>← Back</Link>
        <div className={`${card} border rounded-[24px] p-6 mt-4`}>
          <div className="flex gap-4"><img src={logo} alt={name} className="w-20 h-20 rounded-full object-cover" /><div><h1 className={`text-[20px] font-bold ${textMain}`}>{name}</h1><p className={`text-[13px] ${textMuted}`}>{seller?.description||'Campus seller'}</p><div className={`text-[12px] mt-1 ${textMuted}`}>{products.length} active • ID:{storeId.slice(0,8)}</div></div></div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <a href={`https://wa.me/${waClean}`} target="_blank" className="h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center font-bold">WA</a>
            <a href={`tel:+${waClean}`} className={`h-11 rounded-full flex items-center justify-center font-bold border ${isDark?'bg-[#121214] text-white border-[#2A2A2E]':'bg-white text-black border-gray-900'}`}>Call</a>
            <button onClick={()=>{const u=window.location.href; if(navigator.share) navigator.share({title:name,url:u}); else {navigator.clipboard.writeText(u); alert('Copied')}}} className={`h-11 rounded-full font-bold ${isDark?'bg-[#2A2A2E] text-white':'bg-gray-100 text-black'}`}>Share</button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">{products.map((p:any)=><Link key={p.id} href={`/products/${p.id}`} className={`${card} border rounded-2xl overflow-hidden`}><div className="h-[140px] bg-gray-100"><img src={p.image_url||p.images?.[0]||'https://via.placeholder.com/300'} alt="" className="w-full h-full object-cover" /></div><div className="p-3"><div className={`text-[13px] font-bold truncate ${textMain}`}>{p.title}</div><div className="text-[13px] font-bold text-[#8B5CF6]">₦{p.price}</div></div></Link>)}</div>
      </div>
    </div>
  )
}
