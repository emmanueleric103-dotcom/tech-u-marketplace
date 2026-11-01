'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const CATS = ['All','Electronics','Fashion','Books','Hostel Essentials','Gadgets','Furniture','Others'];

export default function BrowsePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [cond, setCond] = useState('All');
  const [showSold, setShowSold] = useState(false);
  const [sort, setSort] = useState('newest');

  useEffect(()=>{ fetchData(); }, [cat, cond, sort, showSold]);

  async function fetchData() {
    setLoading(true);
    let query = supabase.from('listings').select('*').order('created_at', { ascending: sort !== 'newest' });
    if (!showSold) query = query.neq('status','sold');
    else query = query.in('status',['approved','sold']);
    if (cat !== 'All') query = query.eq('category', cat);
    if (cond !== 'All') query = query.eq('condition', cond);
    if (!showSold) query = query.eq('status','approved');
    const { data } = await query.limit(100);
    if (data) setItems(data);
    setLoading(false);
  }

  const filtered = items.filter(it=>{
    if (q && !it.title.toLowerCase().includes(q.toLowerCase()) && !it.description?.toLowerCase().includes(q.toLowerCase())) return false;
    if (min && Number(it.price) < Number(min)) return false;
    if (max && Number(it.price) > Number(max)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-black tracking-tight">Browse Products</h1>

      <div className="card p-4 grid sm:grid-cols-12 gap-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Keyword" className="sm:col-span-4 h-11 rounded-full border border-zinc-200 px-4 outline-none focus:ring-2 focus:ring-brand-600" />
        <select value={cat} onChange={e=>setCat(e.target.value)} className="sm:col-span-2 h-11 rounded-full border px-3">
          {CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <select value={cond} onChange={e=>setCond(e.target.value)} className="sm:col-span-2 h-11 rounded-full border px-3">
          <option>All</option><option>New</option><option>Used</option>
        </select>
        <input type="number" value={min} onChange={e=>setMin(e.target.value)} placeholder="Min ₦" className="h-11 rounded-full border px-4" />
        <input type="number" value={max} onChange={e=>setMax(e.target.value)} placeholder="Max ₦" className="h-11 rounded-full border px-4" />
        <div className="sm:col-span-12 flex gap-2 items-center text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={showSold} onChange={e=>setShowSold(e.target.checked)} /> Show sold items</label>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="ml-auto h-9 rounded-full border px-3 text-sm">
            <option value="newest">Newest</option><option value="oldest">Oldest</option>
          </select>
          <button onClick={fetchData} className="h-9 px-4 rounded-full bg-zinc-900 text-white font-semibold">Apply</button>
        </div>
      </div>

      {loading ? <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{[...Array(8)].map((_,i)=><div key={i} className="card h-[220px] animate-pulse" />)}</div> :
        filtered.length===0 ? <div className="card p-10 text-center text-zinc-500">No products found. Try different filters.</div> :
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map(it=>(
            <Link key={it.id} href={`/products/${it.id}`} className="card overflow-hidden group relative">
              <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image_urls?.[0] || 'https://via.placeholder.com/400'} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                {it.status==='sold' && <span className="absolute top-2 right-2 bg-zinc-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">SOLD</span>}
                <span className="absolute top-2 left-2 text-[11px] font-bold bg-white/90 px-2.5 py-1 rounded-full">{it.condition}</span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-[14px] line-clamp-2 leading-tight">{it.title}</p>
                <p className="font-black mt-1">₦{Number(it.price).toLocaleString()}</p>
                <p className="text-[11px] text-zinc-500">{it.category} • {new Date(it.created_at).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      }
    </div>
  );
}
