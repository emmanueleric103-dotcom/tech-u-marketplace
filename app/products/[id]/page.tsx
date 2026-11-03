"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

function normalizeWA(v:string){ let d=v.replace(/\D/g,''); if(d.startsWith('0')) d='234'+d.slice(1); return d }

export default function ProductDetail(){
  const { id } = useParams()
  const [p,setP]=useState<any>(null)
  const [active,setActive]=useState(0)
  useEffect(()=>{
    supabase.from('listings').select('*').eq('id',id).single().then(({data})=>{ if(data){ setP(data); supabase.from('listings').update({views:(data.views||0)+1}).eq('id',id).then(()=>{}) } })
  },[id])
  if(!p) return <div className="p-6">Loading...</div>
  const wa = normalizeWA(p.whatsapp || p.wa || '')
  const msg = `Hi! I saw ${p.title} on TECH-U Marketplace. Is it still available? ${typeof window!=='undefined'?window.location.href:''}`
  const waLink = `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`

  return (
    <div className="max-w-[900px] mx-auto px-4 pt-4 pb-28">
      <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6">
        <div>
          <div className="bg-[#F5F3FF] rounded-[20px] h-[320px] md:h-[420px] grid place-items-center relative overflow-hidden">
            {p.images?.[active] ? <img src={p.images[active]} className="w-full h-full object-cover" /> : <span className="text-5xl">{p.emoji||'📦'}</span>}
            <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-semibold">{p.condition}</span>
          </div>
          <div className="mt-3 flex gap-2">
            {(p.images||[1,2,3]).slice(0,4).map((_:any,i:number)=>(
              <button key={i} onClick={()=>setActive(i)} className={`w-16 h-16 rounded-xl border-2 overflow-hidden ${active===i?'border-[#5B21B6]':'border-transparent'}`}>
                {p.images?.[i]? <img src={p.images[i]} className="w-full h-full object-cover" /> : <span className="grid place-items-center w-full h-full bg-[#F5F3FF]">{i+1}</span>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-[22px] font-bold leading-tight text-[#1E1B4B]">{p.title}</h1>
          <p className="mt-2 text-[26px] font-extrabold text-[#5B21B6]">₦{Number(p.price).toLocaleString()}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
            <span className="bg-[#F5F3FF] px-3 py-1 rounded-full">📍 {p.location}</span>
            <span className="bg-[#FFFBEB] px-3 py-1 rounded-full">👁️ {p.views} views</span>
            <span className="bg-white border px-3 py-1 rounded-full">{p.time_ago||'recently'}</span>
          </div>

          <div className="mt-5 bg-white border border-[#E9E5FF] rounded-2xl p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#5B21B6] text-white grid place-items-center font-bold">{(p.seller_name||p.seller||'S')[0]}</span>
            <div><p className="font-semibold text-[14px]">{p.seller_name||p.seller||'Campus Seller'}</p><p className="text-[11px] text-green-600">● Verified TECH-U • Usually replies fast</p></div>
          </div>

          <div className="mt-4"><p className="font-semibold text-[14px]">Description</p><p className="text-[13px] text-gray-600 mt-1 leading-relaxed">{p.description}</p></div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <a href={waLink} target="_blank" className="w-full bg-[#25D366] text-white rounded-full py-4 font-bold text-center flex items-center justify-center gap-2">💬 Message Seller on WhatsApp</a>
            <a href={`tel:${p.call_number||p.call||''}`} className="w-full bg-[#5B21B6] text-white rounded-full py-4 font-bold text-center">📞 Call Seller</a>
            <p className="text-[11px] text-gray-500 text-center">WhatsApp Bridge • Open Graph ready: "{'Hi! I saw {title} on TECH-U Marketplace...'}"</p>
          </div>

          <div className="mt-6 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3 text-[11px]">🛡️ Meet at Academic Block or Library lobby. Check item before paying. No advance transfer.</div>
        </div>
      </div>
    </div>
  )
}
