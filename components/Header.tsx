'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
    return () => { listener.subscription.unsubscribe() }
  }, [])

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'white', borderBottom: '1px solid #e2e8f0', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link href="/" style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '-0.02em', textDecoration: 'none', color: '#0f172a' }}>TECH-U MARKET</Link>
      <nav style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '14px' }}>
        <Link href="/products" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600 }}>Browse</Link>
        <Link href="/sell" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600 }}>Sell</Link>
        {user ? (
          <>
            <Link href="/dashboard" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600 }}>Dashboard</Link>
            <Link href="/profile" style={{ textDecoration: 'none', background: '#0f172a', color: 'white', padding: '8px 14px', borderRadius: '20px', fontWeight: 700 }}>Profile</Link>
          </>
        ) : (
          <Link href="/profile" style={{ textDecoration: 'none', background: 'white', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '20px', fontWeight: 700, color: '#0f172a' }}>Login</Link>
        )}
      </nav>
    </header>
  )
}
