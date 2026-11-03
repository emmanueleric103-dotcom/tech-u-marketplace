'use client'
import './globals.css'
import { useState } from 'react'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open,setOpen]=useState(false)
  return (
    <html lang="en">
      <body className="bg-white text-[#1E1B4B] overflow-x-hidden">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-9 h-9 bg-[#5B21B6] rounded-xl flex items-center justify-center">🛍️</div>
            <span className="font-extrabold text-[#1E1B4B]">TECH-U <span className="text-[#5B21B6]">Marketplace</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sell" className="hidden md:inline-flex bg-[#5B21B6] text-white px-4 py-2 rounded-full text-sm font-bold">Sell Item</Link>
            <button onClick={()=>setOpen(!open)} className="w-9 h-9 flex flex-col justify-center gap-1.5">
              <span className="w-6 h-0.5 bg-[#5B21B6]"></span><span className="w-6 h-0.5 bg-[#5B21B6]"></span><span className="w-6 h-0.5 bg-[#5B21B6]"></span>
            </button>
          </div>
        </header>
        {open && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={()=>setOpen(false)}>
            <div className="absolute right-0 top-16 w-64 bg-white h-[calc(100vh-4rem)] p-4 shadow-xl">
              <nav className="space-y-3">
                <Link href="/" onClick={()=>setOpen(false)} className="block py-2">Home</Link>
                <Link href="/sell" onClick={()=>setOpen(false)} className="block py-2">Sell Item</Link>
                <Link href="/admin" onClick={()=>setOpen(false)} className="block py-2">Admin</Link>
              </nav>
            </div>
          </div>
        )}
        <main className="pb-20">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-around items-center z-50 md:hidden">
          <Link href="/" className="flex flex-col items-center text-[#5B21B6]"><span>🏠</span><span className="text-[10px]">Home</span></Link>
          <button onClick={()=>document.getElementById('search')?.focus()} className="flex flex-col items-center"><span>🔍</span><span className="text-[10px]">Search</span></button>
          <Link href="/sell" className="w-12 h-12 bg-[#5B21B6] rounded-full flex items-center justify-center text-white text-2xl -mt-4">+</Link>
          <button onClick={()=>document.getElementById('categories')?.scrollIntoView({behavior:'smooth'})} className="flex flex-col items-center"><span>⊞</span><span className="text-[10px]">Categories</span></button>
          <Link href="/#safety" className="flex flex-col items-center"><span>🛡️</span><span className="text-[10px]">Safety</span></Link>
        </nav>
      </body>
    </html>
  )
}
