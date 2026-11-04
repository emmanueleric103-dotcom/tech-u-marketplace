'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
export default function ProductDetail({ params }: { params: { id: string } }){
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{
    const check=()=>{const saved=localStorage.getItem('techu-theme'); setIsDark(document.documentElement.classList.contains('dark')||saved==='dark')}
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
      }finally{setLoading(false)}
    }
    load()
  },[params.id])
  if(loading) return <div className={`p-8 text-center ${isDark?'text-white bg-[#0F0F12] min-h-screen':'text-black'}`}>Loading...</div>
  if(!product) return <div className={`p-8 text-center ${isDark?'text-white bg-[#0F0F12] min-h-screen':''}`}>Not found</div>
  const img=product.image_url||product.images?.[0]||'https://via.placeholder.com/400'
  return (
    <div className={`min-h-screen pb-24 ${isDark?'bg-[#0F0F12]':'bg-white'}`}>
      <div className="max-w-[600px] mx-auto px-4 pt-4">
        <Link href="/" className={`inline-flex items-center gap-2 text-[13px] ${isDark?'text-gray-400':'text-gray-500'}`}>← Back</Link>
        <div className="mt-4 rounded-[20px] overflow-hidden bg-gray-100"><img src={img} alt={product.title} className="w-full h-auto" /></div>
        <h1 className={`mt-4 text-[20px] font-bold ${isDark?'text-white':'text-[#1E1B4B]'}`}>{product.title}</h1>
        <div className="text-[20px] font-bold text-[#8B5CF6] mt-2">₦{product.price}</div>
        <div className={`text-[13px] mt-2 ${isDark?'text-gray-400':'text-gray-500'}`}>📍 {product.campus_location||product.location||'Campus'} • 📦 {product.category} • {product.condition||'New'}</div>
        <div className={`mt-4 text-[14px] ${isDark?'text-gray-200':'text-gray-700'}`}>{product.description}</div>
        <div className="mt-6 flex gap-3">
          {product.whatsapp_number&&<a href={`https://wa.me/${product.whatsapp_number}`} className="flex-1 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center font-bold text-[14px]">WhatsApp</a>}
          {product.call_number&&<a href={`tel:+${product.call_number}`} className={`flex-1 h-12 rounded-full flex items-center justify-center font-bold text-[14px] border ${isDark?'bg-[#1A1A1E] border-[#2A2A2E] text-white':'bg-white border-gray-200 text-black'}`}>Call</a>}
        </div>
      </div>
    </div>
  )
}
