"use client"
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function Admin(){
  const [products,setProducts]=useState<any[]>([])
  const [tab,setTab]=useState<'active'|'pending'|'all'>('active')
  const [search,setSearch]=useState('')
  const [loading,setLoading]=useState(true)

  const load = async()=>{
    setLoading(true)
    const {data} = await supabase.from('products').select('*').order('created_at',{ascending:false})
    setProducts(data||[])
    setLoading(false)
  }
  useEffect(()=>{load()},[])

  const del = async(id:string,title:string)=>{
    if(!confirm(`Are you sure delete ${title}?`)) return
    const {error} = await supabase.from('products').delete().eq('id',id)
    if(error) alert(error.message)
    else { alert('Deleted'); load() }
  }
  const approve = async(id:string)=>{
    await supabase.from('products').update({status:'approved'}).eq('id',id)
    load()
  }
  const reject = async(id:string)=>{
    await supabase.from('products').update({status:'rejected'}).eq('id',id)
    load()
  }

  const filtered = products.filter(p=>{
    if(tab==='active' && p.status!=='approved') return false
    if(tab==='pending' && p.status!=='pending') return false
    if(search){
      const s=search.toLowerCase()
      return p.title?.toLowerCase().includes(s) || p.seller_name?.toLowerCase().includes(s) || p.phone?.includes(s)
    }
    return true
  })

  const stats = {
    total: products.length,
    active: products.filter(p=>p.status==='approved').length,
    pending: products.filter(p=>p.status==='pending').length,
    views: products.reduce((sum,p)=>sum+(p.views||0),0)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black">Admin Panel</h1>
          <Link href="/" className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-full">Home</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-4"><p className="text-xs text-gray-500">Total Products</p><p className="text-2xl font-black">{stats.total}</p></div>
          <div className="bg-green-600 text-white rounded-[20px] p-4"><p className="text-xs">Active Online 🟢</p><p className="text-2xl font-black">{stats.active}</p></div>
          <div className="bg-yellow-500 text-white rounded-[20px] p-4"><p className="text-xs">Pending</p><p className="text-2xl font-black">{stats.pending}</p></div>
          <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-4"><p className="text-xs text-gray-500">Total Views</p><p className="text-2xl font-black">{stats.views}</p></div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-4 mb-6 flex gap-2">
          <button onClick={()=>setTab('active')} className={`px-5 py-2 rounded-full ${tab==='active'?'bg-green-600 text-white':'bg-gray-100 dark:bg-zinc-800'}`}>Active Online 🟢 {stats.active}</button>
          <button onClick={()=>setTab('pending')} className={`px-5 py-2 rounded-full ${tab==='pending'?'bg-green-600 text-white':'bg-gray-100 dark:bg-zinc-800'}`}>Pending {stats.pending}</button>
          <button onClick={()=>setTab('all')} className={`px-5 py-2 rounded-full ${tab==='all'?'bg-green-600 text-white':'bg-gray-100 dark:bg-zinc-800'}`}>All {stats.total}</button>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-4 mb-6">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, seller, phone 08100145906..." className="w-full border rounded-full px-5 py-3"/>
        </div>
        {loading ? <p>Loading...</p> : (
          <div className="grid gap-4">
            {filtered.map((p:any)=>(
              <div key={p.id} className="bg-white dark:bg-zinc-900 rounded-[20px] p-4 flex gap-4 shadow-sm">
                <img src={p.images?.[0]||p.image_url} className="w-20 h-20 rounded-xl object-cover"/>
                <div className="flex-1">
                  <p className="font-bold">{p.title} - ₦{Number(p.price).toLocaleString()} <span className={`text-[10px] px-2 py-1 rounded-full ml-2 ${p.status==='approved'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{p.status}</span></p>
                  <p className="text-sm text-gray-600">Seller: {p.seller_name} • {p.phone} • {p.pickup_location||p.location}</p>
                  <p className="text-xs text-gray-400">Views: {p.views||0} • {new Date(p.created_at).toLocaleString()}</p>
                  <div className="flex gap-2 mt-2">
                    <Link href={`/products/${p.id}`} className="bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs">View</Link>
                    <a href={`https://wa.me/${(p.whatsapp||p.seller_whatsapp||'').replace(/\D/g,'')}`} target="_blank" className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">WhatsApp</a>
                    {p.status==='pending' && <button onClick={()=>approve(p.id)} className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">Approve</button>}
                    {p.status==='pending' && <button onClick={()=>reject(p.id)} className="bg-gray-300 px-3 py-1 rounded-full text-xs">Reject</button>}
                    <button onClick={()=>del(p.id,p.title)} className="bg-red-600 text-white px-3 py-1 rounded-full text-xs">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length===0 && <p className="text-center py-10">No products in {tab}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
