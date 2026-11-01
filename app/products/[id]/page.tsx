"use client"
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ProductDetail(){
  const {id} = useParams()
  const [p,setP]=useState<any>(null)
  const [activeImg,setActiveImg]=useState(0)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    (async()=>{
      const {data} = await supabase.from('products').select('*').eq('id',id).single()
      if(data){
        setP(data)
        await supabase.from('products').update({views:(data.views||0)+1}).eq('id',id)
      }
      setLoading(false)
    })()
  },[id])

  if(loading) return <div className="p-10 text-center">Loading...</div>
  if(!p) return <div className="p-10 text-center">Not found <Link href="/" className="text-green-600">Home</Link></div>

  const waNumber = (p.whatsapp||p.seller_whatsapp||p.phone||'').replace(/\D/g,'')
  const waMsg = encodeURIComponent(`Hi! I saw ${p.title} for ₦${p.price} on TECH-U Market. Is it still available?`)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b sticky top-0 z-20"><div className="max-w-4xl mx-auto px-4 py-3 flex justify-between"><Link href="/" className="font-black">← Back</Link><span className="text-sm">TECH-U Market</span></div></header>
      <main className="max-w-4xl mx-auto p-4 grid md:grid-cols-2 gap-6">
        <div><img src={p.images?.[activeImg]||p.image_url} className="w-full h-[400px] object-cover rounded-[24px]"/><div className="flex gap-2 mt-3">{(p.images||[]).map((img:string,i:number)=>(<img key={i} src={img} onClick={()=>setActiveImg(i)} className={`w-16 h-16 rounded-xl object-cover cursor-pointer ${activeImg===i?'ring-2 ring-green-600':''}`}/>))}</div></div>
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-6">
          <h1 className="text-2xl font-black">{p.title}</h1>
          <p className="text-3xl font-black text-green-600 mt-2">₦{Number(p.price).toLocaleString()}</p>
          <p className="mt-4 text-gray-600 dark:text-zinc-300">{p.description}</p>
          <div className="mt-6 space-y-2 text-sm"><p>📍 {p.pickup_location||p.location}</p><p>👤 {p.seller_name}</p><p>📞 {p.phone}</p><p>👁️ {p.views||0} views</p><p className={`inline-block px-3 py-1 rounded-full text-xs ${p.status==='approved'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>🟢 {p.status} {p.status==='approved'?'• Active Online':''}</p></div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" className="bg-green-600 text-white text-center py-3 rounded-full font-bold">WhatsApp Seller</a>
            <a href={`tel:${p.phone}`} className="bg-black dark:bg-white dark:text-black text-white text-center py-3 rounded-full font-bold">Call</a>
          </div>
        </div>
      </main>
    </div>
  )
}
