'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
export default function Admin(){
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{
    const check=()=>{const s=localStorage.getItem('techu-theme'); setIsDark(document.documentElement.classList.contains('dark')||s==='dark')}
    check()
    const obs=new MutationObserver(check)
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
    window.addEventListener('theme-change',check as any)
    return ()=>{obs.disconnect(); window.removeEventListener('theme-change',check as any)}
  },[])
  const [products,setProducts]=useState<any[]>([])
  const [filter,setFilter]=useState<'pending'|'approved'>('pending')
  const [search,setSearch]=useState('')
  const [loading,setLoading]=useState(true)
  const load=async()=>{
    const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false})
    if(data) setProducts(data)
    setLoading(false)
  }
  useEffect(()=>{load()},[])
  const pending=products.filter(p=>p.status==='pending').length
  const active=products.filter(p=>p.status==='approved'||!p.status).length
  const filtered=products.filter(p=>{
    const isF=filter==='pending'?p.status==='pending':(p.status==='approved'||!p.status)
    const s=search? (p.title?.toLowerCase().includes(search.toLowerCase())||String(p.whatsapp_number).includes(search)):true
    return isF&&s
  })
  const approve=async(id:string)=>{await supabase.from('products').update({status:'approved'}).eq('id',id); load()}
  const reject=async(id:string)=>{await supabase.from('products').update({status:'pending'}).eq('id',id); load()}
  const del=async(id:string)=>{if(confirm('Delete?')){await supabase.from('products').delete().eq('id',id); load()}}
  const card=isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-white border-gray-100'
  const textMain=isDark?'text-white':'text-[#1E1B4B]'
  const textMuted=isDark?'text-gray-400':'text-gray-500'
  if(loading) return <div className={`p-8 text-center min-h-screen ${isDark?'bg-[#0F0F12] text-white':'bg-white'}`}>Loading admin...</div>
  return (
    <div className={`min-h-screen pb-28 p-4 max-w-[900px] mx-auto ${isDark?'bg-[#0F0F12]':'bg-white'}`}>
      <h1 className={`text-[20px] font-bold ${textMain}`}>Admin Dashboard</h1>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className={`${card} border rounded-2xl p-4`}><div className={`text-[12px] ${textMuted}`}>Pending</div><div className={`text-[22px] font-bold ${textMain}`}>{pending}</div></div>
        <div className={`${card} border rounded-2xl p-4`}><div className={`text-[12px] ${textMuted}`}>Active</div><div className={`text-[22px] font-bold ${textMain}`}>{active}</div></div>
        <div className={`${card} border rounded-2xl p-4`}><div className={`text-[12px] ${textMuted}`}>Total</div><div className={`text-[22px] font-bold ${textMain}`}>{products.length}</div></div>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={()=>setFilter('pending')} className={`h-9 px-4 rounded-full text-[13px] font-bold ${filter==='pending'?'bg-[#5B21B6] text-white': isDark?'bg-[#1A1A1E] text-white border border-[#2A2A2E]':'bg-gray-100 text-black'}`}>Pending ({pending})</button>
        <button onClick={()=>setFilter('approved')} className={`h-9 px-4 rounded-full text-[13px] font-bold ${filter==='approved'?'bg-[#5B21B6] text-white': isDark?'bg-[#1A1A1E] text-white border border-[#2A2A2E]':'bg-gray-100 text-black'}`}>Active ({active})</button>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className={`flex-1 h-9 px-4 rounded-full text-[13px] outline-none border ${isDark?'bg-[#1A1A1E] border-[#2A2A2E] text-white':'bg-white border-gray-200 text-black'}`} />
      </div>
      <div className="mt-4 grid gap-3">
        {filtered.map((p:any)=>{
          const img=p.image_url||p.images?.[0]||'https://via.placeholder.com/300'
          const wa=String(p.whatsapp_number||'').replace(/\D/g,'')
          return (
            <div key={p.id} className={`${card} border rounded-2xl p-3 flex gap-3`}>
              <img src={img} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] font-bold truncate ${textMain}`}>{p.title} - ₦{p.price}</div>
                <div className={`text-[11px] ${textMuted}`}>{p.category} • {p.status||'approved'} • WA:{wa.slice(-4)}</div>
                <div className="mt-2 flex gap-2">
                  {p.status==='pending'?<button onClick={()=>approve(p.id)} className="h-8 px-3 bg-[#25D366] text-white rounded-full text-[11px] font-bold">Approve</button>:<button onClick={()=>reject(p.id)} className="h-8 px-3 bg-yellow-500 text-white rounded-full text-[11px] font-bold">Unapprove</button>}
                  <button onClick={()=>del(p.id)} className="h-8 px-3 bg-red-500 text-white rounded-full text-[11px] font-bold">Delete</button>
                  <a href={`https://wa.me/${wa}`} target="_blank" className={`h-8 px-3 rounded-full text-[11px] font-bold flex items-center ${isDark?'bg-[#2A2A2E] text-white':'bg-gray-100 text-black'}`}>WA</a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
