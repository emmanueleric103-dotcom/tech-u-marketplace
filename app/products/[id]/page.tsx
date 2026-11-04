'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function ProductDetail({ params }: { params: { id: string } }){
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{
    const check=()=>{
      const saved=localStorage.getItem('techu-theme')
      const dark=document.documentElement.classList.contains('dark')||saved==='dark'
      setIsDark(dark)
    }
    check()
    const obs=new MutationObserver(check)
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
    window.addEventListener('theme-change',check as any)
    return ()=>{obs.disconnect(); window.removeEventListener('theme-change',check as any)}
  },[])
  const [product,setProduct]=useState<any>(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const load=async()=>{
      try{
        const {data}=await supabase.from('products').select('*').eq('id',params.id).maybeSingle()
        setProduct(data)
      }catch(e){ console.log(e) }
      finally{ setLoading(false) }
    }
    load()
  },[params.id])

  if(loading) return <div className={`p-8 text-center min-h-screen ${isDark?'bg-[#0F0F0F] text-white':'bg-white text-black'}`}>Loading...</div>
  if(!product) return <div className={`p-8 text-center min-h-screen ${isDark?'bg-[#0F0F0F] text-white':'bg-white text-black'}`}>Not found <Link href="/" className="text-[#5B21B6] underline ml-2">Home</Link></div>

  const imgSrc = product.image_url || (Array.isArray(product.images)&&product.images[0]) || product.images || 'https://via.placeholder.com/400'
  // handle all possible field names for WhatsApp/Call
  let rawWa = product.whatsapp_number || product.whatsapp || product.call_number || product.phone_number || product.phone || ''
  let rawCall = product.call_number || product.phone_number || product.whatsapp_number || product.phone || rawWa || ''
  let waClean = String(rawWa).replace(/\D/g,'')
  if(waClean.startsWith('0')) waClean='234'+waClean.slice(1)
  if(waClean && !waClean.startsWith('234')) waClean='234'+waClean
  let callClean = String(rawCall).replace(/\D/g,'')
  if(callClean.startsWith('0')) callClean='234'+callClean.slice(1)

  const waLink = waClean ? `https://wa.me/${waClean}?text=Hi,%20I%20saw%20${encodeURIComponent(product.title)}%20on%20TECH-U%20Marketplace.%20Is%20it%20still%20available?` : ''
  const callLink = callClean ? `tel:+${callClean}` : ''

  return (
    <div className={`min-h-screen pb-28 ${isDark?'bg-[#0F0F12]':'bg-white'}`}>
      <div className="max-w-[600px] mx-auto px-4 pt-4">
        <Link href="/" className={`inline-flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-full ${isDark?'bg-[#1A1A1E] text-gray-300':'bg-gray-100 text-gray-600'}`}>← Back</Link>

        <div className="mt-4 rounded-[20px] overflow-hidden bg-gray-100 border border-gray-100">
          <img src={imgSrc} alt={product.title} className="w-full h-auto object-cover max-h-[500px]" />
        </div>

        <h1 className={`mt-5 text-[20px] font-bold leading-tight ${isDark?'text-white':'text-[#1E1B4B]'}`}>{product.title}</h1>
        <div className="text-[22px] font-extrabold text-[#8B5CF6] mt-2">₦{product.price}</div>
        <div className={`text-[13px] mt-2 flex flex-wrap gap-1 ${isDark?'text-gray-400':'text-gray-500'}`}>
          <span>📍 {product.campus_location||product.location||'Campus'}</span>
          <span>• 📦 {product.category||'General'}</span>
          <span>• {product.condition||'New'}</span>
        </div>

        <div className={`mt-4 text-[14px] leading-relaxed ${isDark?'text-gray-200':'text-gray-700'}`}>
          {product.description}
        </div>

        {/* WhatsApp + Call - ALWAYS VISIBLE NOW */}
        <div className="mt-6 space-y-3">
          <a href={waLink||'#'} target="_blank" className={`w-full h-[52px] rounded-full flex items-center justify-center gap-2 font-bold text-[15px] ${waLink?'bg-[#25D366] text-white':'bg-gray-300 text-gray-600 pointer-events-none'}`}>
            <span>💬</span> Chat on WhatsApp
          </a>
          <a href={callLink||'#'} className={`w-full h-[52px] rounded-full flex items-center justify-center gap-2 font-bold text-[15px] border-2 ${callLink ? (isDark?'bg-[#1A1A1E] border-[#2A2A2E] text-white':'bg-white border-gray-900 text-black') : 'bg-gray-200 border-gray-200 text-gray-500 pointer-events-none'}`}>
            <span>📞</span> Call Seller {callClean ? `+${callClean}` : ''}
          </a>
          {!waLink && !callLink && (
            <div className={`text-[12px] text-center p-3 rounded-xl ${isDark?'bg-[#1A1A1E] text-gray-400':'bg-yellow-50 text-gray-600'}`}>Seller contact not added - ask admin to update listing</div>
          )}
        </div>

        <div className={`mt-6 p-4 rounded-2xl border ${isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-[#FEF9C3] border-yellow-200'}`}>
          <div className={`text-[13px] font-bold ${isDark?'text-[#FACC15]':'text-[#1E1B4B]'}`}>Stay Safe</div>
          <div className={`text-[12px] mt-1 ${isDark?'text-gray-400':'text-gray-600'}`}>Meet at public place (Academic Block/Library), verify item before paying.</div>
        </div>
      </div>
    </div>
  )
}
