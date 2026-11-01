'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SellPage(){
  const [title,setTitle]=useState('')
  const [price,setPrice]=useState('')
  const [category,setCategory]=useState('electronics')
  const [images,setImages]=useState<File[]>([])
  const [loading,setLoading]=useState(false)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const files = Array.from(e.target.files||[]).slice(0,3)
    const valid = files.filter(f=>f.size<=2*1024*1024)
    setImages(valid)
  }

  async function submit(){
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if(!user){ alert('Please login'); setLoading(false); return }
    await supabase.from('products').insert({ title, price: Number(price), category, user_id: user.id })
    alert('Listed!'); setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <div className="max-w-[640px] mx-auto bg-white rounded-[24px] shadow-sm border border-zinc-100 p-8">
        <h1 className="text-2xl font-bold mb-6">Sell an Item</h1>
        <div className="space-y-5">
          <div className="border-2 border-dashed border-zinc-200 rounded-[16px] p-8 text-center hover:border-green-300 bg-zinc-50/50">
            <p className="text-3xl mb-2">📸</p>
            <p className="text-sm text-zinc-500 mb-3">Drag & drop up to 3 images (max 2MB each)</p>
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="text-sm" />
            <p className="text-xs text-zinc-400 mt-2">{images.length} images selected</p>
          </div>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Item title" className="w-full h-12 rounded-xl border border-zinc-200 px-4" />
          <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price ₦" type="number" className="w-full h-12 rounded-xl border border-zinc-200 px-4" />
          <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full h-12 rounded-xl border border-zinc-200 px-4">
            <option value="electronics">Electronics</option><option value="books">Books</option><option value="fashion">Fashion</option><option value="hostel">Hostel Items</option><option value="furniture">Furniture</option>
          </select>
          <button onClick={submit} disabled={loading} className="w-full h-12 rounded-full bg-green-600 text-white font-semibold shadow-lg">{loading?'Publishing...':'Publish Listing'}</button>
        </div>
      </div>
    </div>
  )
}
