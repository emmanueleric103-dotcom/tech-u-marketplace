"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Admin(){
  const [items,setItems]=useState<any[]>([])
  useEffect(()=>{ if(localStorage.getItem('admin')!=='yes') location.href='/admin/login'; supabase.from('products').select('*').eq('status','pending').then(r=>setItems(r.data||[])) },[])
  const approve = async (id:string)=>{ await supabase.from('products').update({status:'approved'}).eq('id',id); setItems(items.filter(i=>i.id!==id)) }
  const reject = async (id:string)=>{ await supabase.from('products').delete().eq('id',id); setItems(items.filter(i=>i.id!==id)) }
  return <main className="max-w-6xl mx-auto px-4 py-8"><h1 className="text-3xl font-black">Pending Approval ({items.length})</h1><div className="mt-6 grid md:grid-cols-3 gap-4">{items.map(p=><div key={p.id} className="border rounded-2xl overflow-hidden"><img src={p.image_url} className="h-48 w-full object-cover" /><div className="p-4"><div className="font-bold">{p.title}</div><div className="text-sm opacity-60">{p.seller_name} — ₦{p.price}</div><div className="mt-3 flex gap-2"><button onClick={()=>approve(p.id)} className="flex-1 h-9 rounded-full bg-green-600 text-white font-bold">Approve</button><button onClick={()=>reject(p.id)} className="flex-1 h-9 rounded-full bg-red-600 text-white font-bold">Reject</button></div></div></div>)}</div></main>
}
