'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'

function cleanDigits(v:any){ if(!v) return ''; return String(v).replace(/\D/g,'') }

export default function StorePage({params}:{params:{id:string}}){
  const storeId=params.id
  const [seller,setSeller]=useState<any>(null)
  const [prods,setProds]=useState<any[]>([])
  useEffect(()=>{
    const load=async()=>{
      // Primary: seller_id
      let {data:sell}=await supabase.from('sellers_public').select('*').eq('id',storeId).maybeSingle()
      // Backward compat: if storeId is phone digits, find seller by exact clean match - no includes()
      if(!sell && /^\d+$/.test(cleanDigits(storeId))){
        const clean=cleanDigits(storeId)
        const {data:list}=await supabase.from('sellers_public').select('*')
        const matched=list?.find((s:any)=>cleanDigits(s.whatsapp_number)===clean)
        sell=matched
      }
      setSeller(sell)
      if(sell){
        const {data:products}=await supabase.from('products').select('*').eq('seller_id',sell.id).eq('status','approved').order('created_at',{ascending:false})
        setProds(products||[])
      }
    }
    load()
  },[storeId])
  if(!seller) return <div className="p-8">Loading store...</div>
  return (
    <div className="p-4">
      <h1 className="text-[20px] font-bold">{seller.business_name}</h1>
      <div className="text-[13px] text-gray-500">{seller.description}</div>
      <div className="mt-4 grid grid-cols-2 gap-3">{prods.map((p:any)=><Link key={p.id} href={`/products/${p.id}`} className="border rounded-2xl overflow-hidden"><img src={p.image_url||p.images?.[0]} className="h-[120px] w-full object-cover"/><div className="p-2 text-[12px] font-bold">{p.title}</div><div className="px-2 pb-2 text-[12px] text-[#5B21B6]">₦{p.price}</div></Link>)}</div>
    </div>
  )
}
