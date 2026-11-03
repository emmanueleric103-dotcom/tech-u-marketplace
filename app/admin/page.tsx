'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filter, setFilter] = useState<'pending'|'active'|'all'>('pending')

  const fetchProducts = async () => {
    // FIX: fetch all, no .eq filter - RLS was blocking + NULL hidden
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setProducts(data)
  }

  useEffect(() => { fetchProducts() }, [])

  // FIX: client-side counting, treat NULL/'' as pending for safety
  const total = products.length
  const pending = products.filter(p => !p.status || p.status === 'pending' || p.status === null || p.status === '').length
  const active = products.filter(p => p.status === 'approved').length

  const filtered = products.filter(p => {
    if (filter === 'pending') return !p.status || p.status === 'pending' || p.status === ''
    if (filter === 'active') return p.status === 'approved'
    return true
  })

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('products').update({ status }).eq('id', id)
    fetchProducts()
  }

  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-[#F6F5F8] p-4 pb-20">
      <h1 className="font-bold text-[22px]">Admin • TECH-U Market</h1>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-white rounded-[16px] p-3"><p className="text-[11px] text-gray-500 uppercase">Pending</p><p className="text-[28px] font-bold">{pending}</p></div>
        <div className="bg-white rounded-[16px] p-3"><p className="text-[11px] text-gray-500 uppercase">Active Online</p><p className="text-[28px] font-bold">{active}</p></div>
        <div className="bg-white rounded-[16px] p-3"><p className="text-[11px] text-gray-500 uppercase">Total</p><p className="text-[28px] font-bold">{total}</p></div>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={()=>setFilter('pending')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${filter==='pending'?'bg-[#7C3AED] text-white':'bg-white'}`}>PENDING</button>
        <button onClick={()=>setFilter('active')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${filter==='active'?'bg-[#7C3AED] text-white':'bg-white'}`}>ACTIVE</button>
        <button onClick={()=>setFilter('all')} className={`flex-1 py-2.5 rounded-full text-[13px] font-bold ${filter==='all'?'bg-[#7C3AED] text-white':'bg-white'}`}>ALL</button>
      </div>
      <div className="mt-4 space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-[16px] p-3 flex gap-3">
            <img src={p.image} className="w-[72px] h-[72px] rounded-[12px] object-cover" />
            <div className="flex-1">
              <p className="text-[14px] font-semibold line-clamp-1">{p.title}</p>
              <p className="text-[14px] font-bold">${p.price}</p>
              <p className="text-[11px] text-gray-500 mt-1">status: {p.status || 'NULL (treated as pending)'}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>updateStatus(p.id,'approved')} className="bg-[#7C3AED] text-white text-[11px] px-3 py-1 rounded-full font-bold">Approve</button>
                <button onClick={()=>updateStatus(p.id,'rejected')} className="bg-white border text-[11px] px-3 py-1 rounded-full font-bold">Reject</button>
                <button onClick={()=>deleteProduct(p.id)} className="text-red-500 text-[11px] px-2 py-1">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

