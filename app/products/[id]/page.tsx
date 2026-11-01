"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function ProductDetail({params}:{params:{id:string}}){
  const [p,setP]=useState<any>(null)
  const [idx,setIdx]=useState(0)
  useEffect(()=>{
    supabase.from('products').select('*').eq('id',params.id).single().then(({data})=>setP(data))
  },[params.id])
  if(!p) return <div className="p-10">Loading...</div>
  const imgs = p.images?.length ? p.images : [p.image_url]
  return (
    <div className="max-w-[720px] mx-auto p-4">
      <div className="bg-white rounded-[24px] border overflow-hidden">
        <img src={imgs[idx]} className="w-full aspect-[4/3] object-cover" />
        <div className="flex gap-2 p-3 overflow-auto">
          {imgs.map((im:string,i:number)=>(
            <img key={i} src={im} onClick={()=>setIdx(i)} className={`w-16 h-16 rounded-xl object-cover border-2 cursor-pointer ${i===idx?'border-black':'border-transparent'}`} />
          ))}
        </div>
        <div className="p-5">
          <h1 className="text-[22px] font-extrabold">{p.title}</h1>
          <p className="text-[26px] font-extrabold text-[#FF4D1A]">₦{p.price}</p>
          <p className="text-sm mt-2 text-[#6B6560]">{p.description}</p>
          <p className="mt-3 text-xs">Seller: {p.seller_name} | {p.pickup_location || p.location}</p>
          {p.whatsapp && <a href={`https://wa.me/${p.whatsapp}`} target="_blank" className="mt-4 block h-11 rounded-full bg-[#1A8B5C] text-white grid place-items-center font-bold">Chat on WhatsApp</a>}
        </div>
      </div>
    </div>
  )
}

