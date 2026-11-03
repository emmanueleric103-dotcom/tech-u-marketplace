'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Home, Search, Plus, LayoutGrid, Shield, Menu, X } from 'lucide-react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setDrawerOpen(false)
  }

  const focusSearch = () => {
    const el = document.getElementById('search') as HTMLInputElement | null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => el.focus(), 300)
    } else {
      window.location.href = '/#search'
    }
    setDrawerOpen(false)
  }

  return (
    <html lang="en">
      <body className="bg-[#FCFBF7] antialiased">
        {/* SINGLE HEADER - logo no wrap */}
        <header className="sticky top-0 z-40 bg-white border-b border-black/[0.08] h-[56px] flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-black text-white grid place-items-center font-black text-[11px] tracking-widest">TU</div>
            <span className="font-bold text-[15px] tracking-tight whitespace-nowrap">TECH-U MARKETPLACE</span>
          </Link>
          <button onClick={() => setDrawerOpen(!drawerOpen)} className="w-9 h-9 grid place-items-center border border-black/10">
            {drawerOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </header>

        {/* DRAWER - NO ADMIN HERE */}
        {drawerOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={()=>setDrawerOpen(false)} />
            <div className="fixed top-[56px] right-0 w-[280px] h-[calc(100vh-56px)] bg-white z-50 border-l border-black/10 p-6 flex flex-col gap-1 animate-in">
              <Link href="/" onClick={()=>setDrawerOpen(false)} className="h-11 flex items-center px-3 font-medium hover:bg-black hover:text-white transition-colors">Home</Link>
              <Link href="/sell" onClick={()=>setDrawerOpen(false)} className="h-11 flex items-center px-3 font-medium hover:bg-black hover:text-white transition-colors">Sell Item</Link>
              <button onClick={()=>scrollToId('categories')} className="h-11 flex items-center px-3 font-medium hover:bg-black hover:text-white transition-colors text-left w-full">Categories</button>
              <button onClick={()=>scrollToId('safety')} className="h-11 flex items-center px-3 font-medium hover:bg-black hover:text-white transition-colors text-left w-full">Safety Tips</button>
              <button onClick={focusSearch} className="h-11 flex items-center px-3 font-medium hover:bg-black hover:text-white transition-colors text-left w-full">Search</button>
              <div className="mt-6 pt-6 border-t text-[11px] leading-relaxed text-black/50 uppercase tracking-widest">
                Admin is hidden. Type /admin manually in URL.
              </div>
            </div>
          </>
        )}

        <main className="pb-[84px]">{children}</main>

        {/* BOTTOM NAV - ALL WORKING - z-50 pointer-events-auto */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto bg-white border-t border-black/10 h-[72px] flex items-stretch">
          <Link href="/" className="flex-1 grid place-items-center gap-1 py-2 hover:bg-black/[0.04] transition-colors">
            <Home size={20} strokeWidth={1.8} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Home</span>
          </Link>
          <button onClick={focusSearch} className="flex-1 grid place-items-center gap-1 py-2 hover:bg-black/[0.04] transition-colors">
            <Search size={20} strokeWidth={1.8} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Search</span>
          </button>
          <Link href="/sell" className="flex-1 grid place-items-center">
            <div className="w-12 h-12 bg-black text-white rounded-full grid place-items-center -mt-3 shadow-lg">
              <Plus size={22} />
            </div>
          </Link>
          <button onClick={()=>scrollToId('categories')} className="flex-1 grid place-items-center gap-1 py-2 hover:bg-black/[0.04] transition-colors">
            <LayoutGrid size={20} strokeWidth={1.8} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Catego</span>
          </button>
          <button onClick={()=>scrollToId('safety')} className="flex-1 grid place-items-center gap-1 py-2 hover:bg-black/[0.04] transition-colors">
            <Shield size={20} strokeWidth={1.8} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Safety</span>
          </button>
        </nav>
      </body>
    </html>
  )
}

