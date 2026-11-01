'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/')
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <div className="w-full max-w-[420px] rounded-[20px] bg-white border shadow-sm p-8">
        <h1 className="text-2xl font-black tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-500">Login to TECH-U MARKET</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="mt-1 w-full h-11 rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]" placeholder="you@tech-u.edu.ng" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="mt-1 w-full h-11 rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]" placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</p>}
          <button disabled={loading} className="w-full h-11 rounded-full bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] disabled:opacity-60">{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">No account? <Link href="/auth/register" className="font-semibold text-[#16a34a] hover:underline">Register</Link></p>
      </div>
    </div>
  )
}
