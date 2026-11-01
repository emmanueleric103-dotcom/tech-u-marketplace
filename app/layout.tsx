export const dynamic = 'force-dynamic'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TECH-U Marketplace | Sell Faster',
  description: 'Nigeria\'s fastest tech marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased`}>
        {/* GLASS HEADER */}
        <header className="sticky top-0 z-50 glass backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-[#16a34a] to-emerald-600 flex items-center justify-center text-white font-black text-[14px] shadow-lg shadow-emerald-600/20">
                TU
              </div>
              <span className="font-black text-[18px] tracking-tight">TECH-U</span>
              <span className="hidden sm:inline-flex ml-2 badge-new">MARKETPLACE</span>
            </div>

            <nav className="flex items-center gap-2">
              <a href="/sell" className="btn-primary text-[14px] px-5 py-2.5">Sell</a>
              <button 
                onClick={() => document.documentElement.classList.toggle('dark')}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:scale-105 transition"
              >
                🌙
              </button>
            </nav>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        {/* BEAUTIFUL FOOTER */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 font-black text-lg">
                <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#16a34a] to-emerald-600 grid place-items-center text-white text-xs">TU</div>
                TECH-U
              </div>
              <p className="text-sm text-slate-500 mt-2 max-w-[320px]">Sell faster. Nigeria\'s expert marketplace for phones, gadgets, verified sellers.</p>
            </div>
            <div className="text-sm text-slate-500">© 2025 TECH-U • Built for speed</div>
          </div>
        </footer>
      </body>
    </html>
  )
}

