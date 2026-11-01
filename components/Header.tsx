'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user || null))
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b">
      <div className="mx-auto max-w-[1200px] px-4 h-[64px] flex items-center justify-between">
        <Link href="/" className="font-black tracking-tight text-[18px]">TECH-U <span className="bg-[#16a34a] text-white px-2 py-0.5 rounded-full ml-1">MARKET</span></Link>
        <nav className="flex items-center gap-2">
          <Link href="/products" className="h-9 px-4 rounded-full border bg-white font-medium text-sm hover:bg-zinc-50">Browse</Link>
          <Link href="/sell" className="h-9 px-4 rounded-full bg-[#16a34a] text-white font-semibold text-sm grid place-items-center hover:bg-[#15803d]">Sell</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="h-9 px-4 rounded-full border bg-white text-sm font-medium">Dashboard</Link>
              <Link href="/profile" className="h-9 w-9 rounded-full bg-zinc-900 text-white grid place-items-center text-sm font-bold">{user.email?.[0]?.toUpperCase()}</Link>
            </>
          ) : (
            <Link href="/auth/login" className="h-9 px-4 rounded-full border bg-white font-medium text-sm hover:bg-zinc-50">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
