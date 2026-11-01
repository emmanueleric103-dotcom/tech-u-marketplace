"use client"
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ProductDetail(){
  const params = useParams()
  const id = params?.id as string
  const [p,setP]=useState<any>(null)
  const [loading,setLoading]=useState(true)
  const [err,setErr]=useState('')
  const [imgIdx,setImgIdx]=useState(0)

  useEffect(()=>{
    if(!id) return
    const load=async()=>{
      setLoading(true)
      const {data,error} = await supabase.from('products').select('*').eq('id',id).single()
      if(error){ setErr(error.message); setLoading(false); return }
      if(data){
        setP(data)
        // increase views
        await supabase.from('products').update({views:(data.views||0)+1}).eq('id',id)
      }
      setLoading(false)
    }
    load()
  },[id])

  if(loading) return <div className="pt-10 text-center">Loading product...</div>
  if(err) return <div className="pt-10 text-center text-red-500">Error: {err}<br/><a href="/" className="text-[#16a34a]">Go home</a></div>
  if(!p) return <div className="pt-10 text-center">Product not found<br/><a href="/" className="text-[#16a34a]">Go home</a></div>

  const waNum = (p.seller_whatsapp||p.whatsapp||p.phone||'').toString().replace(/[^0-9]/g,'')
  const msg = encodeURIComponent(`Hi! I saw ${p.title} for ₦${Number(p.price).toLocaleString()} on TECH-U Marketplace. Is it still available? - From ${p.seller_name||'Student'}`)

  return <div className="pt-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
    <div>
      <div className="rounded-[20px] overflow-hidden bg-white dark:bg-slate-800 border aspect-[4/3] flex items-center justify-center bg-slate-100">
        <img src={p.images?.[imgIdx]||p.image_url||''} alt={p.title} className="w-full h-full object-cover"/>
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
        {(p.images||[]).map((img:string,i:number)=><button key={i} onClick={()=>setImgIdx(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${imgIdx===i?'border-[#16a34a]':'border-transparent'}`}><img src={img} className="w-full h-full object-cover"/></button>)}
      </div>
    </div>
    <div className="bg-white dark:bg-slate-800 border rounded-[20px] p-6">
      <h1 className="text-2xl font-black">{p.title}</h1>
      <p className="mt-2 text-3xl font-black text-[#16a34a]">₦{Number(p.price).toLocaleString()}</p>
      <div className="mt-3 flex gap-2 flex-wrap">
        <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold">{p.condition||'Used'}</span>
        <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs">📍 {p.pickup_location||p.location||'TECH-U'}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status==='approved'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{p.status||'pending'}</span>
      </div>
      <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{p.description||'No description'}</p>
      <div className="mt-6 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border">
        <p className="font-bold">{p.seller_name||'Student Seller'}</p>
        <p className="text-xs opacity-60">Verified • TECH-U • {p.phone||''}</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <a href={`https://wa.me/${waNum}?text=${msg}`} target="_blank" className="bg-gradient-to-br from-[#16a34a] to-emerald-600 text-white py-4 rounded-2xl font-black text-center shadow-lg">WhatsApp Seller</a>
        <a href={`tel:${p.phone}`} className="border-2 border-slate-200 dark:border-slate-700 py-4 rounded-2xl font-black text-center">Call</a>
      </div>
      <div className="mt-4 text-[11px] opacity-60">⚠️ Safety: Meet on campus, inspect before paying, no advance transfer</div>
      <a href="/" className="mt-6 inline-block text-sm text-[#16a34a] font-bold">← Back to marketplace</a>
    </div>
  </div>
}
