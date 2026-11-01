'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

function normalizeWA(input: string) {
  if (!input) return ''
  let n = input.replace(/[^\d+]/g, '').trim()
  if (n.startsWith('+')) n = n.slice(1)
  if (n.startsWith('0')) return '234' + n.slice(1)
  if (n.startsWith('234')) return n
  if (n.length === 10) return '234' + n
  return n
}

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([])
  const [tab, setTab] = useState<'active'|'pending'|'all'>('active')
  const [search, setSearch] = useState('')

  useEffect(()=>{ fetchAll() },[])
  const fetchAll = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at',{ascending:false})
    setProducts(data||[])
  }

  const total = products.length
  const active = products.filter(p=>p.status==='active').length
  const pending = products.filter(p=>p.status==='pending').length
  const views = products.reduce((s,p)=>s+(p.views||0),0)

  const filtered = products.filter(p=>{
    if(tab==='active' && p.status!=='active') return false
    if(tab==='pending' && p.status!=='pending') return false
    if(search && !`${p.title} ${p.seller_name} ${p.phone} ${p.whatsapp}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const approve = async (id:string)=>{ await supabase.from('products').update({status:'active'}).eq('id',id); fetchAll() }
  const reject = async (id:string)=>{ await supabase.from('products').update({status:'rejected'}).eq('id',id); fetchAll() }
  const del = async (id:string)=>{ if(confirm('Delete?')){ await supabase.from('products').delete().eq('id',id); fetchAll() } }

  return (
    <div className="min-h-screen bg-[#f7f8f5] dark:bg-[#080a08] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-[32px] font-black">Admin - Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-[#151a15] rounded-[20px] p-5 shadow-sm border"><p className="text-[11px] font-bold opacity-50 uppercase">Total</p><p className="text-[28px] font-black mt-1">{total}</p></div>
          <div className="bg-white dark:bg-[#151a15] rounded-[20px] p-5 shadow-sm border border-green-200"><p className="text-[11px] font-bold text-green-600 uppercase">Active Online</p><p className="text-[28px] font-black mt-1 text-green-600">{active}</p></div>
          <div className="bg-white dark:bg-[#151a15] rounded-[20px] p-5 shadow-sm border border-yellow-200"><p className="text-[11px] font-bold text-yellow-600 uppercase">Pending</p><p className="text-[28px] font-black mt-1 text-yellow-600">{pending}</p></div>
          <div className="bg-white dark:bg-[#151a15] rounded-[20px] p-5 shadow-sm border"><p className="text-[11px] font-bold opacity-50 uppercase">Total Views</p><p className="text-[28px] font-black mt-1">{views}</p></div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 items-center">
          <div className="flex bg-white dark:bg-[#151a15] rounded-[14px] p-1 border shadow-sm">
            {(['active','pending','all'] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)} className={`px-4 h-[36px] rounded-[10px] text-[13px] font-bold capitalize ${tab===t?'bg-black text-white dark:bg-white dark:text-black':'opacity-60'}`}>{t==='active'?'Active Online':t}</button>
            ))}
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, seller, phone 08100145906..." className="flex-1 min-w-[240px] h-[42px] px-4 rounded-[14px] bg-white dark:bg-[#151a15] border shadow-sm outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p=>{
            const wa = normalizeWA(p.whatsapp || p.phone || '')
            return (
              <div key={p.id} className="bg-white dark:bg-[#151a15] rounded-[20px] p-4 border shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col">
                <div className="flex gap-3">
                  <img src={p.images?.[0] || '/placeholder.png'} className="w-[72px] h-[72px] rounded-[12px] object-cover bg-black/5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[14px] leading-tight truncate">{p.title}</p>
                    <p className="text-[16px] font-black text-green-600 mt-1">₦{Number(p.price).toLocaleString()}</p>
                    <p className="text-[11px] opacity-60 mt-1 truncate">{p.seller_name} • {p.phone} • {p.pickup_location} • 👁 {p.views||0}</p>
                  </div>
                  <span className={`h-fit px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.status==='active'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                </div>
                <p className="text-[11px] opacity-40 mt-2">{new Date(p.created_at).toLocaleString()} • WA: {wa}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`/products/${p.id}`} className="px-3 h-[32px] rounded-[10px] bg-black/5 dark:bg-white/10 text-[12px] font-bold flex items-center">View</Link>
                  <a href={`https://wa.me/${wa}`} target="_blank" className="px-3 h-[32px] rounded-[10px] bg-[#25D366] text-white text-[12px] font-bold flex items-center">WhatsApp {wa}</a>
                  {p.status==='pending' && <button onClick={()=>approve(p.id)} className="px-3 h-[32px] rounded-[10px] bg-green-600 text-white text-[12px] font-bold">Approve</button>}
                  <button onClick={()=>reject(p.id)} className="px-3 h-[32px] rounded-[10px] bg-yellow-500/20 text-yellow-700 text-[12px] font-bold">Reject</button>
                  <button onClick={()=>del(p.id)} className="px-3 h-[32px] rounded-[10px] bg-red-500/10 text-red-600 text-[12px] font-bold">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

