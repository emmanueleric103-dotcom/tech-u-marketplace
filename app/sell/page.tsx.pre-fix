'use client'
import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'

function clean(v:any){ const s=String(v||'').trim(); return s==='' ? null : s }

export default function SellPage(){
  const [title,setTitle]=useState('')
  const [price,setPrice]=useState('')
  const [cat,setCat]=useState('Electronics')
  const [cond,setCond]=useState('New')
  const [location,setLocation]=useState('Campus')
  const [prodDesc,setProdDesc]=useState('')
  const [images,setImages]=useState<string[]>([])
  const [loading,setLoading]=useState(false)
  const [businessName,setBusinessName]=useState('')
  const [desc,setDesc]=useState('')
  const [wa,setWa]=useState('')
  const [call,setCall]=useState('')
  const [pin,setPin]=useState('')
  const [msg,setMsg]=useState('')

  const handleImage=(e:any)=>{
    const files=e.target.files
    if(!files) return
    Array.from(files).slice(0,4).forEach((file:any)=>{
      const reader=new FileReader()
      reader.onload=(ev)=>{ setImages(prev=>[...prev, ev.target?.result as string].slice(0,4)) }
      reader.readAsDataURL(file)
    })
  }

  const onSubmit=async()=>{
    setLoading(true); setMsg('')
    try{
      // 1. Create seller via direct insert still allowed until Batch 3 RLS lockdown - but we will move to API in Phase 2
      // For now Phase 1: create seller via anon (will be locked in Batch 3) then submit via secure API
      const {data:seller, error:sErr}=await supabase.from('sellers').insert({business_name:businessName, description:desc, whatsapp_number:clean(wa), call_number:clean(call), pin}).select().single()
      if(sErr) throw sErr
      const sellerId=seller.id
      // 2. Secure submission - quarantine, not products
      const res=await fetch('/api/products/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          title, price, category:cat, condition:cond, description:prodDesc,
          whatsapp_number: wa, call_number: call, whatsapp: wa, phone: call,
          campus_location: location, location, images,
          business_name: businessName, seller_id: sellerId,
          turnstileToken: 'bypass-dev' // replace with real Turnstile widget token later
        })
      })
      const j=await res.json()
      if(!res.ok) throw new Error(j.error)
      setMsg('Submitted for review! Your product is in quarantine and will be approved by admin.')
      setTitle(''); setPrice(''); setProdDesc(''); setImages([])
    }catch(e:any){ setMsg('Error: '+e.message) }
    setLoading(false)
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-[20px] font-bold">Sell an Item</h1>
      <input value={businessName} onChange={e=>setBusinessName(e.target.value)} placeholder="Business name" className="mt-4 w-full border rounded-xl p-3 text-[14px]"/>
      <input value={wa} onChange={e=>setWa(e.target.value)} placeholder="WhatsApp number (WhatsApp only)" className="mt-2 w-full border rounded-xl p-3 text-[14px]"/>
      <input value={call} onChange={e=>setCall(e.target.value)} placeholder="Call number (telephone only)" className="mt-2 w-full border rounded-xl p-3 text-[14px]"/>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Product title" className="mt-4 w-full border rounded-xl p-3 text-[14px]"/>
      <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price ₦" className="mt-2 w-full border rounded-xl p-3 text-[14px]"/>
      <input type="file" multiple accept="image/*" onChange={handleImage} className="mt-2 w-full text-[12px]"/>
      <textarea value={prodDesc} onChange={e=>setProdDesc(e.target.value)} placeholder="Description" className="mt-2 w-full border rounded-xl p-3 text-[14px] h-[80px]"/>
      <button onClick={onSubmit} disabled={loading} className="mt-4 w-full bg-[#5B21B6] text-white py-3 rounded-full font-bold">{loading?'Submitting...':'Submit for Review'}</button>
      {msg && <div className="mt-3 text-[13px] text-center">{msg}</div>}
      <div className="mt-2 text-[11px] text-gray-500">Phase 1: Product goes to quarantine product_submissions, not direct products. WhatsApp and Call are separate - never phone as WhatsApp fallback.</div>
    </div>
  )
}
