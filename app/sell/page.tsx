'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'

const CATEGORIES = ['Books','Electronics','Fashion','Hostel Essentials','Services']

export default function SellPage() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [desc, setDesc] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { error } = await supabase.from('products').insert({ title, price: Number(price), description: desc, category, user_id: user.id })
    if (error) setMsg(error.message)
    else { setMsg('Listed!'); setTimeout(()=>router.push('/'), 800) }
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-8">
      <div className="rounded-[20px] bg-white border shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-black">Sell an item</h1>
        <p className="text-sm text-zinc-500 mt-1">List in NGN • visible to all TECH-U students</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="Title e.g. Thermodynamics Textbook" className="w-full h-11 rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20" />
          <input value={price} onChange={e=>setPrice(e.target.value)} required type="number" placeholder="Price in NGN e.g. 5000" className="w-full h-11 rounded-xl border px-4" />
          <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full h-11 rounded-xl border px-4 bg-white">
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} required placeholder="Description, condition, hostel, WhatsApp..." className="w-full min-h-[120px] rounded-xl border p-4" />
          {msg && <p className="text-sm p-3 rounded-xl bg-zinc-50 border">{msg}</p>}
          <button disabled={loading} className="w-full h-12 rounded-full bg-[#16a34a] text-white font-semibold hover:bg-[#15803d]">{loading ? 'Publishing...' : 'Publish Listing'}</button>
        </form>
      </div>
    </div>
  )
}
