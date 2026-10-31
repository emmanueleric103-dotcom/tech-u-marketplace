'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  if (!mounted) return (
    <header className="h-[64px] bg-white border-b sticky top-0 z-50" />
  )

  return (
    <header className="h-[64px] bg-white border-b sticky top-0 z-50 backdrop-blur">
      <div className="max-w-[1280px] mx-auto px-4 h-full flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-[14px]">T</div>
          <span className="font-black tracking-tight text-[18px]">TECH-U</span>
          <span className="font-bold tracking-tight text-[18px] text-[#16a34a]">MARKET</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className={`px-4 h-[36px] flex items-center rounded-full text-[13px] font-semibold ${pathname==='/' ? 'bg-black text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>Browse</Link>
          <Link href="/sell" className="px-4 h-[36px] flex items-center rounded-full text-[13px] font-semibold bg-[#16a34a] text-white hover:bg-[#15803d]">Sell</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="hidden md:flex h-[36px] px-4 items-center rounded-full bg-zinc-100 text-[13px] font-semibold hover:bg-zinc-200">Dashboard</Link>
              <div className="w-8 h-8 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center font-bold text-[13px]">{user.email?.[0]?.toUpperCase()}</div>
              <button onClick={handleLogout} className="h-[36px] px-4 rounded-full border text-[13px] font-semibold hover:bg-zinc-50">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="h-[40px] px-6 flex items-center justify-center rounded-full bg-white border-2 border-[#16a34a] text-[#16a34a] font-bold text-[13px] hover:bg-[#f0fdf4] transition-colors">Login</Link>
              <Link href="/auth/register" className="hidden md:flex h-[40px] px-5 items-center justify-center rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:bg-[#15803d]">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
