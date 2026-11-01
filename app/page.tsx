"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Home(){
  const [products,setProducts]=useState<any[]>([])
  useEffect(()=>{
    supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false}).then(({data})=>setProducts(data||[]))
  },[])
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map(p=>(
        <Link key={p.id} href={`/products/${p.id}`} className="bg-white rounded-2xl border overflow-hidden">
          <img src={p.image_url || p.images?.[0]} alt={p.title} className="w-full aspect-square object-cover" />
          <div className="p-3">
            <p className="font-bold truncate">{p.title}</p>
            <p className="text-[#FF4D1A] font-extrabold">₦{p.price}</p>
            <p className="text-[11px] text-gray-500">{p.pickup_location || p.location}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

