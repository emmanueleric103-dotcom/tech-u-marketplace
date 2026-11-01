'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function ApprovedPage(){
  const [items,setItems]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  async function load(){ setLoading(true); const { data } = await supabase.from('listings').select('*').in('status',['approved','sold']).order('created_at',{ascending:false}); if(data) setItems(data); setLoading(false); }
  useEffect(()=>{load();},[]);
  async function markSold(id:string, to:string){ await supabase.from('listings').update({ status: to }).eq('id',id); load(); }
  async function del(id:string){ if(confirm('Delete?')){ await supabase.from('listings').delete().eq('id',id); load(); } }

  if (loading) return <div className="card p-10 animate-pulse">Loading...</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-black">Approved & Sold ({items.length})</h1>
      <div className="grid gap-3">
        {items.map(it=>(
          <div key={it.id} className="card p-4 flex gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image_urls?.[0]} alt="" className="w-20 h-20 rounded-xl object-cover bg-zinc-100" />
            <div className="flex-1">
              <p className="font-bold truncate">{it.title} — ₦{Number(it.price).toLocaleString()} {it.status==='sold'&&<span className="ml-2 text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded-full">SOLD</span>}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {it.status==='approved' ? <button onClick={()=>markSold(it.id,'sold')} className="h-8 px-3 rounded-full bg-zinc-900 text-white text-xs font-bold">Mark as Sold</button> : <button onClick={()=>markSold(it.id,'approved')} className="h-8 px-3 rounded-full bg-brand-600 text-white text-xs font-bold">Mark Available</button>}
                <button onClick={()=>del(it.id)} className="h-8 px-3 rounded-full border bg-white text-xs font-bold">Delete</button>
                <a href={`/products/${it.id}`} target="_blank" className="h-8 px-3 rounded-full border bg-white text-xs font-bold grid place-items-center">View</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
