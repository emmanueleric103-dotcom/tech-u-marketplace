'use client'
export const dynamic = 'force-dynamic'
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filters, setFilters] = useState({ category: '', condition: '', min: '', max: '', q: '' })
  const supabase = createClient()

  const load = async () => {
    let q = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (filters.q) q = q.ilike('title', `%${filters.q}%`)
    if (filters.category) q = q.eq('category', filters.category)
    if (filters.condition) q = q.eq('condition', filters.condition)
    if (filters.min) q = q.gte('price', Number(filters.min))
    if (filters.max) q = q.lte('price', Number(filters.max))
    const { data } = await q
    setProducts(data || [])
  }

  useEffect(() => { load() }, [filters])

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-64 space-y-3 bg-white border p-4 rounded-2xl h-fit">
        <h3 className="font-bold">Filters (Real DB)</h3>
        <input placeholder="Search..." value={filters.q} onChange={e => setFilters({...filters, q: e.target.value})} />
        <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
          <option value="">All categories</option>
          <option value="phones">Phones</option>
          <option value="laptops">Laptops</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
          <option value="other">Other</option>
        </select>
        <select value={filters.condition} onChange={e => setFilters({...filters, condition: e.target.value})}>
          <option value="">Any condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </select>
        <div className="flex gap-2">
          <input placeholder="Min ₦" value={filters.min} onChange={e => setFilters({...filters, min: e.target.value})} />
          <input placeholder="Max ₦" value={filters.max} onChange={e => setFilters({...filters, max: e.target.value})} />
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <Link key={p.id} href={`/product/${p.id}`} className="bg-white border rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] bg-zinc-100">{p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" alt="" />}</div>
            <div className="p-3"><p className="font-medium truncate">{p.title}</p><p className="text-green-600 font-bold">₦{Number(p.price).toLocaleString()}</p></div>
          </Link>
        ))}
        {products.length===0 && <p className="text-zinc-500">No listings match filters. Real query on Supabase.</p>}
      </div>
    </div>
  )
}
