'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    // ONLY approved show on homepage - pending is hidden correctly
    supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false})
      .then(({data}) => setProducts(data||[]))
  }, [])

  const filtered = products.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      {/* SEARCH WITH ID */}
      <div className="p-4 bg-white border-b">
        <input 
          id="search"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="Search marketplace..."
          className="w-full h-12 px-4 border border-black/15 focus:outline-none focus:border-black"
        />
      </div>

      {/* CATEGORIES WITH ID */}
      <section id="categories" className="p-4 border-b bg-[#F6F3EF]">
        <h2 className="font-black text-[13px] tracking-widest uppercase mb-3">Categories</h2>
        <div className="flex gap-2 overflow-auto">
          {['All','Phones','Laptops','Accessories','Hostel'].map(c=>(
            <span key={c} className="shrink-0 h-8 px-4 bg-white border border-black/10 text-[12px] font-bold grid place-items-center">{c}</span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-[1px] bg-black/10">
        {filtered.map(p=>(
          <Link key={p.id} href={`/products/${p.id}`} className="bg-white p-3">
            <div className="aspect-square bg-zinc-100 mb-2" />
            <div className="font-bold text-[13px] leading-tight">{p.title}</div>
            <div className="text-[13px]">₦{p.price}</div>
          </Link>
        ))}
      </div>

      {/* SAFETY WITH ID */}
      <section id="safety" className="p-6 bg-black text-white mt-1">
        <h3 className="font-black tracking-widest text-[12px] uppercase mb-2">Safety Tips</h3>
        <p className="text-[13px] leading-relaxed text-white/70">Meet in public, verify items, never pay upfront. Report suspicious sellers.</p>
      </section>
    </div>
  )
}

