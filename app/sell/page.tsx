'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Electronics', 'Fashion', 'Books', 'Furniture', 'Hostel Items', 'Services']
const CONDITIONS = ['New', 'Like New', 'Used - Good', 'Used - Fair']

export default function SellPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [condition, setCondition] = useState(CONDITIONS[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/auth/login')
      else setUser(data.user)
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    const { error } = await supabase.from('products').insert({
      title,
      price: Number(price),
      description,
      category,
      condition,
      user_id: user.id,
      location: 'TECH-U Campus',
    })
    setLoading(false)
    if (!error) {
      router.push('/dashboard')
    } else {
      alert(error.message)
    }
  }

  if (!user) return <div className="p-10 text-center text-sm text-zinc-500">Checking auth…</div>

  return (
    <div className="max-w-[720px] mx-auto px-4 py-8">
      <div className="bg-white rounded-[20px] border shadow-sm p-6 md:p-10">
        <h1 className="text-[26px] font-extrabold tracking-tight">Sell something</h1>
        <p className="text-[13px] text-zinc-500 mt-1">List in 30 seconds — free for TECH-U students</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-[12px] font-semibold">What are you selling?</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. iPhone 12 128GB, Neatly Used" className="mt-2 w-full h-[48px] px-5 rounded-full bg-[#f6f6f6] border focus:bg-white focus:border-[#16a34a] outline-none text-[14px]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-semibold">Price (NGN)</label>
              <input value={price} onChange={e => setPrice(e.target.value)} required type="number" placeholder="85000" className="mt-2 w-full h-[48px] px-5 rounded-full bg-[#f6f6f6] border focus:bg-white focus:border-[#16a34a] outline-none text-[14px]" />
            </div>
            <div>
              <label className="text-[12px] font-semibold">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="mt-2 w-full h-[48px] px-5 rounded-full bg-[#f6f6f6] border focus:bg-white focus:border-[#16a34a] outline-none text-[14px]">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold">Condition</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {CONDITIONS.map(c => (
                <button key={c} type="button" onClick={() => setCondition(c)} className={`h-[36px] px-4 rounded-full text-[12px] font-semibold border ${condition===c ? 'bg-[#16a34a] text-white border-[#16a34a]' : 'bg-white text-zinc-600 hover:border-zinc-300'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe condition, reason for selling, location in hostel..." className="mt-2 w-full px-5 py-4 rounded-[16px] bg-[#f6f6f6] border focus:bg-white focus:border-[#16a34a] outline-none text-[14px] resize-none" />
          </div>

          <button disabled={loading} className="w-full h-[50px] rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-[15px]">
            {loading ? 'Publishing...' : 'Publish Ad — Free'}
          </button>

          <p className="text-[11px] text-zinc-400 text-center">By publishing, you agree to TECH-U Marketplace rules. No fake products.</p>
        </form>
      </div>
    </div>
  )
}
