'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    getSession()

    // FIX: This was missing, causing Header to still show Login after login
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-black text-lg tracking-tight">TECH-U<span className="text-green-600">MARKET</span></Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:underline">Browse</Link>
          <Link href="/sell" className="bg-black text-white px-3 py-1.5 rounded-full">Sell</Link>
          {loading ? (
            <span className="text-gray-400">...</span>
          ) : user ? (
            <>
              <Link href="/dashboard" className="font-medium">Dashboard</Link>
              <Link href="/profile" className="font-medium">Profile</Link>
              <span className="hidden sm:inline text-gray-500 max-w-[120px] truncate">{user.email}</span>
              <button onClick={handleLogout} className="border px-3 py-1 rounded-full hover:bg-gray-50">Logout</button>
            </>
          ) : (
            <Link href="/auth/login" className="border px-3 py-1 rounded-full hover:bg-gray-50">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
