'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function CategoriesAdmin(){
  const [cats,setCats]=useState<any[]>([]);
  const [name,setName]=useState('');
  useEffect(()=>{ load(); },[]);
  async function load(){ const { data } = await supabase.from('categories').select('*').order('name'); if(data) setCats(data); }
  async function add(){ if(!name) return; const slug = name.toLowerCase().replace(/[^a-z0-9]+/g,'-'); await supabase.from('categories').insert({ name, slug }); setName(''); load(); }
  async function del(id:string){ if(confirm('Delete category?')){ await supabase.from('categories').delete().eq('id',id); load(); } }
  return (
    <div className="max-w-[560px] space-y-4">
      <h1 className="text-[22px] font-black">Manage Categories</h1>
      <div className="card p-4 flex gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="New category name" className="flex-1 h-11 rounded-full border px-4" />
        <button onClick={add} className="h-11 px-5 rounded-full bg-zinc-900 text-white font-bold text-sm">Add</button>
      </div>
      <div className="grid gap-2">
        {cats.map(c=>(
          <div key={c.id} className="card p-3 flex justify-between items-center"><span className="text-sm font-semibold">{c.name} <span className="text-zinc-400">({c.slug})</span></span><button onClick={()=>del(c.id)} className="text-xs font-bold px-3 py-1 rounded-full border">Delete</button></div>
        ))}
      </div>
    </div>
  );
}
