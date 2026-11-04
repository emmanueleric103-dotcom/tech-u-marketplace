'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
export default function Header(){
  const [open,setOpen]=useState(false)
  const [theme,setTheme]=useState('light')
  useEffect(()=>{
    const saved=localStorage.getItem('techu-theme')
    const sys=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'
    const init=saved||sys
    setTheme(init)
    document.documentElement.classList.toggle('dark',init==='dark')
  },[])
  useEffect(()=>{
    localStorage.setItem('techu-theme',theme)
    document.documentElement.classList.toggle('dark',theme==='dark')
    window.dispatchEvent(new CustomEvent('theme-change',{detail:theme}))
  },[theme])
  const isDark=theme==='dark'
  return (
    <>
      <header className={`sticky top-0 z-50 ${isDark?'bg-[#0F0F0F] border-[#2A2A2E]':'bg-white border-gray-100'} border-b h-16 flex items-center justify-between px-4 max-w-[1100px] mx-auto w-full`}>
        <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap">
          <div className="w-10 h-10 bg-[#5B21B6] rounded-2xl flex items-center justify-center text-white text-[18px]">🎓</div>
          <span className="font-extrabold text-[15px] md:text-[18px]"><span className={isDark?'text-white':'text-[#1E1B4B]'}>TECH-U</span> <span className="text-[#8B5CF6]"> Marketplace</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/sell" className="hidden md:flex bg-[#5B21B6] text-white rounded-full px-5 h-9 items-center text-[13px] font-bold">Sell</Link>
          <button onClick={()=>setTheme(isDark?'light':'dark')} className={`w-9 h-9 ${isDark?'bg-[#2A2A2E] text-yellow-400':'bg-gray-100'} rounded-full flex items-center justify-center text-[16px]`}>{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className={`w-9 h-9 ${isDark?'bg-[#2A2A2E]':'bg-gray-100'} rounded-full flex items-center justify-center`}>☰</button>
        </div>
      </header>
      {open && (<><div className="fixed inset-0 bg-black/40 z-40" onClick={()=>setOpen(false)}></div><div className={`fixed right-0 top-16 w-64 ${isDark?'bg-[#1A1A1E]':'bg-white'} h-[calc(100vh-4rem)] z-50 p-6 shadow-2xl`}><nav className="space-y-4 text-[14px] font-medium"><Link href="/" onClick={()=>setOpen(false)} className="block py-2">Home</Link><Link href="/sell" onClick={()=>setOpen(false)} className="block py-2">Sell Item</Link><Link href="/#categories" onClick={()=>setOpen(false)} className="block py-2">Categories</Link><Link href="/#safety" onClick={()=>setOpen(false)} className="block py-2">Safety Tips</Link></nav></div></>)}
      <nav className={`fixed bottom-0 left-0 right-0 ${isDark?'bg-[#0F0F0F] border-[#2A2A2E]':'bg-white border-gray-200'} border-t h-[64px] flex justify-around items-center z-50 md:hidden`}>
        <Link href="/" className={`flex flex-col items-center gap-0.5 w-16 ${isDark?'text-white':'text-black'}`}><span className="text-[20px]">🏠</span><span className="text-[10px]">Home</span></Link>
        <Link href="/#search" className={`flex flex-col items-center gap-0.5 w-16 ${isDark?'text-white':'text-black'}`}><span className="text-[20px]">🔍</span><span className="text-[10px]">Search</span></Link>
        <Link href="/sell" className="w-14 h-14 bg-[#5B21B6] rounded-full flex items-center justify-center text-white text-[24px] -mt-3 shadow-lg">+</Link>
        <Link href="/#categories" className={`flex flex-col items-center gap-0.5 w-16 ${isDark?'text-white':'text-black'}`}><span className="text-[18px]">⊞</span><span className="text-[10px]">Categories</span></Link>
        <Link href="/#safety" className={`flex flex-col items-center gap-0.5 w-16 ${isDark?'text-white':'text-black'}`}><span className="text-[20px]">🛡️</span><span className="text-[10px]">Safety</span></Link>
      </nav>
    </>
  )
}
