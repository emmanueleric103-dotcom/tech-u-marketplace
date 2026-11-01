'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Reports() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{
    supabase.from('reports').select('*, products(title)').order('created_at',{ascending:false}).then(({data})=> setItems(data||[]))
  },[])

  const delProduct = async (pid:string) => {
    if(!confirm('Delete product for this report?')) return
    await supabase.from('products').delete().eq('id', pid)
    location.reload()
  }

  return (
    <div>
      <h1 className="text-xl font-black">Reports • {items.length}</h1>
      <div className="mt-4 grid gap-3">
        {items.map(r=>(
          <div key={r.id} className="tech-card p-4">
            <div className="flex justify-between">
              <div className="font-bold">{r.products?.title || r.product_id}</div>
              <div className="text-xs text-zinc-500">{new Date(r.created_at).toLocaleString()}</div>
            </div>
            <div className="text-sm mt-1">Reason: {r.reason}</div>
            <button onClick={()=>delProduct(r.product_id)} className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded-full">Delete product</button>
          </div>
        ))}
        {items.length===0 && <div className="tech-card p-8 text-center text-zinc-500">No reports</div>}
      </div>
    </div>
  )
}
