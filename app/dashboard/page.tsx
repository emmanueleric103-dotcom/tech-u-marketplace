'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard(){
  const [products,setProducts]=useState<any[]>([])
  useEffect(()=>{
    (async()=>{
      const { data:{ user } } = await supabase.auth.getUser()
      if(!user) return
      const { data } = await supabase.from('products').select('*').eq('user_id', user.id).order('created_at',{ascending:false})
      setProducts(data||[])
    })()
  },[])
  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <div className="max-w-[1024px] mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Listings</h1>
        <p className="text-zinc-500 mb-8">{products.length} active listings</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(p=>(
            <div key={p.id} className="bg-white rounded-2xl border p-4 shadow-sm">
              <div className="h-32 bg-zinc-100 rounded-xl mb-3" />
              <p className="font-bold text-green-600">₦{p.price}</p>
              <p className="truncate text-sm">{p.title}</p>
            </div>
          ))}
        </div>
        {products.length===0 && <div className="bg-white rounded-2xl border p-12 text-center"><p className="text-zinc-500">No listings yet</p></div>}
      </div>
    </div>
  )
}
