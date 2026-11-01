'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ProductsPage() {
  const [items, setItems] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')

  useEffect(() => {
    supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false}).then(({data})=> setItems(data||[]))
  }, [])

  const filtered = items.filter(p => {
    const okQ = !q || p.title.toLowerCase().includes(q.toLowerCase())
    const okC = cat==='All' || p.category===cat
    return okQ && okC
  })

  return (
    <div>
      <div className="flex gap-2 overflow-auto pb-2">
        {['All','Electronics','Fashion','Books','Hostel','Services','Others'].map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full border text-sm ${cat===c?'bg-[#16a34a] text-white border-[#16a34a]':'bg-white'}`}>{c}</button>
        ))}
      </div>
      <input placeholder="Search title..." value={q} onChange={e=>setQ(e.target.value)} className="tech-input mt-4" />
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map(p=>(
          <Link key={p.id} href={`/products/${p.id}`} className="tech-card">
            <div className="aspect-square bg-zinc-100">
              {p.images?.[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover"/> : null}
            </div>
            <div className="p-3">
              <div className="font-semibold truncate">{p.title}</div>
              <div className="text-xs text-zinc-500">{p.category} • {p.condition}</div>
              <div className="font-bold text-[#16a34a] mt-1">₦{p.price?.toLocaleString()}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
