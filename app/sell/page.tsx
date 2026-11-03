// app/sell/page.tsx - ANDROID FRIENDLY
'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SellPage(){
  const [form,setForm]=useState({title:'',price:'',category:'',condition:'',description:'',whatsapp:'',phone:'',location:''})
  const [errors,setErrors]=useState<any>({})
  const [imgs,setImgs]=useState<string[]>([])
  const validate=()=>{ const e:any={}; if(!form.title) e.title='Title required'; if(!form.price) e.price='Price required'; if(!form.category) e.category='Category required'; if(!form.description) e.description='Description required'; setErrors(e); return !Object.keys(e).length }

  const onImages=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const files=Array.from(e.target.files||[]).slice(0,3); const arr:string[]=[];
    for(const f of files){ const b=await new Promise<string>(res=>{ const r=new FileReader(); r.onload=()=>res(r.result as string); r.readAsDataURL(f)}); arr.push(b) } setImgs(arr)
  }
  const fixWhats=(v:string)=>{ let x=v.replace(/\D/g,''); if(x.startsWith('0')) x='234'+x.slice(1); if(!x.startsWith('234')) x='234'+x; return '+'+x }

  const submit=async()=>{
    if(!validate()) return;
    const payload={...form, whatsapp_number: fixWhats(form.whatsapp), phone_number: form.phone, images: imgs, status:'pending', price: Number(form.price)}
    const { error } = await supabase.from('products').insert(payload); if(error) alert(error.message); else alert('Submitted for approval!')
  }

  return (
    <div className="max-w-lg mx-auto p-4 pb-24">
      <h1 className="text-xl font-extrabold">Sell an Item</h1>
      <div className="mt-4 space-y-4">
        {[
          {k:'title',label:'Product title',ph:'e.g. MacBook Air M1',type:'text'},
          {k:'price',label:'Price in ₦',ph:'50000',type:'number'},
        ].map(f=>(
          <div key={f.k}><label className="text-sm font-bold">{f.label}</label><input value={(form as any)[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} placeholder={f.ph} type={f.type} className="mt-1 w-full h-12 rounded-xl border border-gray-200 px-4 text-[16px] focus:ring-2 focus:ring-[#5B21B6] outline-none"/><{errors[f.k] && <p className="text-xs text-red-600 mt-1">{errors[f.k]}</p>}</div>
        ))}
        <div><label className="text-sm font-bold">Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1 w-full h-12 rounded-xl border border-gray-200 px-4 text-[16px]"><option value="">Select category</option><option>Electronics</option><option>Phones</option><option>Fashion</option><option>Books</option><option>Home & Living</option><option>Vehicles</option><option>Sports</option></select>{errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}</div>
        <div><label className="text-sm font-bold">Condition</label><select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} className="mt-1 w-full h-12 rounded-xl border border-gray-200 px-4 text-[16px]"><option>New</option><option>Like New</option><option>Used</option><option>Fair</option></select></div>
        <div><label className="text-sm font-bold">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={4} className="mt-1 w-full rounded-xl border border-gray-200 p-4 text-[16px]"/><{errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}</div>
        <div><label className="text-sm font-bold">Product images (max 3)</label><label className="mt-1 w-full h-28 rounded-2xl border-2 border-dashed border-gray-200 grid place-items-center text-sm text-gray-500 cursor-pointer">Tap to upload<input type="file" multiple accept="image/*" className="hidden" onChange={onImages}/></label><div className="mt-2 grid grid-cols-3 gap-2">{imgs.map((src,i)=>(<div key={i} className="relative h-20 rounded-xl overflow-hidden"><img src={src} className="w-full h-full object-cover"/><button onClick={()=>setImgs(imgs.filter((_,j)=>j!==i))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs">×</button></div>))}</div></div>
        <div><label className="text-sm font-bold">WhatsApp number</label><input value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="08012345678" className="mt-1 w-full h-12 rounded-xl border border-gray-200 px-4 text-[16px]"/><p className="text-[11px] text-gray-500 mt-1">Auto-converts 080... to +23480...</p></div>
        <div><label className="text-sm font-bold">Call number</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="08012345678" className="mt-1 w-full h-12 rounded-xl border border-gray-200 px-4 text-[16px]"/></div>
        <div><label className="text-sm font-bold">Campus location (optional)</label><select value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="mt-1 w-full h-12 rounded-xl border border-gray-200 px-4 text-[16px]"><option value="">Select location</option><option>Main Campus</option><option>Faculty Area</option><option>Hostel</option><option>Gate Area</option></select></div>
        <button onClick={submit} className="w-full h-14 rounded-full bg-[#5B21B6] text-white font-bold">Post Item for Review</button>
      </div>
    </div>
  )
}

