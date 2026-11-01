'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Prod = { id:string, title:string, price:number, images:string[], category:string, status:string }

export default function Home() {
  const [products, setProducts] = useState<Prod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('id,title,price,images,category,status').eq('status','approved').order('created_at',{ascending:false}).limit(12).then(({data}) => {
      setProducts((data as any) || [])
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <div className="rounded-[24px] bg-[#16a34a] text-white p-6 md:p-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">TECH-U<br/>Marketplace</h1>
          <p className="mt-3 text-white/80 max-w-md">No buyer accounts. Seller posts → Admin approves → WhatsApp/Call. Fast, safe, campus-only.</p>
          <div className="mt-5 flex gap-3">
            <Link href="/products" className="bg-white text-[#16a34a] px-5 py-2.5 rounded-xl font-semibold">Browse</Link>
            <Link href="/sell" className="bg-black/20 px-5 py-2.5 rounded-xl">Sell an item</Link>
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 text-sm backdrop-blur">
          <div className="font-bold">How it works</div>
          <ol className="list-decimal ml-4 mt-2 space-y-1 opacity-90">
            <li>Seller fills form at /sell (no login)</li>
            <li>Goes to Pending</li>
            <li>Admin approves → Live with WhatsApp/Call + Report + Sold badge</li>
          </ol>
        </div>
      </div>

      <h2 className="mt-8 font-bold text-lg">Fresh drops</h2>
      {loading ? <div className="mt-4 text-zinc-500">Loading...</div> : (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => (
            <Link key={p.id} href={`/products/${p.id}`} className="tech-card group">
              <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                {p.images?.[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition"/> : <div className="grid place-items-center h-full text-zinc-400">No img</div>}
                {p.status==='sold' && <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 rounded-full">SOLD</span>}
              </div>
              <div className="p-3">
                <div className="font-semibold line-clamp-1">{p.title}</div>
                <div className="text-sm text-zinc-500">{p.category}</div>
                <div className="mt-1 font-black text-[#16a34a]">₦{p.price?.toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {!loading && products.length===0 && <div className="tech-card p-6 mt-4 text-center text-zinc-500">No approved products yet. Be first to <Link href="/sell" className="text-[#16a34a] underline">sell</Link>.</div>}
    </div>
  )
}
