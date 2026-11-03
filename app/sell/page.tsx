'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

const CATS=['Electronics','Phones','Fashion','Books','Home','Vehicles','Sports','More']
const CONDS=['New','Like New','Good','Fair']

export default function Sell(){
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{
    const check=()=>{
      const saved=localStorage.getItem('techu-theme')
      setIsDark(document.documentElement.classList.contains('dark') || saved==='dark')
    }
    check()
    const obs=new MutationObserver(check)
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
    window.addEventListener('theme-change',check as any)
    return ()=>{obs.disconnect(); window.removeEventListener('theme-change',check as any)}
  },[])
  const [title,setTitle]=useState('')
  const [price,setPrice]=useState('')
  const [category,setCategory]=useState('')
  const [condition,setCondition]=useState('')
  const [description,setDescription]=useState('')
  const [whatsapp,setWhatsapp]=useState('')
  const [call,setCall]=useState('')
  const [location,setLocation]=useState('')
  const [images,setImages]=useState<string[]>([])
  const [previews,setPreviews]=useState<string[]>([])
  const [loading,setLoading]=useState(false)
  const [msg,setMsg]=useState('')

  const inputBase=`w-full rounded-2xl border h-12 px-4 text-[14px] outline-none focus:ring-2 focus:ring-[#5B21B6] ${isDark?'bg-[#1A1A1E] border-[#2A2A2E] text-white placeholder:text-gray-500':'bg-white border-gray-200 text-black placeholder:text-gray-400'}`
  const textAreaBase=`w-full rounded-2xl border p-4 text-[14px] outline-none focus:ring-2 focus:ring-[#5B21B6] min-h-[110px] ${isDark?'bg-[#1A1A1E] border-[#2A2A2E] text-white placeholder:text-gray-500':'bg-white border-gray-200 text-black placeholder:text-gray-400'}`
  const labelBase=`text-[14px] font-bold ${isDark?'text-white':'text-[#1E1B4B]'}`
  const hintBase=`text-[12px] ${isDark?'text-gray-400':'text-gray-500'}`

  const handleImages=async(e:any)=>{
    const files=Array.from(e.target.files||[]).slice(0,3-images.length) as File[]
    for(const file of files){
      const compressed=await new Promise<string>((res)=>{
        const img=new Image()
        const url=URL.createObjectURL(file)
        img.onload=()=>{
          const canvas=document.createElement('canvas')
          const max=800
          let w=img.width, h=img.height
          if(w>h){ if(w>max){h*=max/w; w=max} } else { if(h>max){w*=max/h; h=max} }
          canvas.width=w; canvas.height=h
          canvas.getContext('2d')?.drawImage(img,0,0,w,h)
          res(canvas.toDataURL('image/jpeg',0.7))
        }
        img.src=url
      })
      setImages(p=>[...p,compressed])
      setPreviews(p=>[...p,compressed])
    }
  }

  const submit=async()=>{
    if(!title||!price||!description){ setMsg('Fill Title, Price, Description'); return }
    setLoading(true)
    try{
      let wp=whatsapp.replace(/\D/g,'')
      if(wp.startsWith('0')) wp='234'+wp.slice(1)
      if(!wp.startsWith('234')) wp='234'+wp
      const {error}=await supabase.from('products').insert([{
        title, price, category, condition, description,
        whatsapp_number:wp, call_number:call, location, campus_location:location,
        images, image_url:images[0]||'', status:'pending', views:0
      }])
      if(error) throw error
      setMsg('✅ Submitted! Admin will approve soon.')
      setTitle(''); setPrice(''); setDescription(''); setImages([]); setPreviews([])
    }catch(err:any){ setMsg('Error: '+err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className={`min-h-screen pb-24 ${isDark?'bg-[#0F0F12]':'bg-[#F8F7FF]'}`}>
      <div className="max-w-[600px] mx-auto px-4 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/" className={`${isDark?'text-gray-400':'text-gray-500'} text-[13px]`}>← Back</Link>
        </div>
        <h1 className={`text-[20px] font-extrabold ${isDark?'text-white':'text-[#1E1B4B]'}`}>Sell an Item</h1>
        <p className={`${hintBase} mt-1`}>Large touch-friendly • 3 images max • WhatsApp Bridge</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className={labelBase}>Title *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Used iPhone 11, Hostel chair" className={`${inputBase} mt-2`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelBase}>Price ₦ *</label>
              <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="32000" type="number" className={`${inputBase} mt-2`} />
            </div>
            <div>
              <label className={labelBase}>Category</label>
              <select value={category} onChange={e=>setCategory(e.target.value)} className={`${inputBase} mt-2`}>
                <option value="">Select</option>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelBase}>Condition</label>
            <select value={condition} onChange={e=>setCondition(e.target.value)} className={`${inputBase} mt-2`}>
              <option value="">Select condition</option>
              {CONDS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={labelBase}>Description *</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe condition, location, reason for selling..." className={`${textAreaBase} mt-2`} />
          </div>

          <div>
            <label className={labelBase}>Images (3 max, auto compress 800px)</label>
            <div className="mt-2 flex items-center gap-3">
              <label className={`px-4 h-10 rounded-xl flex items-center text-[13px] font-bold cursor-pointer ${isDark?'bg-[#2A2A2E] text-white':'bg-gray-800 text-white'}`}>Choose files
                <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
              </label>
              <span className={hintBase}>{previews.length}/3</span>
            </div>
            {previews.length>0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {previews.map((src,i)=>(
                  <div key={i} className="relative h-24 rounded-xl overflow-hidden border">
                    <img src={src} className="w-full h-full object-cover" />
                    <button onClick={()=>{setImages(p=>p.filter((_,j)=>j!==i)); setPreviews(p=>p.filter((_,j)=>j!==i))}} className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white rounded-full text-[12px]">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={labelBase}>WhatsApp Number</label>
              <input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="08100145906" className={`${inputBase} mt-2`} />
            </div>
            <div>
              <label className={labelBase}>Call Number</label>
              <input value={call} onChange={e=>setCall(e.target.value)} placeholder="08100145906" className={`${inputBase} mt-2`} />
            </div>
            <div>
              <label className={labelBase}>Campus Location</label>
              <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. North Hostel, Engineering block" className={`${inputBase} mt-2`} />
            </div>
          </div>

          {msg && <div className={`p-3 rounded-xl text-[13px] ${msg.startsWith('✅')?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{msg}</div>}

          <button onClick={submit} disabled={loading} className="w-full h-12 bg-[#5B21B6] text-white rounded-full font-bold text-[14px] disabled:opacity-50">{loading?'Publishing...':'Publish Listing'}</button>
        </div>
      </div>
    </div>
  )
}
