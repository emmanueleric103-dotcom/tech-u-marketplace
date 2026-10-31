'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SellPage() {
  const [form, setForm] = useState({ title: '', price: '', description: '', category: 'general' })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setMsg('Please login first to sell'); setBusy(false); return }
    const { error } = await supabase.from('products').insert([{ title: form.title, price: Number(form.price), description: form.description, category: form.category, user_id: user.id }])
    if (error) setMsg('Error: ' + error.message)
    else { setMsg('Listed successfully! Check dashboard.'); setForm({ title: '', price: '', description: '', category: 'general' }) }
    setBusy(false)
  }

  return (
    <div style={{ maxWidth: '520px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Sell an item</h1>
      <p style={{ color: '#64748b', marginBottom: '18px' }}>Text-only for now to keep build simple. Image upload after Live.</p>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '22px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
        <label style={{ fontSize: '12px', fontWeight: 600 }}>TITLE</label>
        <input required placeholder="e.g. Used JBL Speaker" value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: '12px', margin: '6px 0 14px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
        <label style={{ fontSize: '12px', fontWeight: 600 }}>PRICE (₦)</label>
        <input required type="number" placeholder="15000" value={form.price} onChange={(e)=>setForm({ ...form, price: e.target.value })} style={{ width: '100%', padding: '12px', margin: '6px 0 14px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
        <label style={{ fontSize: '12px', fontWeight: 600 }}>CATEGORY</label>
        <select value={form.category} onChange={(e)=>setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '12px', margin: '6px 0 14px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <option value="general">General</option><option value="electronics">Electronics</option><option value="fashion">Fashion</option><option value="books">Books</option><option value="hostel">Hostel</option><option value="services">Services</option>
        </select>
        <label style={{ fontSize: '12px', fontWeight: 600 }}>DESCRIPTION</label>
        <textarea required placeholder="Condition, location in TECH-U, contact..." value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: '12px', margin: '6px 0 18px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '90px' }} />
        <button type="submit" disabled={busy} style={{ width: '100%', padding: '13px', background: '#0f172a', color: 'white', borderRadius: '10px', border: 0, fontWeight: 700 }}>{busy ? 'Posting...' : 'Post Listing'}</button>
        {msg && <p style={{ marginTop: '14px', padding: '10px', background: '#f1f5f9', borderRadius: '8px', fontSize: '13px' }}>{msg}</p>}
      </form>
    </div>
  )
}
