"use client"
import { useState } from 'react'
import Link from 'next/link'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <html lang="en">
      <body className="bg-[#F8F7FF] text-[#1E1B4B] antialiased">
        {/* SINGLE HEADER */}
        <header className="sticky top-0 z-40 bg-white h-16 border-b border-[#E9E5FF] flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-xl bg-[#5B21B6] flex items-center justify-center text-white text-[16px]">🎓</span>
            <span className="font-bold text-[16px] tracking-tight whitespace-nowrap text-[#1E1B4B]">TECH-U Marketplace</span>
          </Link>
          <button onClick={()=>setOpen(v=>!v)} className="w-11 h-11 rounded-full bg-[#F5F3FF] flex items-center justify-center text-[#5B21B6]">☰</button>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={()=>setOpen(false)}>
            <div className="w-[300px] h-full bg-white p-6 flex flex-col gap-6" onClick={e=>e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-[#5B21B6] text-white grid place-items-center">🎓</span>
                <span className="font-bold">TECH-U</span>
              </div>
              <nav className="flex flex-col gap-1">
                <Link onClick={()=>setOpen(false)} href="/" className="min-h-[48px] flex items-center px-4 rounded-xl hover:bg-[#F5F3FF]">🏠 Home</Link>
                <Link onClick={()=>setOpen(false)} href="/sell" className="min-h-[48px] flex items-center px-4 rounded-xl hover:bg-[#F5F3FF]">➕ Sell Item</Link>
                <Link onClick={()=>setOpen(false)} href="/#categories" className="min-h-[48px] flex items-center px-4 rounded-xl hover:bg-[#F5F3FF]">⊞ Categories</Link>
                <Link onClick={()=>setOpen(false)} href="/#safety" className="min-h-[48px] flex items-center px-4 rounded-xl hover:bg-[#F5F3FF]">🛡️ Safety Tips</Link>
              </nav>
              <p className="mt-auto text-xs text-gray-500">Verified campus sellers • No login needed to browse</p>
            </div>
          </div>
        )}

        <main className="min-h-screen pb-24">{children}</main>

        {/* BOTTOM NAV - 5 items */}
        <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-[#E9E5FF] flex justify-around items-center px-1 z-40">
          <Link href="/" className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px]">
            <span className="text-[20px]">🏠</span><span className="text-[11px] font-medium">Home</span>
          </Link>
          <Link href="/#search" className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px]">
            <span className="text-[20px]">🔍</span><span className="text-[11px]">Search</span>
          </Link>
          <Link href="/sell" className="flex flex-col items-center justify-center gap-1 min-w-[64px]">
            <span className="w-12 h-12 rounded-full bg-[#5B21B6] text-white grid place-items-center text-xl -mt-3 shadow-lg shadow-purple-200">+</span>
            <span className="text-[11px] font-semibold text-[#5B21B6]">Sell</span>
          </Link>
          <Link href="/#categories" className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px]">
            <span className="text-[20px]">⊞</span><span className="text-[11px]">Categories</span>
          </Link>
          <Link href="/#safety" className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px]">
            <span className="text-[20px]">🛡️</span><span className="text-[11px]">Safety</span>
          </Link>
        </nav>
      </body>
    </html>
  )
}
