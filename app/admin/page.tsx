'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Tab = 'pending'|'approved'|'all'|'rejected'

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([])
  const [tab, setTab] = useState<Tab>('pending')

  const load = async () => {
    // LOAD ALL - no filter, so pending visible
    const { data } = await supabase.from('products').select('*').order('created_at',{ascending:false})
    setProducts(data||[])
  }
  useEffect(()=>{ load() }, [])

  const filtered = products.filter(p => tab==='all' ? true : p.status===tab)
  const pendingCount = products.filter(p=>p.status==='pending').length

  const updateStatus = async (id:string, status:string) => {
    await supabase.from('products').update({status}).eq('id', id)
    load()
  }
  const del = async (id:string) => {
    if(!confirm('Delete?')) return
    await supabase.from('products').delete().eq('id',id)
    load()
  }

  return (
    <div className="max-w-[960px] mx-auto p-4 md:p-6">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-[24px] font-black">ADMIN / {pendingCount} PENDING</h1>
        <span className="text-[11px] tracking-widest uppercase px-2 py-1 bg-black text-white">{pendingCount} awaiting</span>
      </div>

      <div className="flex gap-1 mb-6 border-b border-black/10 pb-1">
        {(['pending','approved','all','rejected'] as Tab[]).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`h-9 px-4 text-[12px] font-bold uppercase tracking-widest border ${tab===t ? 'bg-black text-white border-black' : 'bg-white border-black/10'}`}>
            {t} {t==='pending' ? `(${pendingCount})` : `(${products.filter(p=> tab==='all' ? true : p.status===t).length})`}
          </button>
        ))}
      </div>

      <div className="grid gap-[1px] bg-black/10 border border-black/10">
        {filtered.map(p=>(
          <div key={p.id} className="bg-white p-4 flex gap-4">
            <div className="w-16 h-16 bg-zinc-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[14px] leading-tight truncate">{p.title}</div>
              <div className="text-[12px] text-black/60">₦{p.price} • {p.status} • {p.category}</div>
              <div className="flex gap-2 mt-3">
                {p.status!=='approved' && <button onClick={()=>updateStatus(p.id,'approved')} className="h-7 px-3 bg-black text-white text-[11px] font-bold uppercase">Approve</button>}
                {p.status!=='rejected' && <button onClick={()=>updateStatus(p.id,'rejected')} className="h-7 px-3 border border-black/20 text-[11px] font-bold uppercase">Reject</button>}
                <button onClick={()=>del(p.id)} className="h-7 px-3 text-[11px] font-bold uppercase text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div className="bg-white p-12 text-center text-[13px] text-black/40">No items in {tab}</div>}
      </div>

      <div className="mt-8 p-4 bg-[#FFF8E1] border border-black/10 text-[12px] leading-relaxed">
        <strong>SQL FIX if pending not visible:</strong> Run in Supabase SQL Editor: <code>ALTER TABLE products DISABLE ROW LEVEL SECURITY;</code> 
        <br/>or create policy: <code>CREATE POLICY "Allow all" ON products FOR ALL USING (true) WITH CHECK (true);</code>
      </div>
    </div>
  )
}

