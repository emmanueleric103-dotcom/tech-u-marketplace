'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'

type Product = { id: string; title: string; price: number; category: string; description: string; image_url?: string }

const CATS = ['All','Books','Electronics','Fashion','Hostel Essentials','Services']

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => { if (data) setProducts(data as Product[]) })
  }, [])

  const list = products.filter(p => (cat==='All' || p.category===cat) && p.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-black">Browse</h1>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search campus market..." className="h-11 w-full md:w-[360px] rounded-full border px-5 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20" />
      </div>
      <div className="mt-4 flex gap-2 overflow-auto">
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`rounded-full border px-4 h-9 text-sm font-medium ${cat===c ? 'bg-[#16a34a] text-white border-[#16a34a]' : 'bg-white'}`}>{c}</button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {list.map(p=>(
          <div key={p.id} className="rounded-2xl bg-white border shadow-sm p-3">
            <div className="aspect-square rounded-xl bg-zinc-100 overflow-hidden">{p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover"/> : <div className="w-full h-full grid place-items-center text-zinc-300">No image</div>}</div>
            <h3 className="mt-3 font-semibold text-sm line-clamp-2">{p.title}</h3>
            <p className="font-black text-[#16a34a]">₦{Number(p.price).toLocaleString()}</p>
          </div>
        ))}
      </div>
      {list.length===0 && <div className="mt-12 text-center text-zinc-500">No products found for this filter.</div>}
    </div>
  )
}
