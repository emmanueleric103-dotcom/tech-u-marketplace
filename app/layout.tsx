'use client'
import './globals.css'
import { useState } from 'react'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <html lang="en">
      <body className="bg-white text-[#1E1B4B] overflow-x-hidden antialiased">
        {/* SINGLE HEADER - Keep exact design */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap">
            <div className="w-10 h-10 bg-[#5B21B6] rounded-2xl flex items-center justify-center text-white text-lg">🛍️</div>
            <span className="font-extrabold text-[15px] md:text-[18px] tracking-tight">
              <span className="text-[#1E1B4B]">TECH-U</span> <span className="text-[#5B21B6]">Marketplace</span>
            </span>
          </Link>
          <button onClick={()=>setOpen(!open)} className="w-10 h-10 flex flex-col justify-center items-center gap-1.5">
            <span className="w-6 h-0.5 bg-[#5B21B6] rounded"></span>
            <span className="w-6 h-0.5 bg-[#5B21B6] rounded"></span>
            <span className="w-6 h-0.5 bg-[#5B21B6] rounded"></span>
          </button>
        </header>

        {open && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={()=>setOpen(false)}></div>
            <div className="fixed right-0 top-16 w-64 bg-white h-[calc(100vh-4rem)] z-50 p-6 shadow-2xl">
              <nav className="space-y-4 text-[15px] font-medium">
                <Link href="/" onClick={()=>setOpen(false)} className="block py-2">Home</Link>
                <Link href="/sell" onClick={()=>setOpen(false)} className="block py-2">Sell Item</Link>
                <Link href="/#categories" onClick={()=>setOpen(false)} className="block py-2">Categories</Link>
                <Link href="/#safety" onClick={()=>setOpen(false)} className="block py-2">Safety Tips</Link>
              </nav>
            </div>
          </>
        )}

        <main className="pb-20">{children}</main>

        {/* BOTTOM NAV - Keep exact design, make working */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[64px] flex justify-around items-center z-50 md:hidden">
          <Link href="/" className="flex flex-col items-center gap-0.5 w-16">
            <span className="text-[20px]">🏠</span>
            <span className="text-[10px] font-medium text-[#5B21B6]">Home</span>
          </Link>
          <Link href="/#search" className="flex flex-col items-center gap-0.5 w-16">
            <span className="text-[20px]">🔍</span>
            <span className="text-[10px] font-medium">Search</span>
          </Link>
          <Link href="/sell" className="w-14 h-14 bg-[#5B21B6] rounded-full flex items-center justify-center text-white text-[28px] -mt-3 shadow-lg">+</Link>
          <Link href="/#categories" className="flex flex-col items-center gap-0.5 w-16">
            <span className="text-[18px]">⊞</span>
            <span className="text-[10px] font-medium">Categories</span>
          </Link>
          <Link href="/#safety" className="flex flex-col items-center gap-0.5 w-16">
            <span className="text-[20px]">🛡️</span>
            <span className="text-[10px] font-medium">Safety</span>
          </Link>
        </nav>
      </body>
    </html>
  )
}
