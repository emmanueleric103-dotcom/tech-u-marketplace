'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
export default function ProductDetail({ params }: { params: { id: string } }){
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{
    const check=()=>{const s=localStorage.getItem('techu-theme'); setIsDark(document.documentElement.classList.contains('dark')||s==='dark')}
    check()
    const obs=new MutationObserver(check)
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
    window.addEventListener('theme-change',check as any)
    return ()=>{obs.disconnect(); window.removeEventListener('theme-change',check as any)}
  },[])
  const [product,setProduct]=useState<any>(null)
  const [loading,setLoading]=useState(true)
  const [sellerCount,setSellerCount]=useState(0)
  useEffect(()=>{
    const load=async()=>{
      try{
        const {data}=await supabase.from('products').select('*').eq('id',params.id).maybeSingle()
        setProduct(data)
        if(data){
          const wa=String(data.whatsapp_number||'').replace(/\D/g,'')
          const {data:all}=await supabase.from('products').select('whatsapp_number,status')
          if(all){
            const count=all.filter((p:any)=>String(p.whatsapp_number||'').replace(/\D/g,'')===wa&&(p.status==='approved'||!p.status)).length
            setSellerCount(count)
          }
        }
      }finally{setLoading(false)}
    }
    load()
  },[params.id])
  if(loading) return <div className={`p-8 text-center min-h-screen ${isDark?'bg-[#0F0F12] text-white':'bg-white text-black'}`}>Loading...</div>
  if(!product) return <div className={`p-8 text-center min-h-screen ${isDark?'bg-[#0F0F12] text-white':''}`}>Not found <Link href="/" className="text-[#5B21B6] underline">Home</Link></div>
  const imgSrc=product.image_url||product.images?.[0]||'https://via.placeholder.com/400'
  let rawWa=product.whatsapp_number||product.whatsapp||product.call_number||''
  let rawCall=product.call_number||product.whatsapp_number||''
  let waClean=String(rawWa).replace(/\D/g,'')
  if(waClean.startsWith('0')) waClean='234'+waClean.slice(1)
  let callClean=String(rawCall).replace(/\D/g,'')
  if(callClean.startsWith('0')) callClean='234'+callClean.slice(1)
  const waLink=waClean?`https://wa.me/${waClean}?text=Hi,%20I%20saw%20${encodeURIComponent(product.title)}%20on%20TECH-U%20Marketplace`:''
  const callLink=callClean?`tel:+${callClean}`:''
  const sellerName=product.seller_name||product.business_name||product.title?.split(' ')[0]+' Store'||`Seller • ${String(rawWa).slice(-4)}`
  return (
    <div className={`min-h-screen pb-28 ${isDark?'bg-[#0F0F12]':'bg-white'}`}>
      <div className="max-w-[600px] mx-auto px-4 pt-4">
        <Link href="/" className={`inline-flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-full ${isDark?'bg-[#1A1A1E] text-gray-300':'bg-gray-100 text-gray-600'}`}>← Back</Link>
        <div className="mt-4 rounded-[20px] overflow-hidden bg-gray-100 border"><img src={imgSrc} alt={product.title} className="w-full h-auto object-cover max-h-[500px]" /></div>
        <h1 className={`mt-5 text-[20px] font-bold ${isDark?'text-white':'text-[#1E1B4B]'}`}>{product.title}</h1>
        <div className="text-[22px] font-extrabold text-[#8B5CF6] mt-2">₦{product.price}</div>
        <div className={`text-[13px] mt-2 ${isDark?'text-gray-400':'text-gray-500'}`}>📍 {product.campus_location||product.location||'Campus'} • 📦 {product.category} • {product.condition||'New'}</div>
        <Link href={`/store/${rawWa}`} className={`mt-3 flex items-center gap-3 p-3 rounded-2xl border ${isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-[#F8F7FF] border-gray-100'}`}><img src={imgSrc} className="w-10 h-10 rounded-full object-cover" alt="" /><div className="flex-1"><div className={`text-[13px] font-bold ${isDark?'text-white':'text-[#1E1B4B]'}`}>{sellerName}</div><div className={`text-[11px] ${isDark?'text-gray-400':'text-gray-500'}`}>{sellerCount} active listings • Visit Store →</div></div><span className="text-[#5B21B6] text-[14px]">→</span></Link>
        <div className={`mt-4 text-[14px] leading-relaxed ${isDark?'text-gray-200':'text-gray-700'}`}>{product.description}</div>
        <div className="mt-6 space-y-3">
          <a href={waLink} target="_blank" className="w-full h-[52px] bg-[#25D366] text-white rounded-full flex items-center justify-center gap-2 font-bold text-[15px]">💬 Chat on WhatsApp</a>
          <a href={callLink} className={`w-full h-[52px] rounded-full flex items-center justify-center gap-2 font-bold text-[15px] border-2 ${isDark?'bg-[#1A1A1E] border-[#2A2A2E] text-white':'bg-white border-gray-900 text-black'}`}>📞 Call Seller</a>
        </div>
      </div>
    </div>
  )
}
