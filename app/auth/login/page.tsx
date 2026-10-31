'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] bg-white rounded-[20px] border shadow-sm p-8">
        <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#16a34a] font-black text-[20px] mb-4">T</div>
        <h1 className="text-[24px] font-extrabold tracking-tight">Welcome back</h1>
        <p className="text-[13px] text-zinc-500 mt-1">Login to TECH-U Marketplace</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-zinc-700">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="you@tech-u.edu.ng" className="mt-1 w-full h-[44px] px-4 rounded-full bg-[#f6f6f6] border border-transparent focus:bg-white focus:border-[#16a34a] outline-none text-[14px]" />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-zinc-700">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="••••••••" className="mt-1 w-full h-[44px] px-4 rounded-full bg-[#f6f6f6] border border-transparent focus:bg-white focus:border-[#16a34a] outline-none text-[14px]" />
          </div>

          {error && <div className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-full px-4 py-2">{error}</div>}

          <button disabled={loading} className="w-full h-[46px] rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-[14px] disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-[13px] text-zinc-500">
          No account? <Link href="/auth/register" className="font-semibold text-[#16a34a] hover:underline">Create account</Link>
        </div>

        <div className="mt-6 pt-6 border-t text-[11px] text-zinc-400">
          Fix applied: Login now goes to <span className="font-mono bg-zinc-100 px-1 rounded">/auth/login</span> and redirects to home on success — no more loop.
        </div>
      </div>
    </div>
  )
}
