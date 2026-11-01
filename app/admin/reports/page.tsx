'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function ReportsPage(){
  const [reports,setReports]=useState<any[]>([]);
  useEffect(()=>{ supabase.from('reports').select('*, listings(title)').order('created_at',{ascending:false}).then(({data})=>{ if(data) setReports(data); }); },[]);
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-black">Reports ({reports.length})</h1>
      <div className="grid gap-3">
        {reports.map(r=>(
          <div key={r.id} className="card p-4">
            <p className="text-sm font-bold">{r.reason} — <span className="font-normal text-zinc-600">{r.listings?.title || r.listing_id}</span></p>
            <p className="text-xs text-zinc-600 mt-1">{r.description || 'No description'}</p>
            <p className="text-[11px] text-zinc-400 mt-1">{new Date(r.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
