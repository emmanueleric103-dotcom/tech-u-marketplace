'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

function cleanTrim(v:any){ if(v==null) return null; const s=String(v).trim(); return s==='' ? null : s }
function cleanDigits(v:any){ const c=cleanTrim(v); if(!c) return null; const d=c.replace(/\D/g,''); return d==='' ? null : d }
function formatWa(d:string){ let w=d; if(w.startsWith('0')) w='234'+w.slice(1); return w }

export default function ProductPage({params}:{params:{id:string}}){
  const [product,setProduct]=useState<any>(null)
  const [seller,setSeller]=useState<any>(null)
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{ const ck=()=>setIsDark(document.documentElement.classList.contains('dark')); ck(); const o=new MutationObserver(ck); o.observe(document.documentElement,{attributes:true}); return ()=>o.disconnect() },[])
  useEffect(()=>{
    const load=async()=>{
      const {data}=await supabase.from('products').select('*').eq('id',params.id).maybeSingle()
      if(!data) return
      setProduct(data)
      // Increment views via secure API - not direct update
      fetch('/api/products/view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:data.id})})
      if(data.seller_id){
        const {data:sell}=await supabase.from('sellers_public').select('*').eq('id',data.seller_id).maybeSingle()
        setSeller(sell)
      }
    }
    load()
  },[params.id])
  if(!product) return <div className="p-8">Loading...</div>
  // VERIFIED WHATSAPP ONLY - never phone as fallback
  const rawWa = cleanTrim(product.whatsapp_number) || cleanTrim(product.whatsapp) || cleanTrim(product.seller_whatsapp) || cleanTrim(seller?.whatsapp_number)
  const rawCall = cleanTrim(product.call_number) || cleanTrim(product.phone) || cleanTrim(seller?.call_number)
  const waDigits = rawWa ? cleanDigits(rawWa) : null
  const callDigits = rawCall ? cleanDigits(rawCall) : null
  const waClean = waDigits ? formatWa(waDigits) : null
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <img src={product.image_url||product.images?.[0]} className="w-full h-[300px] object-cover rounded-2xl" alt=""/>
      <h1 className={`text-[20px] font-bold mt-4 ${isDark?'text-white':'text-[#1E1B4B]'}`}>{product.title}</h1>
      <div className="text-[18px] font-bold text-[#5B21B6]">₦{product.price?.toLocaleString()}</div>
      <div className={`text-[13px] mt-2 ${isDark?'text-gray-400':'text-gray-500'}`}>{product.campus_location||product.location||'Campus'} • {product.category} • {product.condition||'New'}</div>
      <p className={`mt-4 text-[14px] ${isDark?'text-gray-300':'text-gray-700'}`}>{product.description}</p>
      <div className="mt-6 flex gap-3">
        {waClean && <a href={`https://wa.me/${waClean}?text=Hello,%20I%20saw%20your%20${encodeURIComponent(product.title)}%20on%20TECH-U%20Marketplace`} target="_blank" className="flex-1 bg-[#25D366] text-white text-center py-3 rounded-full font-bold text-[14px]">WhatsApp</a>}
        {callDigits && <a href={`tel:+${callDigits.startsWith('0')?'234'+callDigits.slice(1):callDigits}`} className="flex-1 bg-[#1E1B4B] text-white text-center py-3 rounded-full font-bold text-[14px]">Call</a>}
      </div>
      {!waClean && !callDigits && <div className="mt-4 text-[12px] text-gray-500">Contact unavailable - seller needs to update</div>}
      {seller && <div className="mt-8"><a href={`/store/${seller.id}`} className="text-[13px] text-[#5B21B6] font-bold">Visit {seller.business_name} Store →</a></div>}
    </div>
  )
}
