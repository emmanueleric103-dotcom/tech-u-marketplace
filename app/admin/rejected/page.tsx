'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Rejected() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ supabase.from('products').select('*').eq('status','rejected').order('created_at',{ascending:false}).then(({data})=> setItems(data||[])) },[])
  const restore = async (id:string) => { await supabase.from('products').update({ status:'pending' }).eq('id', id); location.reload() }

  return (
    <div>
      <h1 className="text-xl font-black">Rejected • {items.length}</h1>
      <div className="mt-4 grid gap-3">
        {items.map(p=>(
          <div key={p.id} className="tech-card p-3 flex justify-between items-center">
            <div><div className="font-semibold">{p.title}</div><div className="text-xs text-zinc-500">{p.seller_name}</div></div>
            <button onClick={()=>restore(p.id)} className="text-xs bg-zinc-100 px-3 py-1 rounded-full">Restore to Pending</button>
          </div>
        ))}
      </div>
    </div>
  )
}
