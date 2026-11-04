'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
export default function Header(){
  const [open,setOpen]=useState(false)
  const [theme,setTheme]=useState('light')
  useEffect(()=>{
    const saved=localStorage.getItem('techu-theme')
    const sys=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'
    setTheme(saved||sys)
    document.documentElement.classList.toggle('dark', (saved||sys)==='dark')
  },[])
  useEffect(()=>{
    localStorage.setItem('techu-theme',theme)
    document.documentElement.classList.toggle('dark',theme==='dark')
    window.dispatchEvent(new CustomEvent('theme-change',{detail:theme}))
  },[theme])
  const isDark=theme==='dark'
  return (
    <>
      <header className={`sticky top-0 z-50 ${isDark?'bg-[#121214] border-[#2A2A2E]':'bg-white border-gray-100'} border-b h-16 flex items-center justify-between px-4 max-w-[1100px] mx-auto w-full`}>
        <Link href="/" className="flex items-center gap-2.5"><div className="w-10 h-10 bg-[#5B21B6] rounded-2xl flex items-center justify-center text-white">🎓</div><span className="font-extrabold"><span className={isDark?'text-white':'text-[#1E1B4B]'}>TECH-U</span> <span className="text-[#8B5CF6]">Marketplace</span></span></Link>
        <div className="flex gap-2">
          <Link href="/sell" className="hidden md:flex bg-[#5B21B6] text-white rounded-full px-5 h-9 items-center text-[13px] font-bold">Sell</Link>
          <button onClick={()=>setTheme(isDark?'light':'dark')} className={`w-9 h-9 ${isDark?'bg-[#2A2A2E]':'bg-gray-100'} rounded-full`}>{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className={`w-9 h-9 ${isDark?'bg-[#2A2A2E]':'bg-gray-100'} rounded-full`}>☰</button>
        </div>
      </header>
      {open && (<><div className="fixed inset-0 bg-black/40 z-40" onClick={()=>setOpen(false)}></div><div className={`fixed right-0 top-16 w-64 ${isDark?'bg-[#1A1A1E]':'bg-white'} h-[calc(100vh-4rem)] z-50 p-6 shadow-2xl`}><nav className="space-y-4 text-[14px]"><Link href="/" onClick={()=>setOpen(false)} className="block py-2">Home</Link><Link href="/sell" onClick={()=>setOpen(false)} className="block py-2">Sell Item</Link></nav></div></>)}
    </>
  )
}
