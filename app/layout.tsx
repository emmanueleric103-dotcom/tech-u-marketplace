// app/layout.tsx - SINGLE HEADER FIX
import './globals.css'
import BottomNav from './components/BottomNav'
import { useState } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <html lang="en">
      <body className="bg-white text-[#1E1B4B] overflow-x-clip antialiased">
        {/* SINGLE HEADER - ONLY ONE IN APP */}
        <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4">
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <div className="w-8 h-8 rounded-lg bg-[#5B21B6] flex items-center justify-center">
              {/* grad cap bag */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="font-extrabold text-[15px] md:text-[16px] tracking-tight whitespace-nowrap">
              <span className="text-[#1E1B4B]">TECH-U</span> <span className="text-[#5B21B6]">Marketplace</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/sell" className="hidden md:inline-flex h-9 px-5 rounded-full bg-[#5B21B6] text-white text-sm font-bold items-center">
              Sell Item
            </a>
            <button onClick={()=>setOpen(!open)} className="w-9 h-9 rounded-full bg-gray-50 flex flex-col items-center justify-center gap-1">
              <span className="w-4 h-0.5 bg-[#1E1B4B] rounded-full"/><span className="w-4 h-0.5 bg-[#1E1B4B] rounded-full"/><span className="w-4 h-0.5 bg-[#1E1B4B] rounded-full"/>
            </button>
          </div>
        </header>
        {open && (
          <div className="fixed inset-0 z-40 bg-black/40" onClick={()=>setOpen(false)}>
            <div className="absolute right-0 top-0 w-72 h-full bg-white p-6 shadow-2xl">
              <nav className="flex flex-col gap-4 mt-12 text-sm font-semibold">
                <a href="/">Home</a><a href="#categories">Categories</a><a href="#safety">Safety Tips</a><a href="/admin">Admin</a>
              </nav>
            </div>
          </div>
        )}
        <main className="pb-20 md:pb-0">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}

