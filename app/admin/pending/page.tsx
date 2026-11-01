'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Pending() {
  const [items, setItems] = useState<any[]>([])
  const load = () => supabase.from('products').select('*').eq('status','pending').order('created_at',{ascending:false}).then(({data})=> setItems(data||[]))
  useEffect(()=>{ load() },[])

  const act = async (id:string, status:'approved'|'rejected') => {
    await supabase.from('products').update({ status }).eq('id', id)
    load()
  }

  return (
    <div>
      <h1 className="text-xl font-black">Pending • {items.length}</h1>
      <div className="mt-4 grid gap-4">
        {items.map(p=>(
          <div key={p.id} className="tech-card p-4 flex gap-4">
            <img src={p.images?.[0]} alt="" className="w-20 h-20 object-cover rounded-xl bg-zinc-100"/>
            <div className="flex-1">
              <div className="font-bold">{p.title} • ₦{p.price}</div>
              <div className="text-xs text-zinc-500">{p.category} • {p.seller_name} • {p.seller_phone}</div>
              <div className="text-sm mt-1 line-clamp-2">{p.description}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={()=>act(p.id,'approved')} className="bg-[#16a34a] text-white px-4 py-1.5 rounded-full text-sm">Approve</button>
                <button onClick={()=>act(p.id,'rejected')} className="bg-zinc-900 text-white px-4 py-1.5 rounded-full text-sm">Reject</button>
              </div>
            </div>
          </div>
        ))}
        {items.length===0 && <div className="tech-card p-8 text-center text-zinc-500">No pending items</div>}
      </div>
    </div>
  )
}
