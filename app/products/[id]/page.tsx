'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function normalizeWA(input: string) {
  if (!input) return ''
  let n = input.replace(/[^\d+]/g, '').trim()
  if (n.startsWith('+')) n = n.slice(1)
  if (n.startsWith('0')) return '234' + n.slice(1)
  if (n.startsWith('234')) return n
  if (n.length === 10) return '234' + n
  return n
}

export default function ProductDetail({ params }: { params: { id: string } }){
  const [p,setP]=useState<any>(null)
  useEffect(()=>{
    const load=async()=>{
      const { data } = await supabase.from('products').select('*').eq('id',params.id).single()
      if(data){
        setP(data)
        await supabase.from('products').update({views:(data.views||0)+1}).eq('id',data.id)
      }
    }
    load()
  },[params.id])

  if(!p) return <div className="min-h-screen grid place-items-center">Loading...</div>
  const wa=normalizeWA(p.whatsapp || p.phone || '')

  return (
    <div className="min-h-screen bg-[#fbfdfb] dark:bg-[#060806] p-4 md:p-8">
      <div className="max-w-[980px] mx-auto grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#151a15] rounded-[20px] p-3 border shadow-sm">
          <img src={p.images?.[0]} className="w-full aspect-square object-cover rounded-[16px] bg-black/5" />
          <div className="mt-3 grid grid-cols-3 gap-2">{p.images?.slice(1,4).map((img:string,i:number)=><img key={i} src={img} className="aspect-square object-cover rounded-[12px] bg-black/5" />)}</div>
        </div>
        <div className="bg-white dark:bg-[#151a15] rounded-[20px] p-6 border shadow-sm">
          <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[11px] font-bold">{p.condition} • {p.category}</span>
          <h1 className="mt-4 text-[28px] font-black leading-tight">{p.title}</h1>
          <p className="mt-2 text-[28px] font-black text-green-600">₦{Number(p.price).toLocaleString()}</p>
          <p className="mt-3 text-[13px] leading-relaxed opacity-70 whitespace-pre-wrap">{p.description}</p>
          <div className="mt-6 p-4 rounded-[16px] bg-[#f3f5f3] dark:bg-white/[0.06]">
            <p className="text-[12px] font-bold uppercase opacity-60">Seller</p>
            <p className="font-bold mt-1">{p.seller_name}</p>
            <p className="text-[12px] opacity-60 mt-1">{p.pickup_location} • {p.phone} • WA {wa}</p>
          </div>
          <a href={`https://wa.me/${wa}?text=Hi, I'm interested in ${encodeURIComponent(p.title)} on TECH-U Marketplace`} target="_blank" className="mt-4 h-[52px] w-full rounded-[14px] bg-[#25D366] text-white font-black flex items-center justify-center">Chat on WhatsApp → {wa}</a>
          <p className="mt-2 text-[11px] opacity-50">Auto-converted from {p.whatsapp} to {wa} for international format</p>
        </div>
      </div>
    </div>
  )
}

