'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
export default function RejectedPage(){
  const [items,setItems]=useState<any[]>([]);
  useEffect(()=>{ supabase.from('listings').select('*').eq('status','rejected').order('created_at',{ascending:false}).then(({data})=>{ if(data) setItems(data); }); },[]);
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-black">Rejected ({items.length})</h1>
      {items.map(it=>(
        <div key={it.id} className="card p-4 flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={it.image_urls?.[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
          <div><p className="font-bold text-sm">{it.title}</p><p className="text-xs text-zinc-500">{it.category}</p></div>
        </div>
      ))}
    </div>
  );
}
