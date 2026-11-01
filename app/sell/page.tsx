"use client"
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
function compressImage(file: File): Promise<string>{
  return new Promise((res)=>{
    const reader = new FileReader()
    reader.onload = (e)=>{
      const img = new Image()
      img.onload = ()=>{
        const canvas = document.createElement('canvas')
        const max = 800
        let { width, height } = img
        if(width>max || height>max){ const r = Math.min(max/width, max/height); width*=r; height*=r }
        canvas.width=width; canvas.height=height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img,0,0,width,height)
        res(canvas.toDataURL('image/jpeg',0.7))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}
export default function Sell(){
  const [form,setForm]=useState({title:'',price:'',category:'Laptops',description:'',seller_name:'',seller_whatsapp:''})
  const [image,setImage]=useState(''); const [loading,setLoading]=useState(false)
  const onFile = async (e:any)=>{
    const f = e.target.files[0]; if(!f) return
    const compressed = await compressImage(f)
    // upload as data URL to supabase storage workaround: upload base64 converted to blob
    const blob = await (await fetch(compressed)).blob()
    const name = `${Date.now()}.jpg`
    const { data, error } = await supabase.storage.from('product-images').upload(name, blob)
    if(error){ alert('Upload failed: '+error.message); return }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(name)
    setImage(urlData.publicUrl)
  }
  const submit = async (e:any)=>{
    e.preventDefault()
    if(!image){ alert('Please upload image'); return }
    if(!form.seller_name){ alert('Seller name required (FIXED)'); return }
    setLoading(true)
    const { error } = await supabase.from('products').insert([{...form, price: Number(form.price), image_url: image, status: 'pending'}])
    setLoading(false)
    if(error) alert(error.message)
    else { alert('Submitted! Waiting admin approval'); location.href='/products' }
  }
  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-3xl font-black">Sell Item</h1>
      <p className="opacity-60 text-sm mt-1">Fixed: seller_name field + image compress works</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required placeholder="Your Name (FIXED FIELD)" value={form.seller_name} onChange={e=>setForm({...form,seller_name:e.target.value})} className="w-full h-12 rounded-xl border px-4" />
        <input required placeholder="Product Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full h-12 rounded-xl border px-4" />
        <input required type="number" placeholder="Price ₦" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full h-12 rounded-xl border px-4" />
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full h-12 rounded-xl border px-4"><option>Laptops</option><option>Phones</option><option>Accessories</option><option>Hostel Essentials</option></select>
        <textarea required placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full rounded-xl border p-4 h-28" />
        <input required placeholder="WhatsApp e.g 2348012345678" value={form.seller_whatsapp} onChange={e=>setForm({...form,seller_whatsapp:e.target.value})} className="w-full h-12 rounded-xl border px-4" />
        <input type="file" accept="image/*" onChange={onFile} className="w-full" />
        {image && <img src={image} className="rounded-xl h-40 object-cover w-full" />}
        <button disabled={loading} className="w-full h-12 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold">{loading?'Uploading...':'Submit for Review'}</button>
      </form>
    </main>
  )
}
