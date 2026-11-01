"use client"
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Sell(){
  const [previews,setPreviews]=useState<string[]>([])
  const [base64s,setBase64s]=useState<string[]>([])
  const [uploading,setUploading]=useState(false)
  const [form,setForm]=useState({
    seller_name:'', title:'', price:'',
    category:'electronics', condition:'Used',
    description:'', pickup_location:'TECH-U Main Campus',
    whatsapp:'', phone:''
  })

  const handleFiles = (list: FileList | null)=>{
    if(!list) return
    const arr = Array.from(list).slice(0, 3 - previews.length)
    if(arr.length===0) return alert('Max 3 images - remove one first')
    for(const f of arr){
      if(f.size > 2*1024*1024){ alert(f.name + ' too big >2MB'); continue }
      if(!f.type.startsWith('image/')) continue
      const reader = new FileReader()
      reader.onload = (e)=>{
        const dataUrl = e.target?.result as string
        const img = new Image()
        img.onload = ()=>{
          const canvas = document.createElement('canvas')
          const max = 800
          let w = img.width, h = img.height
          if(w>max || h>max){
            const r = Math.min(max/w, max/h)
            w*=r; h*=r
          }
          canvas.width=w; canvas.height=h
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img,0,0,w,h)
          const compressed = canvas.toDataURL('image/jpeg', 0.7)
          setPreviews(prev=>[...prev, compressed])
          setBase64s(prev=>[...prev, compressed])
        }
        img.src = dataUrl
      }
      reader.readAsDataURL(f)
    }
  }

  const remove = (i:number)=>{
    setPreviews(p=>p.filter((_,idx)=>idx!==i))
    setBase64s(p=>p.filter((_,idx)=>idx!==i))
  }

  const submit = async(e:any)=>{
    e.preventDefault()
    if(previews.length===0) return alert('Please tap box to upload image')
    if(!form.seller_name) return alert('Enter your name')
    if(!form.title) return alert('Enter product title')
    if(!form.price) return alert('Enter price')
    setUploading(true)
    try{
      const {error} = await supabase.from('products').insert({
        title: form.title,
        price: Number(form.price),
        category: form.category,
        condition: form.condition,
        description: form.description,
        pickup_location: form.pickup_location,
        location: form.pickup_location,
        whatsapp: form.whatsapp,
        seller_whatsapp: form.whatsapp,
        phone: form.phone,
        seller_name: form.seller_name,
        images: base64s,
        image_url: base64s[0],
        status: 'pending',
        views: 0
      })
      if(error) throw error
      alert('✅ Posted! Admin will approve soon. Will show on homepage after approval.')
      setPreviews([]); setBase64s([])
      setForm({seller_name:'',title:'',price:'',category:'electronics',condition:'Used',description:'',pickup_location:'TECH-U Main Campus',whatsapp:'',phone:''})
    }catch(err:any){
      alert('Upload failed: ' + (err.message||'Check Supabase URL/KEY in Render Environment'))
    }finally{ setUploading(false) }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] p-4">
      <div className="max-w-[520px] mx-auto bg-white rounded-[24px] border border-[#E8E0D1] p-6 shadow-sm">
        <h1 className="text-[24px] font-extrabold leading-none">Sell Item</h1>
        <p className="text-[13px] text-[#6B6560] mt-2">No Image bucket needed - photos saved directly. Works on phone!</p>
        
        <div className="mt-5 grid grid-cols-3 gap-3">
          {previews.map((src,i)=>(
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
              <img src={src} className="w-full h-full object-cover" />
              <button onClick={()=>remove(i)} className="absolute top-1 right-1 w-6 h-6 bg-black text-white rounded-full text-xs">×</button>
            </div>
          ))}
          {previews.length < 3 && (
            <label className="aspect-square rounded-xl border-2 border-dashed border-[#E8E0D1] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFF6E8] transition">
              <span className="text-2xl">📸</span>
              <span className="text-[11px] mt-1 font-bold">JPG/WEBP/PNG</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e)=>handleFiles(e.target.files)} />
            </label>
          )}
        </div>
        {previews.length>0 && <p className="text-[11px] text-[#1A8B5C] mt-2 font-bold">✅ {previews.length} image(s) compressed to ~300KB and ready - this preview IS what will be saved</p>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input value={form.seller_name} onChange={e=>setForm({...form,seller_name:e.target.value})} placeholder="Your name" className="w-full h-11 px-4 rounded-full border bg-[#F6F1E6] outline-none" />
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="What are you selling? e.g. iPhone 12" className="w-full h-11 px-4 rounded-full border bg-[#F6F1E6] outline-none" />
          <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} type="number" placeholder="Price ₦" className="w-full h-11 px-4 rounded-full border bg-[#F6F1E6] outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="h-11 px-4 rounded-full border bg-[#F6F1E6]">
              <option>electronics</option><option>fashion</option><option>books</option><option>hostel</option><option>others</option>
            </select>
            <select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} className="h-11 px-4 rounded-full border bg-[#F6F1E6]">
              <option>Used</option><option>New</option>
            </select>
          </div>
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description..." className="w-full min-h-[80px] p-4 rounded-[20px] border bg-[#F6F1E6] outline-none" />
          <input value={form.pickup_location} onChange={e=>setForm({...form,pickup_location:e.target.value})} placeholder="Pickup location" className="w-full h-11 px-4 rounded-full border bg-[#F6F1E6] outline-none" />
          <input value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="WhatsApp 08100145906" className="w-full h-11 px-4 rounded-full border bg-[#F6F1E6] outline-none" />
          <button disabled={uploading} className="w-full h-12 rounded-full bg-black text-white font-bold">
            {uploading ? 'Posting without bucket...' : 'Post Product (No Bucket Needed) ✅'}
          </button>
        </form>
      </div>
    </div>
  )
}

