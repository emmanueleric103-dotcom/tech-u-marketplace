"use client"
import { useState } from 'react'
import { supabase } from '../lib/supabase'

function normalizeWA(v:string){
  let d=v.replace(/\D/g,''); if(d.startsWith('0')) d='234'+d.slice(1); return d
}

export default function Sell(){
  const [form,setForm]=useState({title:'',price:'',category:'phones',condition:'Good',description:'',wa:'',call:'',location:'Hall 2'})
  const [images,setImages]=useState<string[]>([])
  const [err,setErr]=useState<any>({})
  const [ok,setOk]=useState(false)

  const handleImg = async (e:any)=>{
    const files = Array.from(e.target.files || []).slice(0,3-images.length) as File[]
    for(const f of files){
      const reader = new FileReader()
      const p = new Promise<string>(res=>{
        reader.onload=()=>{
          const img = new Image()
          img.onload=()=>{
            const canvas=document.createElement('canvas')
            const max=800
            let w=img.width,h=img.height
            if(w>h){ if(w>max){ h*=max/w; w=max } } else { if(h>max){ w*=max/h; h=max } }
            canvas.width=w; canvas.height=h
            const ctx=canvas.getContext('2d'); ctx?.drawImage(img,0,0,w,h)
            res(canvas.toDataURL('image/jpeg',0.7))
          }
          img.src=reader.result as string
        }
      })
      reader.readAsDataURL(f)
      const b64 = await p
      setImages(s=>[...s,b64].slice(0,3))
    }
  }

  const submit = async ()=>{
    const e:any={}
    if(!form.title) e.title='Title required'
    if(!form.price) e.price='Price required'
    if(!form.description) e.description='Description required'
    if(!form.wa) e.wa='WhatsApp required'
    if(Object.keys(e).length){ setErr(e); return }
    const payload = { ...form, price:Number(form.price), whatsapp:normalizeWA(form.wa), call_number:form.call||form.wa, images, status:'pending', views:0 }
    const { error } = await supabase.from('listings').insert(payload)
    if(!error){ setOk(true); setForm({title:'',price:'',category:'phones',condition:'Good',description:'',wa:'',call:'',location:'Hall 2'}); setImages([]) }
  }

  if(ok) return <div className="max-w-[560px] mx-auto p-6 pt-10 text-center"><div className="w-16 h-16 bg-green-100 rounded-full grid place-items-center mx-auto text-2xl">✅</div><h2 className="mt-4 font-bold text-xl">Listed! Pending approval</h2><p className="text-sm text-gray-500 mt-2">Your item will appear after admin review. You will get WhatsApp buyers directly.</p></div>

  return (
    <div className="max-w-[560px] mx-auto px-4 pt-4 pb-10">
      <h1 className="text-[22px] font-bold">Sell an Item</h1>
      <p className="text-[13px] text-gray-500 mt-1">Large touch-friendly • 3 images max • WhatsApp Bridge</p>

      <div className="mt-5 flex flex-col gap-4">
        <div><label className="text-[13px] font-semibold">Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. iPhone 13 Pro Neat" className="mt-1 w-full min-h-[48px] rounded-xl border border-[#E9E5FF] px-4 text-[16px]" />{err.title && <p className="text-red-500 text-xs mt-1">{err.title}</p>}</div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[13px] font-semibold">Price ₦ *</label><input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} type="number" className="mt-1 w-full min-h-[48px] rounded-xl border px-4 text-[16px]" placeholder="420000" />{err.price && <p className="text-red-500 text-xs mt-1">{err.price}</p>}</div>
          <div><label className="text-[13px] font-semibold">Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1 w-full min-h-[48px] rounded-xl border px-4 text-[16px] bg-white"><option value="phones">Phones</option><option value="electronics">Electronics</option><option value="fashion">Fashion</option><option value="books">Books</option><option value="home">Home</option><option value="vehicles">Vehicles</option><option value="sports">Sports</option></select></div>
        </div>
        <div><label className="text-[13px] font-semibold">Condition</label><select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} className="mt-1 w-full min-h-[48px] rounded-xl border px-4 text-[16px] bg-white"><option>New</option><option>Like New</option><option>Good</option><option>Fair</option></select></div>
        <div><label className="text-[13px] font-semibold">Description *</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="mt-1 w-full min-h-[96px] rounded-xl border px-4 py-3 text-[16px]" placeholder="Battery 92%, box included..." />{err.description && <p className="text-red-500 text-xs mt-1">{err.description}</p>}</div>

        <div><label className="text-[13px] font-semibold">Images (3 max, auto compress 800px)</label><input type="file" multiple accept="image/*" onChange={handleImg} className="mt-1 block" /><div className="mt-2 flex gap-2">{images.map((b,i)=><img key={i} src={b} className="w-20 h-20 rounded-xl object-cover border" />)}</div></div>

        <div><label className="text-[13px] font-semibold">WhatsApp Number * (08100145906 → 2348100145906)</label><input value={form.wa} onChange={e=>setForm({...form,wa:e.target.value})} className="mt-1 w-full min-h-[48px] rounded-xl border px-4 text-[16px]" placeholder="081..." />{err.wa && <p className="text-red-500 text-xs mt-1">{err.wa}</p>}</div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[13px] font-semibold">Call Number</label><input value={form.call} onChange={e=>setForm({...form,call:e.target.value})} className="mt-1 w-full min-h-[48px] rounded-xl border px-4 text-[16px]" placeholder="Optional" /></div>
          <div><label className="text-[13px] font-semibold">Campus Location</label><select value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="mt-1 w-full min-h-[48px] rounded-xl border px-4 text-[16px] bg-white"><option>Hall 1</option><option>Hall 2</option><option>Hall 3</option><option>Academic Block</option><option>Library</option><option>South Gate</option></select></div>
        </div>

        <button onClick={submit} className="w-full bg-[#5B21B6] text-white rounded-full py-4 font-bold text-[16px] mt-2">Publish Listing</button>
        <p className="text-[11px] text-gray-500 text-center">By publishing, you agree to campus safety rules. Buyers contact you via WhatsApp Bridge.</p>
      </div>
    </div>
  )
}
