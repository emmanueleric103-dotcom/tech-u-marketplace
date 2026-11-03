'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SellPage() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ title:'', price:'', category:'Phones', description:'', whatsapp:'' })

  const submit = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const { error } = await supabase.from('products').insert({
        title: form.title,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        whatsapp: form.whatsapp,
        status: 'pending', // CRITICAL: pending not approved
        created_at: new Date().toISOString()
      })
      if (error) throw error
      setMsg('✅ Posted! Waiting for admin approval. It will appear after admin approves in /admin')
      setForm({ title:'', price:'', category:'Phones', description:'', whatsapp:'' })
    } catch (err:any) {
      setMsg('❌ ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-[480px] mx-auto p-6">
      <h1 className="text-[28px] font-black tracking-tight leading-none mb-2">SELL ITEM</h1>
      <p className="text-[13px] text-black/60 mb-6">Item will be hidden until admin approves at /admin</p>
      
      <form onSubmit={submit} className="grid gap-4">
        <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title e.g. iPhone 12" className="h-12 px-4 border border-black/15 text-[15px]" />
        <input required type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price ₦" className="h-12 px-4 border border-black/15" />
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="h-12 px-4 border border-black/15">
          <option>Phones</option><option>Laptops</option><option>Accessories</option><option>Hostel</option>
        </select>
        <textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description + condition" className="min-h-[96px] p-4 border border-black/15" />
        <input required value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="WhatsApp number" className="h-12 px-4 border border-black/15" />
        <button disabled={loading} className="h-12 bg-black text-white font-bold tracking-widest uppercase text-[13px] disabled:opacity-50">
          {loading ? 'Posting...' : 'Post Item - Pending Approval'}
        </button>
        {msg && <div className="p-3 bg-[#F6F3EF] border border-black/10 text-[13px] leading-relaxed">{msg}</div>}
      </form>
    </div>
  )
}

