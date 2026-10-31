'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Product = { id: string; title: string; price: number; description: string; created_at: string }

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  async function fetchProducts(search = '') {
    setLoading(true)
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (search) query = query.ilike('title', `%${search}%`)
    const { data } = await query
    setProducts((data as Product[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>TECH-U Marketplace</h1>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>Real listings from Supabase • No fake iPhones</p>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && fetchProducts(q)} placeholder="Search products..." style={{ flex: 1, padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px' }} />
        <button onClick={() => fetchProducts(q)} style={{ padding: '12px 20px', background: '#0f172a', color: 'white', borderRadius: '10px', border: 0, fontWeight: 600 }}>Search</button>
      </div>
      {loading ? <p>Loading real products...</p> : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📦</div>
          <h3 style={{ margin: 0, fontWeight: 700 }}>No listings yet</h3>
          <p style={{ color: '#64748b' }}>Be the first to post on TECH-U Marketplace</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {products.map((p) => (
            <div key={p.id} style={{ background: 'white', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 6px', fontWeight: 700 }}>{p.title}</h4>
              <p style={{ margin: '0 0 6px', fontWeight: 800 }}>₦{p.price?.toLocaleString()}</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{p.description?.slice(0, 90)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
