'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  async function login(){
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if(!error) router.push('/profile')
    else alert(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-lg border border-zinc-100 p-8">
        <h1 className="text-[28px] font-black tracking-tight mb-1">Welcome back</h1>
        <p className="text-sm text-zinc-500 mb-8">Login to TECH-U MARKET</p>
        <div className="space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="w-full h-[52px] rounded-xl border border-zinc-200 px-4 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full h-[52px] rounded-xl border border-zinc-200 px-4 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          <button onClick={login} disabled={loading} className="w-full h-[52px] rounded-full bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 transition">{loading?'Logging in...':'Login'}</button>
        </div>
        <p className="text-center text-sm mt-6 text-zinc-500">No account? <Link href="/auth/register" className="text-green-600 font-semibold">Create one</Link></p>
      </div>
    </div>
  )
}
