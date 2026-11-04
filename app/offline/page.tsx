'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
export default function Offline(){
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{
    const s=localStorage.getItem('techu-theme')
    setIsDark(document.documentElement.classList.contains('dark')||s==='dark')
  },[])
  return (
    <div className={`min-h-[80vh] flex items-center justify-center p-6 ${isDark?'bg-[#0F0F12]':'bg-white'}`}>
      <div className={`max-w-[400px] w-full ${isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-white border-gray-100'} border rounded-[24px] p-8 text-center`}>
        <div className="w-16 h-16 bg-[#5B21B6] rounded-2xl flex items-center justify-center mx-auto text-white text-[28px]">📶</div>
        <h1 className={`mt-4 text-[18px] font-bold ${isDark?'text-white':'text-[#1E1B4B]'}`}>You are offline</h1>
        <p className={`text-[13px] mt-2 ${isDark?'text-gray-400':'text-gray-500'}`}>TECH-U Marketplace needs internet to show latest products. Check your connection.</p>
        <button onClick={()=>window.location.reload()} className="mt-5 w-full h-11 bg-[#5B21B6] text-white rounded-full font-bold text-[14px]">Retry</button>
        <Link href="/" className={`mt-3 block text-[13px] ${isDark?'text-gray-300':'text-gray-600'}`}>← Back to Home (cached)</Link>
      </div>
    </div>
  )
}
