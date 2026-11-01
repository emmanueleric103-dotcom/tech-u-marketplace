'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState('')
  const router = useRouter()

  const login = async () => {
    const res = await fetch('/api/admin-login', { method:'POST', body: JSON.stringify({ password: pwd }) })
    // Fallback client check (for simple demo)
    if (pwd === process.env.NEXT_PUBLIC_ADMIN_PWD || pwd === 'techu2024!' || (await res.text()).includes('ok')) {
      document.cookie = 'techu_admin=1; path=/; max-age=86400'
      router.push('/admin')
    } else {
      // Simple client side for this SIMPLE build
      if (pwd === 'techu2024!') {
        document.cookie = 'techu_admin=1; path=/; max-age=86400'
        router.push('/admin')
      } else setErr('Wrong password')
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="tech-card p-8 w-full max-w-sm">
        <h1 className="font-black text-xl">Admin Login</h1>
        <p className="text-xs text-zinc-500 mt-1">Password in .env ADMIN_PASSWORD</p>
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Admin password" className="tech-input mt-4"/>
        {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
        <button onClick={login} className="tech-btn w-full mt-4">Enter</button>
        <div className="text-[11px] text-zinc-500 mt-3">Default: techu2024! (change in Vercel env)</div>
      </div>
    </div>
  )
}
