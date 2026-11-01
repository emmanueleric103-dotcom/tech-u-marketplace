'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMsg(error.message)
    else { setMsg('Check your email for confirmation'); setTimeout(()=>router.push('/auth/login'), 1200) }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <div className="w-full max-w-[420px] rounded-[20px] bg-white border shadow-sm p-8">
        <h1 className="text-2xl font-black">Create account</h1>
        <p className="mt-1 text-sm text-zinc-500">Join TECH-U MARKET</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@tech-u.edu.ng" className="w-full h-11 rounded-xl border px-4" />
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full h-11 rounded-xl border px-4" />
          {msg && <p className="text-sm rounded-xl p-3 bg-zinc-50 border">{msg}</p>}
          <button disabled={loading} className="w-full h-11 rounded-full bg-[#16a34a] text-white font-semibold">{loading ? 'Creating...' : 'Register'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">Have account? <Link href="/auth/login" className="font-semibold text-[#16a34a]">Login</Link></p>
      </div>
    </div>
  )
}
