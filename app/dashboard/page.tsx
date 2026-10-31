'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Product = { id: string; title: string; price: number; description: string }

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase.from('products').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setProducts((data as Product[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800 }}>My Listings</h1>
      <p style={{ color: '#64748b', marginBottom: '18px' }}>Products where user_id = current user</p>
      {loading ? <p>Loading...</p> : products.length===0 ? <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>You have no listings yet. Go to Sell.</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {products.map(p=><div key={p.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}><h4 style={{ margin: '0 0 6px', fontWeight: 700 }}>{p.title}</h4><p style={{ fontWeight: 800 }}>₦{p.price}</p><p style={{ fontSize: '12px', color: '#64748b' }}>{p.description?.slice(0,80)}</p></div>)}
        </div>
      )}
    </div>
  )
}
