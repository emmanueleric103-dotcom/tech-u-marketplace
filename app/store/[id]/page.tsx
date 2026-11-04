'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function StorePage({ params }: { params: { id: string } }){
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{
    const check=()=>{const s=localStorage.getItem('techu-theme'); setIsDark(document.documentElement.classList.contains('dark')||s==='dark')}
    check()
    const obs=new MutationObserver(check)
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
    window.addEventListener('theme-change',check as any)
    return ()=>{obs.disconnect(); window.removeEventListener('theme-change',check as any)}
  },[])
  const storeId=params.id
  const [products,setProducts]=useState<any[]>([])
  const [business,setBusiness]=useState<any>(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const load=async()=>{
      try{
        // Try businesses table if exists
        try{
          const {data:biz}=await supabase.from('businesses').select('*').or(`whatsapp_number.eq.${storeId},id.eq.${storeId}`).maybeSingle()
          if(biz) setBusiness(biz)
        }catch(e){}
        // Fetch approved products for this seller (whatsapp_number or call_number match, include null status for old real data)
        const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false})
        if(data){
          const filtered=data.filter((p:any)=>{
            const wa=String(p.whatsapp_number||'').replace(/\D/g,'')
            const ca=String(p.call_number||'').replace(/\D/g,'')
            const idClean=String(storeId).replace(/\D/g,'')
            const matchWa=wa.includes(idClean)||idClean.includes(wa)||wa===idClean
            const matchCa=ca.includes(idClean)||idClean.includes(ca)
            const approved=p.status==='approved'||!p.status||p.status===null||p.status===''
            return (matchWa||matchCa)&&approved
          })
          setProducts(filtered)
        }
      }finally{setLoading(false)}
    }
    load()
  },[storeId])

  const sellerName=business?.business_name||business?.name||products[0]?.seller_name||products[0]?.business_name|| (products[0]?.title?.split(' ')[0]+' Store') || `Seller • ${storeId.slice(-4)}`
  const logo=business?.logo||business?.image_url||products[0]?.image_url||products[0]?.images?.[0]||'https://via.placeholder.com/200'
  const desc=business?.description||business?.bio||products[0]?.description||'Campus seller on TECH-U Marketplace'
  const waRaw=business?.whatsapp_number||products[0]?.whatsapp_number||storeId
  let waClean=String(waRaw).replace(/\D/g,'')
  if(waClean.startsWith('0')) waClean='234'+waClean.slice(1)
  const waLink=`https://wa.me/${waClean}?text=Hi,%20I%20found%20your%20store%20on%20TECH-U%20Marketplace`
  const callRaw=business?.phone_number||products[0]?.call_number||waRaw
  let callClean=String(callRaw).replace(/\D/g,'')
  if(callClean.startsWith('0')) callClean='234'+callClean.slice(1)

  const bg=isDark?'bg-[#0F0F12]':'bg-white'
  const card=isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-white border-gray-100'
  const textMain=isDark?'text-white':'text-[#1E1B4B]'
  const textMuted=isDark?'text-gray-400':'text-gray-500'

  if(loading) return <div className={`min-h-screen p-8 text-center ${bg} ${textMain}`}>Loading storefront...</div>

  return (
    <div className={`min-h-screen pb-28 ${bg}`}>
      <div className="max-w-[900px] mx-auto px-4 pt-4">
        <Link href="/" className={`text-[13px] ${textMuted}`}>← Back to Marketplace</Link>
        <div className={`${card} border rounded-[24px] p-6 mt-4`}>
          <div className="flex gap-4">
            <img src={logo} alt={sellerName} className="w-20 h-20 rounded-full object-cover border" />
            <div className="flex-1 min-w-0">
              <h1 className={`text-[20px] font-extrabold truncate ${textMain}`}>{sellerName}</h1>
              <p className={`text-[13px] mt-1 line-clamp-2 ${textMuted}`}>{desc}</p>
              <div className={`text-[12px] mt-2 ${textMuted}`}>{products.length} active listings • 📍 Campus</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <a href={waLink} target="_blank" className="h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center gap-2 font-bold text-[14px]">💬 WhatsApp</a>
            <a href={`tel:+${callClean}`} className={`h-11 rounded-full flex items-center justify-center gap-2 font-bold text-[14px] border ${isDark?'bg-[#121214] border-[#2A2A2E] text-white':'bg-white border-gray-900 text-black'}`}>📞 Call</a>
            <button onClick={()=>{const url=window.location.href; if(navigator.share){navigator.share({title:sellerName,url})}else{navigator.clipboard.writeText(url); alert('Link copied: '+url)}}} className={`h-11 rounded-full flex items-center justify-center gap-2 font-bold text-[14px] ${isDark?'bg-[#2A2A2E] text-white':'bg-gray-100 text-black'}`}>🔗 Share Store</button>
          </div>
        </div>

        <h2 className={`mt-8 text-[16px] font-bold ${textMain}`}>Products by {sellerName} ({products.length})</h2>
        {products.length===0 ? (
          <div className={`${card} border rounded-2xl p-8 text-center mt-4`}><div className="text-[28px]">📦</div><div className={`text-[14px] font-bold mt-2 ${textMain}`}>No active listings yet</div><div className={`text-[12px] mt-1 ${textMuted}`}>This seller has no approved products yet.</div><Link href="/" className="inline-flex mt-4 bg-[#5B21B6] text-white rounded-full px-6 py-2.5 text-[13px] font-bold">Browse Marketplace</Link></div>
        ) : (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map((p:any)=>{
              const img=p.image_url||p.images?.[0]||'https://via.placeholder.com/300'
              return <Link key={p.id} href={`/products/${p.id}`} className={`${card} border rounded-2xl overflow-hidden`}><div className="h-[140px] bg-gray-100"><img src={img} alt={p.title} className="w-full h-full object-cover" /></div><div className="p-3"><div className={`text-[13px] font-bold truncate ${textMain}`}>{p.title}</div><div className="text-[13px] font-bold text-[#8B5CF6]">₦{p.price}</div></div></Link>
            })}
          </div>
        )}
      </div>
    </div>
  )
}
