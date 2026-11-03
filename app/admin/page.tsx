"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin(){
  const [tab,setTab]=useState<'pending'|'active'|'all'>('pending')
  const [list,setList]=useState<any[]>([])
  const load = async()=>{
    let q = supabase.from('listings').select('*').order('created_at',{ascending:false})
    if(tab==='pending') q = q.eq('status','pending')
    if(tab==='active') q = q.eq('status','approved')
    const {data}=await q; if(data) setList(data)
  }
  useEffect(()=>{ load() },[tab])
  const act = async(id:string,status:string)=>{
    await supabase.from('listings').update({status}).eq('id',id); load()
  }
  const del = async(id:string)=>{ await supabase.from('listings').delete().eq('id',id); load() }

  return (
    <div className="max-w-[1000px] mx-auto px-4 pt-6 pb-20">
      <h1 className="text-2xl font-bold">Admin • TECH-U Market</h1>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white border rounded-2xl p-4"><p className="text-xs text-gray-500">Pending</p><p className="text-xl font-bold">{list.filter(l=>l.status==='pending').length}</p></div>
        <div className="bg-white border rounded-2xl p-4"><p className="text-xs text-gray-500">Active Online</p><p className="text-xl font-bold">{list.filter(l=>l.status==='approved').length}</p></div>
        <div className="bg-white border rounded-2xl p-4"><p className="text-xs text-gray-500">Total</p><p className="text-xl font-bold">{list.length}</p></div>
      </div>

      <div className="mt-6 flex gap-2">
        {(['pending','active','all'] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 h-10 rounded-full font-semibold text-sm ${tab===t?'bg-[#5B21B6] text-white':'bg-white border'}`}>{t.toUpperCase()}</button>)}
      </div>

      <div className="mt-4 grid gap-3">
        {list.map((l:any)=>(
          <div key={l.id} className="bg-white border rounded-2xl p-4 flex gap-4 items-center">
            <div className="w-16 h-16 bg-[#F5F3FF] rounded-xl grid place-items-center">{l.emoji||'📦'}</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{l.title} • ₦{Number(l.price).toLocaleString()}</p>
              <p className="text-xs text-gray-500">{l.location} • {l.status} • 👁️ {l.views}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>act(l.id,'approved')} className="h-9 px-3 rounded-full bg-green-600 text-white text-xs font-semibold">Approve</button>
              <button onClick={()=>act(l.id,'pending')} className="h-9 px-3 rounded-full bg-yellow-400 text-[#1E1B4B] text-xs font-semibold">Reject</button>
              <button onClick={()=>del(l.id)} className="h-9 px-3 rounded-full bg-red-50 text-red-600 text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
