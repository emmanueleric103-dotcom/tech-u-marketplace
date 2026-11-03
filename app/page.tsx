'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from './lib/supabase'
const CATEGORIES=[
  {name:'Electronics',icon:'💻',bg:'bg-blue-50',darkBg:'bg-[#1A2332]'},
  {name:'Phones',icon:'📱',bg:'bg-purple-50',darkBg:'bg-[#231A32]'},
  {name:'Fashion',icon:'👕',bg:'bg-pink-50',darkBg:'bg-[#321A22]'},
  {name:'Books',icon:'📚',bg:'bg-yellow-50',darkBg:'bg-[#322A1A]'},
  {name:'Home',icon:'🏠',bg:'bg-green-50',darkBg:'bg-[#1A3222]'},
  {name:'Vehicles',icon:'🚗',bg:'bg-orange-50',darkBg:'bg-[#32221A]'},
  {name:'Sports',icon:'⚽',bg:'bg-red-50',darkBg:'bg-[#321A1A]'},
  {name:'More',icon:'⋯',bg:'bg-gray-50',darkBg:'bg-[#1E1E1E]'},
]
export default function Home(){
  const [products,setProducts]=useState<any[]>([])
  const [search,setSearch]=useState('')
  const [catFilter,setCatFilter]=useState('')
  const [loading,setLoading]=useState(true)
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{
    const checkTheme=()=>{
      const saved=localStorage.getItem('techu-theme')
      const isD=document.documentElement.classList.contains('dark') || saved==='dark'
      setIsDark(isD)
    }
    checkTheme()
    const observer=new MutationObserver(checkTheme)
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
    window.addEventListener('theme-change',checkTheme as any)
    return ()=>{observer.disconnect(); window.removeEventListener('theme-change',checkTheme as any)}
  },[])
  useEffect(()=>{
    const load=async()=>{
      try{
        const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false})
        if(data) setProducts(data)
      }catch(e){}finally{setLoading(false)}
    }
    load()
  },[])
  const approved=products.filter(p=> p.status==='approved' || !p.status || p.status===null || p.status==='' )
  const filtered=approved.filter(p=>{
    const mSearch=!search || p.title?.toLowerCase().includes(search.toLowerCase())
    const mCat=!catFilter || p.category===catFilter
    return mSearch && mCat
  })
  const featured=filtered.slice(0,4)
  return (
    <div className={`min-h-screen ${isDark?'bg-[#0F0F12]':'bg-white'}`}><div className="max-w-[1100px] mx-auto px-4">
      <div id="search" className="mt-4 rounded-[24px] overflow-hidden relative h-[240px] md:h-[320px] bg-[#1E1B4B]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200" alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
        <div className="relative z-10 p-5 md:p-8 h-full flex flex-col justify-center">
          <div className="inline-flex bg-white/20 backdrop-blur px-3 py-1 rounded-full text-[11px] text-white w-fit">🎓 TECH-U Community</div>
          <h1 className="mt-3 text-[22px] md:text-[34px] font-extrabold leading-[1.1] text-white max-w-[320px]">Buy Smart. Sell Easy. <span className="text-[#FACC15] underline">Campus Connected.</span></h1>
          <p className="mt-2 text-[12px] text-white/80 max-w-[320px]">The exclusive marketplace for TECH-U students.</p>
          <div className="mt-4 flex gap-2 max-w-[420px]">
            <div className="flex-1 bg-white rounded-full h-11 flex items-center px-4 gap-2"><span>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." className="flex-1 text-[13px] outline-none bg-transparent text-black placeholder:text-gray-400" /></div>
            <Link href="/sell" className="bg-[#5B21B6] text-white rounded-full px-5 h-11 flex items-center text-[13px] font-bold">Sell an Item</Link>
          </div>
        </div>
      </div>
      <div id="categories" className="mt-6"><div className="flex justify-between"><h2 className={`text-[16px] font-bold ${isDark?'text-white':'text-[#1E1B4B]'}`}>Browse by Category</h2>{catFilter&&<button onClick={()=>setCatFilter('')} className="text-[12px] text-[#8B5CF6] font-bold">Clear ✕</button>}</div><div className="mt-3 grid grid-cols-4 md:grid-cols-8 gap-3">{CATEGORIES.map(c=>{const count=approved.filter(p=>p.category===c.name).length;return <button key={c.name} onClick={()=>setCatFilter(c.name===catFilter?'':c.name)} className={`${isDark?c.darkBg+' border border-[#2A2A2E]':c.bg} ${catFilter===c.name?'ring-2 ring-[#5B21B6]':''} rounded-2xl h-[88px] flex flex-col items-center justify-center gap-1.5`}><span className="text-[22px]">{c.icon}</span><span className={`text-[11px] font-bold ${isDark?'text-white':'text-[#1E1B4B]'}`}>{c.name}</span><span className={`text-[9px] ${isDark?'text-gray-400':'text-gray-500'}`}>{count>0?`${count}`:''}</span></button>})}</div></div>
      <div className="mt-8"><div className="flex justify-between"><h2 className={`text-[16px] font-bold ${isDark?'text-white':'text-[#1E1B4B]'}`}>Featured Listings</h2><span className={`text-[12px] ${isDark?'text-gray-400':'text-gray-500'}`}>{filtered.length} items</span></div>{loading?<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">{[1,2,3,4].map(i=><div key={i} className={`h-[200px] ${isDark?'bg-[#1A1A1E]':'bg-gray-100'} rounded-2xl animate-pulse`}></div>)}</div>:filtered.length===0?<div className={`mt-4 ${isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-[#F8F7FF] border-gray-200'} border border-dashed rounded-2xl p-8 text-center`}><div className="text-[28px]">📦</div><div className={`text-[14px] font-bold mt-2 ${isDark?'text-white':'text-[#1E1B4B]'}`}>{catFilter?`No listings in ${catFilter}`:'No approved listings yet'}</div><div className={`text-[12px] mt-1 ${isDark?'text-gray-400':'text-gray-500'}`}>{catFilter?'Try another category.':'Be first to sell on campus.'}</div><Link href="/sell" className="inline-flex mt-4 bg-[#5B21B6] text-white rounded-full px-6 py-2.5 text-[13px] font-bold">Sell an Item</Link></div>:<div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">{featured.map((p:any)=><Link key={p.id} href={`/products/${p.id}`} className={`${isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-white border-gray-100'} border rounded-2xl overflow-hidden`}><div className="h-[140px] bg-gray-100 relative"><img src={p.image_url||p.images?.[0]||'https://via.placeholder.com/300'} alt="" className="w-full h-full object-cover" /><span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#5B21B6] text-white">Available</span></div><div className="p-3"><div className={`text-[13px] font-bold truncate ${isDark?'text-white':'text-[#1E1B4B]'}`}>{p.title}</div><div className="text-[13px] font-bold text-[#8B5CF6]">₦{p.price}</div><div className={`text-[11px] mt-1 ${isDark?'text-gray-400':'text-gray-500'}`}>📍 {p.location||p.campus_location||'Campus'}</div></div></Link>)}</div>}</div>
      <div id="safety" className={`mt-8 ${isDark?'bg-[#232112] border-[#3A3416]':'bg-[#FEF9C3] border-yellow-200'} border rounded-2xl p-4`}><div className={`text-[13px] font-bold ${isDark?'text-[#FACC15]':'text-[#1E1B4B]'}`}>Stay Safe on Campus</div><div className={`text-[12px] mt-1 ${isDark?'text-gray-300':'text-gray-600'}`}>Meet in public places, verify items, use WhatsApp Bridge.</div></div><div className="h-10"></div>
    </div></div>
  )
}
