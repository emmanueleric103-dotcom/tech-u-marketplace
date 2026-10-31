'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Product = { id: string; title: string; price: number; description: string; category: string; created_at: string }
const CATS = ['all','electronics','fashion','books','hostel','services','general']

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    setLoading(true)
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (q) query = query.ilike('title', `%${q}%`)
    if (cat !== 'all') query = query.eq('category', cat)
    const { data } = await query
    setProducts((data as Product[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [cat])

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800 }}>All Products</h1>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0' }}>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid #e2e8f0', background: cat===c ? '#0f172a' : 'white', color: cat===c ? 'white' : '#0f172a', textTransform: 'capitalize' }}>{c}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && fetchData()} placeholder="Search in TECH-U..." style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px' }} />
        <button onClick={fetchData} style={{ padding: '12px 18px', background: '#0f172a', color: 'white', borderRadius: '10px', border: 0 }}>Filter</button>
      </div>
      {loading ? <p>Loading...</p> : products.length===0 ? <div style={{ padding: '40px', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>No listings yet</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {products.map(p=><div key={p.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}><span style={{ fontSize: '11px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '20px', textTransform: 'uppercase' }}>{p.category}</span><h4 style={{ margin: '10px 0 4px', fontWeight: 700 }}>{p.title}</h4><p style={{ fontWeight: 800 }}>₦{p.price}</p></div>)}
        </div>
      )}
    </div>
  )
}
