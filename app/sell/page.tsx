'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getSellerId, setSellerId } from '../lib/seller'
export default function Sell(){
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{const c=()=>{const s=localStorage.getItem('techu-theme'); setIsDark(document.documentElement.classList.contains('dark')||s==='dark')}; c(); const o=new MutationObserver(c); o.observe(document.documentElement,{attributes:true,attributeFilter:['class']}); window.addEventListener('theme-change',c as any); return ()=>{o.disconnect(); window.removeEventListener('theme-change',c as any)}},[])
  const [sellerId,setSellerIdState]=useState<string|null>(null)
  const [businessName,setBusinessName]=useState(''); const [desc,setDesc]=useState(''); const [wa,setWa]=useState(''); const [call,setCall]=useState('')
  const [title,setTitle]=useState(''); const [price,setPrice]=useState(''); const [cat,setCat]=useState('Electronics'); const [cond,setCond]=useState('New'); const [location,setLocation]=useState('Campus'); const [prodDesc,setProdDesc]=useState(''); const [images,setImages]=useState<string[]>([]); const [loading,setLoading]=useState(false)
  useEffect(()=>{ const id=getSellerId(); if(id){ setSellerIdState(id); (async()=>{ const {data}=await supabase.from('sellers').select('*').eq('id',id).maybeSingle(); if(data){ setBusinessName(data.business_name||''); setDesc(data.description||''); setWa(data.whatsapp_number||''); setCall(data.call_number||'') } })() } },[])
  const handleImage=(e:any)=>{ const files=e.target.files; if(!files) return; Array.from(files).slice(0,3).forEach((f:any)=>{ const r=new FileReader(); r.onload=()=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); const max=800; let w=img.width,h=img.height; if(w>max||h>max){ if(w>h){ h*=max/w; w=max } else { w*=max/h; h=max } } c.width=w; c.height=h; c.getContext('2d')!.drawImage(img,0,0,w,h); setImages(prev=>[...prev,c.toDataURL('image/jpeg',0.7)].slice(0,3)) }; img.src=r.result as string }; r.readAsDataURL(f) }) }
  const submit=async()=>{
    if(!title||!price||!wa) return alert('Title, Price, WhatsApp required')
    setLoading(true)
    try{
      let sid=sellerId
      if(!sid){
        const {data,error}=await supabase.from('sellers').insert({business_name:businessName||title.split(' ')[0]+' Store', description:desc, whatsapp_number:wa, call_number:call}).select().single()
        if(error) throw error
        sid=data.id; setSellerId(sid); setSellerIdState(sid)
      }
      const {error}=await supabase.from('products').insert({title, price, category:cat, condition:cond, description:prodDesc, whatsapp_number:wa, call_number:call, campus_location:location, location, images, seller_id:sid, status:'pending'})
      if(error) throw error
      alert('Submitted! Under seller '+sid.slice(0,8)+' - you can submit more products now.')
      setTitle(''); setPrice(''); setProdDesc(''); setImages([])
    }catch(e:any){ alert(e.message) }finally{setLoading(false)}
  }
  const inputCls=isDark?'bg-[#1A1A1E] border-[#2A2A2E] text-white':'bg-white border-gray-200 text-black'
  return (
    <div className={`min-h-screen pb-28 p-4 max-w-[600px] mx-auto ${isDark?'bg-[#0F0F12]':'bg-white'}`}>
      <h1 className={`text-[18px] font-bold ${isDark?'text-white':'text-[#1E1B4B]'}`}>Sell {sellerId?'More Items (Same Seller)':'New Item'}</h1>
      <div className="mt-4 space-y-3">
        <input value={businessName} onChange={e=>setBusinessName(e.target.value)} placeholder="Business Name" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <input value={wa} onChange={e=>setWa(e.target.value)} placeholder="WhatsApp 0703..." className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <input value={call} onChange={e=>setCall(e.target.value)} placeholder="Call (optional)" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <hr />
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Product title" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price ₦" type="number" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <select value={cat} onChange={e=>setCat(e.target.value)} className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`}><option>Electronics</option><option>Phones</option><option>Fashion</option><option>Books</option><option>Home</option><option>Vehicles</option><option>Sports</option><option>More</option></select>
        <textarea value={prodDesc} onChange={e=>setProdDesc(e.target.value)} placeholder="Product description" className={`w-full p-4 rounded-2xl border text-[13px] h-24 ${inputCls}`} />
        <input type="file" multiple accept="image/*" onChange={handleImage} className="text-[12px]" />
        <div className="flex gap-2">{images.map((im,i)=><div key={i} className="relative"><img src={im} className="w-20 h-20 rounded-xl object-cover" /><button onClick={()=>setImages(images.filter((_,j)=>j!==i))} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-[10px]">X</button></div>)}</div>
        <button onClick={submit} disabled={loading} className="w-full h-12 bg-[#5B21B6] text-white rounded-full font-bold">{loading?'...':'Submit for Approval'}</button>
        {sellerId&&<div className={`text-[11px] text-center ${isDark?'text-gray-400':'text-gray-500'}`}>Permanent Seller ID: {sellerId.slice(0,8)}...</div>}
      </div>
    </div>
  )
}
