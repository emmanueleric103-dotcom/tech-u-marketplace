'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getSellerId, setSellerId, clearSellerId } from '../lib/seller'
export default function Sell(){
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{const c=()=>{const s=localStorage.getItem('techu-theme'); setIsDark(document.documentElement.classList.contains('dark')||s==='dark')}; c(); const o=new MutationObserver(c); o.observe(document.documentElement,{attributes:true,attributeFilter:['class']}); window.addEventListener('theme-change',c as any); return ()=>{o.disconnect(); window.removeEventListener('theme-change',c as any)}},[])
  const [mode,setMode]=useState<'choose'|'login'|'register'|'dashboard'>('choose')
  const [sellerId,setSellerIdState]=useState<string|null>(null)
  const [seller,setSeller]=useState<any>(null)
  const [businessName,setBusinessName]=useState(''); const [desc,setDesc]=useState(''); const [wa,setWa]=useState(''); const [call,setCall]=useState(''); const [pin,setPin]=useState('')
  const [title,setTitle]=useState(''); const [price,setPrice]=useState(''); const [cat,setCat]=useState('Electronics'); const [cond,setCond]=useState('New'); const [location,setLocation]=useState('Campus'); const [prodDesc,setProdDesc]=useState(''); const [images,setImages]=useState<string[]>([]); const [loading,setLoading]=useState(false)
  const [loginWa,setLoginWa]=useState(''); const [loginPin,setLoginPin]=useState('')

  useEffect(()=>{ const id=getSellerId(); if(id){ (async()=>{ const {data}=await supabase.from('sellers').select('*').eq('id',id).maybeSingle(); if(data){ setSeller(data); setSellerIdState(id); setBusinessName(data.business_name||''); setDesc(data.description||''); setWa(data.whatsapp_number||''); setCall(data.call_number||''); setMode('dashboard') } })() } },[])

  const handleImage=(e:any)=>{ const files=e.target.files; if(!files) return; Array.from(files).slice(0,3).forEach((f:any)=>{ const r=new FileReader(); r.onload=()=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); const max=800; let w=img.width,h=img.height; if(w>max||h>max){ if(w>h){ h*=max/w; w=max } else { w*=max/h; h=max } } c.width=w; c.height=h; c.getContext('2d')!.drawImage(img,0,0,w,h); setImages(prev=>[...prev,c.toDataURL('image/jpeg',0.7)].slice(0,3)) }; img.src=r.result as string }; r.readAsDataURL(f) }) }

  const register=async()=>{
    if(!businessName||!wa||!pin||pin.length<4) return alert('Business, WhatsApp, PIN 4 digits required')
    setLoading(true)
    try{
      const {data,error}=await supabase.from('sellers').insert({business_name:businessName, description:desc, whatsapp_number:wa, call_number:call, pin:pin}).select().single()
      if(error) throw error
      setSellerId(data.id); setSellerIdState(data.id); setSeller(data); setMode('dashboard')
    }catch(e:any){ alert(e.message) }finally{setLoading(false)}
  }

  const login=async()=>{
    if(!loginWa||!loginPin) return alert('Enter WhatsApp and PIN')
    setLoading(true)
    try{
      const {data,error}=await supabase.from('sellers').select('*').eq('whatsapp_number',loginWa).eq('pin',loginPin).maybeSingle()
      if(error) throw error
      if(!data) return alert('Invalid WhatsApp or PIN - cannot access another seller')
      setSellerId(data.id); setSellerIdState(data.id); setSeller(data); setBusinessName(data.business_name||''); setDesc(data.description||''); setWa(data.whatsapp_number||''); setCall(data.call_number||''); setMode('dashboard')
    }catch(e:any){ alert(e.message) }finally{setLoading(false)}
  }

  const submitProduct=async()=>{
    if(!title||!price) return alert('Title and Price required')
    if(!sellerId) return alert('No seller ID')
    setLoading(true)
    try{
      const {error}=await supabase.from('products').insert({title, price, category:cat, condition:cond, description:prodDesc, whatsapp_number:wa, call_number:call, campus_location:location, location, images, seller_id:sellerId, status:'pending'})
      if(error) throw error
      alert('Product submitted under your permanent ID!'); setTitle(''); setPrice(''); setProdDesc(''); setImages([])
    }catch(e:any){ alert(e.message) }finally{setLoading(false)}
  }

  const inputCls=isDark?'bg-[#1A1A1E] border-[#2A2A2E] text-white':'bg-white border-gray-200 text-black'
  const textMain=isDark?'text-white':'text-[#1E1B4B]'

  if(mode==='choose') return (
    <div className={`min-h-screen pb-28 p-6 max-w-[500px] mx-auto ${isDark?'bg-[#0F0F12]':'bg-white'}`}>
      <h1 className={`text-[20px] font-bold ${textMain}`}>Seller Portal</h1>
      <div className="mt-6 space-y-3">
        <button onClick={()=>setMode('login')} className="w-full h-12 bg-[#1E1B4B] text-white rounded-full font-bold">Returning Seller - Login with PIN</button>
        <button onClick={()=>setMode('register')} className="w-full h-12 bg-[#5B21B6] text-white rounded-full font-bold">New Seller - Register Business</button>
        <div className={`text-[12px] mt-4 ${isDark?'text-gray-400':'text-gray-500'}`}>Your Permanent Seller ID is created once and never changes. You need WhatsApp + PIN to access your profile - ID alone is not enough.</div>
      </div>
    </div>
  )

  if(mode==='login') return (
    <div className={`min-h-screen p-4 max-w-[500px] mx-auto ${isDark?'bg-[#0F0F12]':'bg-white'}`}>
      <button onClick={()=>setMode('choose')} className="text-[13px]">← Back</button>
      <h2 className={`mt-4 text-[18px] font-bold ${textMain}`}>Returning Seller Login</h2>
      <div className="mt-4 space-y-3">
        <input value={loginWa} onChange={e=>setLoginWa(e.target.value)} placeholder="WhatsApp e.g. 07039215157" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <input value={loginPin} onChange={e=>setLoginPin(e.target.value)} placeholder="PIN 4 digits" type="password" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <button onClick={login} disabled={loading} className="w-full h-12 bg-[#5B21B6] text-white rounded-full font-bold">{loading?'Verifying...':'Verify & Access Profile'}</button>
      </div>
    </div>
  )

  if(mode==='register') return (
    <div className={`min-h-screen p-4 max-w-[600px] mx-auto ${isDark?'bg-[#0F0F12]':'bg-white'}`}>
      <button onClick={()=>setMode('choose')} className="text-[13px]">← Back</button>
      <h2 className={`mt-4 text-[18px] font-bold ${textMain}`}>Register Business - Permanent ID</h2>
      <div className="mt-4 space-y-3">
        <input value={businessName} onChange={e=>setBusinessName(e.target.value)} placeholder="Business Name" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Business description" className={`w-full p-4 rounded-2xl border text-[13px] h-20 ${inputCls}`} />
        <input value={wa} onChange={e=>setWa(e.target.value)} placeholder="WhatsApp" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <input value={call} onChange={e=>setCall(e.target.value)} placeholder="Call number (optional)" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <input value={pin} onChange={e=>setPin(e.target.value)} placeholder="Set 4-digit PIN (secure)" type="password" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
        <button onClick={register} disabled={loading} className="w-full h-12 bg-[#5B21B6] text-white rounded-full font-bold">{loading?'Creating...':'Create Permanent Seller ID'}</button>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen pb-28 p-4 max-w-[600px] mx-auto ${isDark?'bg-[#0F0F12]':'bg-white'}`}>
      <div className="flex justify-between"><h1 className={`text-[18px] font-bold ${textMain}`}>Seller Dashboard</h1><button onClick={()=>{clearSellerId(); setMode('choose'); setSellerIdState(null)}} className="text-[12px] text-red-500">Logout</button></div>
      <div className={`${isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-[#F8F7FF] border-gray-100'} border rounded-2xl p-4 mt-4`}>
        <div className={`text-[12px] ${isDark?'text-gray-400':'text-gray-500'}`}>Business Profile (auto-filled)</div>
        <div className={`text-[14px] font-bold mt-1 ${textMain}`}>{businessName}</div>
        <div className={`text-[12px] mt-1 ${isDark?'text-gray-400':'text-gray-500'}`}>{desc} • {wa}</div>
        <div className="mt-3 p-2 bg-black/5 rounded-xl">
          <div className={`text-[10px] ${isDark?'text-gray-400':'text-gray-500'}`}>Permanent Seller ID (never changes)</div>
          <div className={`text-[11px] font-mono break-all ${textMain}`}>{sellerId}</div>
          <button onClick={()=>{if(sellerId){navigator.clipboard.writeText(sellerId); alert('Copied ID')}}} className="text-[10px] text-[#5B21B6]">Copy ID</button>
        </div>
      </div>
      <div className="mt-6">
        <h3 className={`text-[14px] font-bold ${textMain}`}>Add New Product (linked to your ID)</h3>
        <div className="mt-3 space-y-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Product title" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
          <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price ₦" type="number" className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`} />
          <select value={cat} onChange={e=>setCat(e.target.value)} className={`w-full h-11 px-4 rounded-full border text-[13px] ${inputCls}`}><option>Electronics</option><option>Phones</option><option>Fashion</option><option>Books</option><option>Home</option><option>Vehicles</option><option>Sports</option><option>More</option></select>
          <textarea value={prodDesc} onChange={e=>setProdDesc(e.target.value)} placeholder="Product description" className={`w-full p-4 rounded-2xl border text-[13px] h-24 ${inputCls}`} />
          <input type="file" multiple accept="image/*" onChange={(e)=>{ const files=e.target.files; if(!files) return; Array.from(files).slice(0,3).forEach((f:any)=>{ const r=new FileReader(); r.onload=()=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); const max=800; let w=img.width,h=img.height; if(w>max||h>max){ if(w>h){ h*=max/w; w=max } else { w*=max/h; h=max } } c.width=w; c.height=h; c.getContext('2d')!.drawImage(img,0,0,w,h); setImages(prev=>[...prev,c.toDataURL('image/jpeg',0.7)].slice(0,3)) }; img.src=r.result as string }; r.readAsDataURL(f) }) }} className="text-[12px]" />
          <div className="flex gap-2">{images.map((im,i)=><div key={i} className="relative"><img src={im} className="w-20 h-20 rounded-xl object-cover" /><button onClick={()=>setImages(images.filter((_,j)=>j!==i))} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-[10px]">X</button></div>)}</div>
          <button onClick={submitProduct} disabled={loading} className="w-full h-12 bg-[#5B21B6] text-white rounded-full font-bold text-[14px]">Submit for Approval</button>
        </div>
      </div>
    </div>
  )
}
