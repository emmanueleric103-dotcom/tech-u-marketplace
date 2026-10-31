'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SellPage() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [desc, setDesc] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Login first'); return }
    const { error } = await supabase.from('products').insert({
      title, price: parseInt(price), description: desc, user_id: user.id
    })
    if (!error) { alert('Product listed!'); router.push('/') }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sell an Item</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="border p-2 w-full" placeholder="Product Name" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="border p-2 w-full" placeholder="Price in Naira" type="number" value={price} onChange={e=>setPrice(e.target.value)} required />
        <textarea className="border p-2 w-full" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
        <button type="submit" className="bg-green-600 text-white p-2 w-full rounded">List Product</button>
      </form>
    </div>
  )
}
