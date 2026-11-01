"use client"
import { useState } from 'react'
import Link from 'next/link'
export default function Home(){
  const [q,setQ]=useState('')
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-[32px] bg-[#111] text-white dark:bg-white dark:text-black p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-[300px] w-[300px] bg-[#FF4D00] rounded-full blur-[80px] opacity-60" />
        <h1 className="text-[40px] md:text-[64px] font-black tracking-[-0.04em] leading-[0.9] relative">BUY.<br/>SELL.<br/>CAMPUS.</h1>
        <p className="mt-4 max-w-md text-white/70 dark:text-black/60 text-[15px]">Verified student marketplace for TECH-U. Laptops, phones, accessories — no scam.</p>
        <div className="mt-6 flex gap-2 max-w-md relative">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search iPhone, laptop..." className="flex-1 h-12 rounded-full bg-white text-black px-5 outline-none" />
          <Link href={`/products?q=${q}`} className="h-12 px-6 rounded-full bg-[#FF4D00] grid place-items-center font-bold text-white">Search</Link>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Phones','Laptops','Accessories','Hostel Essentials'].map(c=>(
          <Link key={c} href={`/categories?c=${c}`} className="rounded-2xl border border-black/10 dark:border-white/10 p-4 h-28 flex flex-col justify-between hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
            <span className="text-2xl">📦</span><span className="font-bold">{c}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
