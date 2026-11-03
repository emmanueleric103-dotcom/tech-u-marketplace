'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

function normalizeWA(num:string){
  let s = num.replace(/[^0-9]/g,'')
  if(s.startsWith('0')) s = '234'+s.slice(1)
  if(s.startsWith('+')) s = s.slice(1)
  if(!s.startsWith('234') && s.length===10) s = '234'+s
  return s
}

export default function SellPage(){
  const router = useRouter()
  const [title,setTitle]=useState('')
  const [price,setPrice]=useState('')
  const [category,setCategory]=useState('Books')
  const [condition,setCondition]=useState('New')
  const [description,setDescription]=useState('')
  const [wa,setWa]=useState('')
  const [callNum,setCallNum]=useState('')
  const [campus,setCampus]=useState('Academic Block')
  const [images,setImages]=useState<string[]>([])
  const [loading,setLoading]=useState(false)

  const removeImage = (idx:number)=>{
    setImages(prev=>prev.filter((_,i)=>i!==idx))
  }

  const handleFiles = async (e:any)=>{
    const files = Array.from(e.target.files || []) as File[]
    const remaining = 3 - images.length
    const toProcess = files.slice(0, remaining)
    for(const file of toProcess){
      const compressed = await new Promise<string>((resolve)=>{
        const img = new Image()
        const reader = new FileReader()
        reader.onload = (ev)=>{
          img.onload = ()=>{
            const canvas = document.createElement('canvas')
            const max = 800
            let w = img.width, h = img.height
            if(w>h){ if(w>max){ h = h*max/w; w=max } } else { if(h>max){ w = w*max/h; h=max } }
            canvas.width=w; canvas.height=h
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(img,0,0,w,h)
            resolve(canvas.toDataURL('image/jpeg',0.7))
          }
          img.src = ev.target?.result as string
        }
        reader.readAsDataURL(file)
      })
      setImages(prev=>[...prev, compressed])
    }
    e.target.value=''
  }

  const handlePublish = async ()=>{
    if(!title.trim()){ alert('Title required'); return }
    if(!price.trim()){ alert('Price required'); return }
    if(!description.trim()){ alert('Description required'); return }
    if(!wa.trim()){ alert('WhatsApp required'); return }
    if(images.length===0){ alert('Add at least 1 image'); return }

    setLoading(true)
    try{
      const waNorm = normalizeWA(wa)
      const callNorm = callNum ? normalizeWA(callNum) : waNorm

      const payloadFull:any = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
        category,
        condition,
        location: campus,
        campus_location: campus,
        whatsapp_number: waNorm,
        call_number: callNorm,
        images,
        image_url: images[0],
        status: 'pending'
      }

      let { error } = await supabase.from('products').insert([payloadFull])

      if(error){
        console.log('Full insert failed, trying minimal:', error.message)
        const payloadMin:any = {
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price) || 0,
          category,
          whatsapp_number: waNorm,
          image_url: images[0],
          status: 'pending'
        }
        const res2 = await supabase.from('products').insert([payloadMin])
        if(res2.error) throw res2.error
      }

      alert('✅ Listed! Waiting for admin approval.')
      router.push('/')
    }catch(err:any){
      console.error(err)
      alert('❌ Publish failed: '+(err?.message||'Unknown error'))
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF] pb-24">
      <div className="max-w-[600px] mx-auto px-4 pt-6">
        <h1 className="text-[20px] font-bold text-[#1E1B4B]">Sell an Item</h1>
        <p className="text-[13px] text-gray-500 mt-1">Large touch-friendly • 3 images max • WhatsApp Bridge</p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-[#1E1B4B]">Title *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-1.5 h-12 px-4 bg-white rounded-xl border border-gray-200 text-[15px] outline-none focus:border-[#5B21B6]" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[13px] font-semibold text-[#1E1B4B]">Price ₦ *</label>
              <input value={price} onChange={e=>setPrice(e.target.value)} type="number" className="w-full mt-1.5 h-12 px-4 bg-white rounded-xl border border-gray-200 text-[15px] outline-none focus:border-[#5B21B6]" />
            </div>
            <div className="flex-1">
              <label className="text-[13px] font-semibold text-[#1E1B4B]">Category</label>
              <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full mt-1.5 h-12 px-4 bg-white rounded-xl border border-gray-200 text-[15px] outline-none">
                <option>Books</option><option>Electronics</option><option>Phones</option><option>Fashion</option><option>Home</option><option>Vehicles</option><option>Sports</option><option>Others</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1E1B4B]">Condition</label>
            <select value={condition} onChange={e=>setCondition(e.target.value)} className="w-full mt-1.5 h-12 px-4 bg-white rounded-xl border border-gray-200 text-[15px] outline-none">
              <option>New</option><option>Like New</option><option>Fair</option><option>Used</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1E1B4B]">Description *</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full mt-1.5 min-h-[90px] p-4 bg-white rounded-xl border border-gray-200 text-[15px] outline-none focus:border-[#5B21B6] resize-y" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1E1B4B]">Images (3 max, auto compress 800px)</label>
            <div className="mt-1.5 flex items-center gap-2">
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="text-[13px]" />
              <span className="text-[12px] text-gray-500">{images.length}/3</span>
            </div>
            {images.length>0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {images.map((src,idx)=>(
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={()=>removeImage(idx)} type="button" className="absolute -top-1 -right-1 w-6 h-6 bg-black text-white rounded-full text-[12px] flex items-center justify-center">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1E1B4B]">WhatsApp Number * (08100145906 → 2348100145906)</label>
            <input value={wa} onChange={e=>setWa(e.target.value)} className="w-full mt-1.5 h-12 px-4 bg-white rounded-xl border border-gray-200 text-[15px] outline-none focus:border-[#5B21B6]" placeholder="08100145906" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[13px] font-semibold text-[#1E1B4B]">Call Number</label>
              <input value={callNum} onChange={e=>setCallNum(e.target.value)} className="w-full mt-1.5 h-12 px-4 bg-white rounded-xl border border-gray-200 text-[15px] outline-none focus:border-[#5B21B6]" placeholder="08100145906" />
            </div>
            <div className="flex-1">
              <label className="text-[13px] font-semibold text-[#1E1B4B]">Campus Location</label>
              <select value={campus} onChange={e=>setCampus(e.target.value)} className="w-full mt-1.5 h-12 px-4 bg-white rounded-xl border border-gray-200 text-[15px] outline-none">
                <option>Academic Block</option><option>Hostel A</option><option>Hostel B</option><option>Hostel C</option><option>Main Gate</option><option>Library</option><option>Others</option>
              </select>
            </div>
          </div>
          <button onClick={handlePublish} disabled={loading} className="w-full h-14 bg-[#5B21B6] text-white rounded-full font-bold text-[15px] mt-2 disabled:opacity-50">
            {loading?'Publishing...':'Publish Listing'}
          </button>
          <p className="text-[11px] text-center text-gray-500">By publishing, you agree to campus safety rules. Buyers contact you via WhatsApp Bridge.</p>
        </div>
      </div>
    </div>
  )
}
