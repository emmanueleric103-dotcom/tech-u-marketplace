'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { isRateLimited } from '@/lib/rateLimit'

export default function SellPage() {
  const [form, setForm] = useState({ title:'', description:'', price:'', category:'Electronics', condition:'Used - Good', seller_name:'', seller_phone:'', seller_whatsapp:'' })
  const [files, setFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e:any) => {
    e.preventDefault()
    if (isRateLimited('sell_'+form.seller_phone, 3, 60*60*1000)) { alert('Too many posts. Wait 1 hour'); return }
    setLoading(true)
    try {
      const urls: string[] = []
      if (files) {
        for (let i=0;i<Math.min(files.length,4);i++) {
          const f = files[i]
          const path = `products/${Date.now()}_${f.name}`
          const { error } = await supabase.storage.from('product-images').upload(path, f)
          if (!error) {
            const { data } = supabase.storage.from('product-images').getPublicUrl(path)
            urls.push(data.publicUrl)
          }
        }
      }
      const { error } = await supabase.from('products').insert({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        condition: form.condition,
        seller_name: form.seller_name,
        seller_phone: form.seller_phone,
        seller_whatsapp: form.seller_whatsapp,
        images: urls,
        status: 'pending'
      })
      if (error) throw error
      setDone(true)
    } catch (err:any) { alert(err.message) }
    setLoading(false)
  }

  if (done) return <div className="tech-card p-8 text-center"><h2 className="text-2xl font-black">Submitted!</h2><p className="mt-2 text-zinc-600">Your item is now Pending. Admin will approve shortly and it will go live.</p><a href="/" className="tech-btn inline-block mt-4">Go home</a></div>

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-black">Sell without account</h1>
      <p className="text-sm text-zinc-600 mt-1">No login needed. Fill form → Pending → Admin approves → Live with WhatsApp/Call.</p>
      <form onSubmit={submit} className="mt-6 space-y-4 tech-card p-5">
        <input required placeholder="Title e.g. iPhone 12 128GB" className="tech-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <textarea required placeholder="Description, defects, location" className="tech-input min-h-[100px]" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <div className="grid grid-cols-2 gap-3">
          <input required type="number" placeholder="Price ₦" className="tech-input" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
          <select className="tech-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            <option>Electronics</option><option>Fashion</option><option>Books</option><option>Hostel</option><option>Services</option><option>Others</option>
          </select>
        </div>
        <select className="tech-input" value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})}>
          <option>New</option><option>Used - Like New</option><option>Used - Good</option><option>Used - Fair</option>
        </select>
        <div className="grid grid-cols-1 gap-3">
          <input required placeholder="Your name" className="tech-input" value={form.seller_name} onChange={e=>setForm({...form,seller_name:e.target.value})}/>
          <input required placeholder="Phone e.g. 080..." className="tech-input" value={form.seller_phone} onChange={e=>setForm({...form,seller_phone:e.target.value})}/>
          <input required placeholder="WhatsApp e.g. 23480..." className="tech-input" value={form.seller_whatsapp} onChange={e=>setForm({...form,seller_whatsapp:e.target.value})}/>
        </div>
        <div>
          <label className="text-sm font-medium">Images (max 4)</label>
          <input type="file" multiple accept="image/*" onChange={e=>setFiles(e.target.files)} className="mt-1 w-full text-sm"/>
        </div>
        <button disabled={loading} className="tech-btn w-full">{loading?'Uploading...':'Submit for approval'}</button>
        <p className="text-[11px] text-zinc-500">Spam protected via rateLimit.ts (fixed MapIterator). Max 3 posts/hour per phone.</p>
      </form>
    </div>
  )
}
