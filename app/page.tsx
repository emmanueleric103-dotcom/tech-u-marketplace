'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from './lib/supabase'

function cleanNum(v:any){ if(!v) return ''; return String(v).trim() }

export default function Home(){
  const [items,setItems]=useState<any[]>([])
  const [sellers,setSellers]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const [catFilter,setCatFilter]=useState('')
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{
    const check=()=>{ setIsDark(document.documentElement.classList.contains('dark')) }
    check()
    const obs=new MutationObserver(check)
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
    return ()=>obs.disconnect()
  },[])
  useEffect(()=>{
    const load=async()=>{
      const {data:prods}=await supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false})
      const {data:sells}=await supabase.from('sellers_public').select('*')
      setItems(prods||[])
      setSellers(sells||[])
      setLoading(false)
    }
    load()
  },[])
  const filtered=catFilter?items.filter((p:any)=>p.category===catFilter):items
  const featured=filtered
  return (
    <div className="mt-8"><div className="flex justify-between"><h2 className={`text-[16px] font-bold ${isDark?'text-white':'text-[#1E1B4B] dark:text-white'}`}>Featured Listings</h2><span className={`text-[12px] ${isDark?'text-gray-400':'text-gray-500 dark:text-gray-400'}`}>{filtered.length} items</span></div>
    {loading?<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">{[1,2,3,4].map(i=><div key={i} className={`h-[200px] ${isDark?'bg-[#1A1A1E]':'bg-gray-100'} rounded-2xl animate-pulse`}></div>)}</div>:filtered.length===0?<div className="mt-4 ${isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-[#F8F7FF] border-gray-200 dark:border-gray-700'} border-2 border-dashed rounded-2xl p-8 text-center"><div className="text-[28px]">🛒</div><div className={`text-[14px] font-bold mt-2 ${isDark?'text-white':'text-[#1E1B4B] dark:text-white'}`}>{catFilter?`No listings in ${catFilter}`:'No approved listings yet'}</div><Link href="/sell" className="inline-flex mt-4 bg-[#5B21B6] text-white rounded-full px-6 py-2.5 text-[13px] font-bold">Sell an Item</Link></div>:<div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">{featured.map((p:any)=>{
      const sellerLabel=p.seller_name||p.business_name||(p.title?.split(' ')[0])||'Seller'
      const storeId=p.seller_id||''
      return <div key={p.id} className={`${isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-white dark:bg-[#1A1A1E] border-gray-100'} border rounded-2xl overflow-hidden`}>
      <Link href={`/products/${p.id}`}><div className="product-title h-[140px] bg-gray-100 relative"><img src={p.image_url||p.images?.[0]||'https://via.placeholder.com/300'} alt="" className="w-full h-full object-cover"/><span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#5B21B6] text-white">Available</span></div><div className="p-3"><div className="text-[13px] font-bold truncate ${isDark?'text-white':'text-[#1E1B4B] dark:text-white'}">{p.title}</div><div className="text-[13px] font-bold text-[#8B5CF6] dark:text-[#C4B5FD]">₦{p.price?.toLocaleString()}</div><div className={`text-[11px] mt-1 ${isDark?'text-gray-400':'text-gray-500 dark:text-gray-400'}`}>{p.location||p.campus_location||'Campus'}</div></div></Link><Link href={`/store/${storeId}`} className="block px-3 pb-2 text-[11px] text-[#8B5CF6] dark:text-[#C4B5FD] font-bold hover:underline">by {sellerLabel} → Store</Link></div>})}</div>}
    </div>
  )
}
