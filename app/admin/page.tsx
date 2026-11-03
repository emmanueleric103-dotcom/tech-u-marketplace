'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Admin(){
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
  const [products,setProducts]=useState<any[]>([])
  const [filter,setFilter]=useState('all')
  const [search,setSearch]=useState('')
  const [loading,setLoading]=useState(true)

  const load=async()=>{
    setLoading(true)
    const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false})
    if(data) setProducts(data)
    setLoading(false)
  }
  useEffect(()=>{load()},[])

  const updateStatus=async(id:string,status:string)=>{
    await supabase.from('products').update({status}).eq('id',id)
    load()
  }
  const del=async(id:string)=>{
    if(!confirm('Delete this listing?')) return
    await supabase.from('products').delete().eq('id',id)
    load()
  }

  const pending=products.filter(p=>!p.status || p.status==='pending').length
  const active=products.filter(p=>p.status==='approved').length
  const total=products.length
  const filtered=products.filter(p=>{
    const matchF=filter==='all' || p.status===filter || (filter==='pending' && (!p.status || p.status==='pending'))
    const matchS=!search || p.title?.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  const cardBg=isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-white border-gray-100'
  const textMain=isDark?'text-white':'text-[#1E1B4B]'
  const textMuted=isDark?'text-gray-400':'text-gray-500'

  return (
    <div className={`min-h-screen pb-24 ${isDark?'bg-[#0F0F12]':'bg-[#F5F5F7]'} p-4`}>
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className={`text-[20px] font-extrabold ${textMain}`}>Admin Dashboard</h1>
          <Link href="/" className={`text-[13px] ${textMuted}`}>← Home</Link>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className={`${cardBg} border rounded-2xl p-4`}>
            <div className={`text-[12px] ${textMuted}`}>PENDING</div>
            <div className={`text-[22px] font-extrabold mt-1 ${textMain}`}>{pending}</div>
          </div>
          <div className={`${cardBg} border rounded-2xl p-4`}>
            <div className={`text-[12px] ${textMuted}`}>ACTIVE ONLINE</div>
            <div className={`text-[22px] font-extrabold mt-1 ${textMain} flex items-center gap-1`}>{active} <span className="text-green-500 text-[14px]">🟢</span></div>
          </div>
          <div className={`${cardBg} border rounded-2xl p-4`}>
            <div className={`text-[12px] ${textMuted}`}>TOTAL</div>
            <div className={`text-[22px] font-extrabold mt-1 ${textMain}`}>{total}</div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title..." className={`flex-1 h-11 rounded-full px-4 text-[13px] border outline-none ${isDark?'bg-[#1A1A1E] border-[#2A2A2E] text-white placeholder:text-gray-500':'bg-white border-gray-200 text-black placeholder:text-gray-400'}`} />
          <button onClick={()=>setFilter('pending')} className={`px-5 h-11 rounded-full text-[13px] font-bold ${filter==='pending'?'bg-[#5B21B6] text-white': isDark?'bg-[#1A1A1E] text-white border border-[#2A2A2E]':'bg-white text-black border'}`}>PENDING</button>
          <button onClick={()=>setFilter('approved')} className={`px-5 h-11 rounded-full text-[13px] font-bold ${filter==='approved'?'bg-[#5B21B6] text-white': isDark?'bg-[#1A1A1E] text-white border border-[#2A2A2E]':'bg-white text-black border'}`}>ACTIVE</button>
          <button onClick={()=>setFilter('all')} className={`px-6 h-11 rounded-full text-[13px] font-bold ${filter==='all'?'bg-[#5B21B6] text-white': isDark?'bg-[#1A1A1E] text-white border border-[#2A2A2E]':'bg-white text-black border'}`}>ALL</button>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? <div className={`${textMuted} text-[13px]`}>Loading...</div> : filtered.map((p:any)=>{
            const imgSrc=p.image_url || p.images?.[0] || (Array.isArray(p.images)&&p.images[0]) || 'https://via.placeholder.com/200'
            return (
              <div key={p.id} className={`${cardBg} border rounded-2xl p-3 flex gap-3`}>
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={imgSrc} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[14px] font-bold truncate ${textMain}`}>{p.title || 'Untitled'}</div>
                  <div className="text-[14px] font-bold text-[#8B5CF6]">₦{p.price || '0'}</div>
                  <div className={`text-[11px] ${textMuted} mt-1 truncate`}>{p.category} • {p.campus_location || p.location || 'Campus'} • {p.condition || 'Used'}</div>
                  <div className={`text-[11px] ${textMuted} mt-1`}>status: {p.status || 'pending'}</div>
                  {p.whatsapp_number && <a href={`https://wa.me/${p.whatsapp_number}`} target="_blank" className="text-[11px] text-green-600 font-bold">WhatsApp: {p.whatsapp_number}</a>}
                  <div className="mt-2 flex gap-2">
                    {p.status!=='approved' && <button onClick={()=>updateStatus(p.id,'approved')} className="px-4 h-8 bg-[#5B21B6] text-white rounded-full text-[12px] font-bold">Approve</button>}
                    {p.status==='approved' && <button onClick={()=>updateStatus(p.id,'pending')} className={`px-4 h-8 rounded-full text-[12px] font-bold border ${isDark?'border-[#2A2A2E] text-white':'border-gray-200 text-black'}`}>Unapprove</button>}
                    <button onClick={()=>del(p.id)} className="px-3 h-8 text-red-500 text-[12px] font-bold">Delete</button>
                  </div>
                </div>
              </div>
            )
          })}
          {!loading && filtered.length===0 && <div className={`${textMuted} text-center py-10 text-[13px]`}>No listings in {filter}</div>}
        </div>
      </div>
    </div>
  )
}
