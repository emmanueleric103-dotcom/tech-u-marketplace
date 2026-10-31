'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SellPage() {
  const supabase = createClient()
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', price: '', condition: 'used', category: 'other', pickup_location: '', whatsapp: '' })
  const [files, setFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const max = 800
        let { width, height } = img
        if (width > height) {
          if (width > max) { height *= max/width; width = max }
        } else {
          if (height > max) { width *= max/height; height = max }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(b => resolve(b!), 'image/jpeg', 0.7)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Login required')

      if (files && files.length > 3) throw new Error('Max 3 images')
      
      const imageUrls: string[] = []
      if (files) {
        for (let i=0;i<files.length;i++) {
          const f = files[i]
          if (f.size > 2*1024*1024) throw new Error(`Image ${f.name} >2MB limit`)
          const compressed = await compressImage(f)
          const fileName = `${user.id}/${Date.now()}-${i}.jpg`
          const { error } = await supabase.storage.from('Image').upload(fileName, compressed, { contentType: 'image/jpeg' })
          if (error) throw error
          const { data } = supabase.storage.from('Image').getPublicUrl(fileName)
          imageUrls.push(data.publicUrl)
        }
      }

      const { error } = await supabase.from('products').insert({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        condition: form.condition,
        category: form.category,
        pickup_location: form.pickup_location,
        whatsapp: form.whatsapp,
        images: imageUrls,
        user_id: user.id
      })
      if (error) throw error
      setMsg('Listed! It will stay after refresh because it is saved in Supabase.')
      setTimeout(()=> router.push('/dashboard'), 800)
    } catch (err: any) {
      setMsg(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto bg-white border rounded-2xl p-6">
      <h1 className="text-2xl font-black">Sell an item - Real DB</h1>
      <p className="text-sm text-zinc-500 mb-4">Upload max 3 images, 2MB each. Compressed to 800px JPEG 70% to save 1GB free tier.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input placeholder="Title" required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
        <textarea placeholder="Description" required rows={4} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="border rounded-lg p-3 w-full" />
        <input placeholder="Price in NGN e.g. 50000" type="number" required value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
        <div className="flex gap-2">
          <select value={form.condition} onChange={e=>setForm({...form, condition: e.target.value})}><option value="new">New</option><option value="used">Used</option><option value="refurbished">Refurbished</option></select>
          <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})}><option value="phones">Phones</option><option value="laptops">Laptops</option><option value="fashion">Fashion</option><option value="books">Books</option><option value="other">Other</option></select>
        </div>
        <input placeholder="Pickup location e.g. TECH-U Main Campus" required value={form.pickup_location} onChange={e=>setForm({...form, pickup_location: e.target.value})} />
        <input placeholder="WhatsApp number e.g. 2348012345678" required value={form.whatsapp} onChange={e=>setForm({...form, whatsapp: e.target.value})} />
        <input type="file" accept="image/*" multiple onChange={e=>setFiles(e.target.files)} />
        <button disabled={loading} className="w-full bg-black text-white py-2.5 rounded-full font-medium disabled:opacity-50">{loading?'Uploading...':'Publish to Supabase'}</button>
        {msg && <p className="text-sm p-2 bg-zinc-50 border rounded-lg">{msg}</p>}
      </form>
    </div>
  )
}
