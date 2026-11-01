'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Approved() {
  const [items, setItems] = useState<any[]>([])
  const load = () => supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false}).then(({data})=> setItems(data||[]))
  useEffect(()=>{ load() },[])

  const markSold = async (id:string) => {
    await supabase.from('products').update({ status: 'sold' }).eq('id', id)
    load()
  }
  const del = async (id:string) => {
    if(!confirm('Delete?')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <h1 className="text-xl font-black">Approved • {items.length}</h1>
      <div className="mt-4 grid gap-3">
        {items.map(p=>(
          <div key={p.id} className="tech-card p-3 flex gap-3 items-center">
            <img src={p.images?.[0]} alt="" className="w-14 h-14 rounded-lg object-cover bg-zinc-100"/>
            <div className="flex-1">
              <div className="font-semibold">{p.title} • ₦{p.price}</div>
              <div className="text-xs text-zinc-500">{p.seller_name}</div>
            </div>
            <button onClick={()=>markSold(p.id)} className="text-xs bg-black text-white px-3 py-1 rounded-full">Mark Sold</button>
            <button onClick={()=>del(p.id)} className="text-xs text-red-600 underline">Del</button>
          </div>
        ))}
      </div>
    </div>
  )
}
