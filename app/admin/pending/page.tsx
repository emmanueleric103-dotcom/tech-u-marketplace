'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function PendingPage(){
  const [items,setItems]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  async function load(){
    setLoading(true);
    const { data } = await supabase.from('listings').select('*').eq('status','pending').order('created_at',{ascending:false});
    if (data) setItems(data);
    setLoading(false);
  }
  useEffect(()=>{load();},[]);

  async function updateStatus(id:string, status:string){
    await supabase.from('listings').update({ status }).eq('id', id);
    load();
  }
  async function del(id:string){ if(confirm('Delete?')){ await supabase.from('listings').delete().eq('id',id); load(); } }

  if (loading) return <div className="card p-10 animate-pulse">Loading pending...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-black">Pending Listings ({items.length})</h1>
      {items.length===0 && <div className="card p-10 text-center text-zinc-500">No pending listings</div>}
      <div className="grid gap-3">
        {items.map(it=>(
          <div key={it.id} className="card p-4 flex gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image_urls?.[0]} alt="" className="w-24 h-24 rounded-xl object-cover bg-zinc-100" />
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{it.title} — ₦{Number(it.price).toLocaleString()}</p>
              <p className="text-xs text-zinc-500">{it.category} • {it.condition} • {it.whatsapp}</p>
              <p className="text-xs mt-1 line-clamp-2 text-zinc-700">{it.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={()=>updateStatus(it.id,'approved')} className="h-8 px-4 rounded-full bg-brand-600 text-white text-xs font-bold">Approve</button>
                <button onClick={()=>updateStatus(it.id,'rejected')} className="h-8 px-4 rounded-full bg-zinc-900 text-white text-xs font-bold">Reject</button>
                <button onClick={()=>del(it.id)} className="h-8 px-4 rounded-full bg-white border text-xs font-bold">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
