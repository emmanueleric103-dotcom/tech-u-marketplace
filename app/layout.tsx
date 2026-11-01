import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import DarkModeToggle from '../components/DarkModeToggle'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'TECH-U Marketplace', description: 'Campus Marketplace for TECH-U' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 h-[64px] flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight"><span className="bg-[#16a34a] text-white w-8 h-8 rounded-lg flex items-center justify-center">T</span> TECH-U<span className="font-light opacity-60">_MARKET</span></Link>
            <div className="flex items-center gap-2">
              <Link href="/products" className="hidden md:block text-sm font-medium px-3">Browse</Link>
              <DarkModeToggle/>
              <Link href="/sell" className="bg-gradient-to-br from-[#16a34a] to-emerald-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg">Sell</Link>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 pb-20">{children}</main>
        <footer className="border-t py-10 text-center text-sm opacity-60">TECH-U Marketplace • Built for First Technical University Ibadan</footer>
      </body>
    </html>
  )
}
