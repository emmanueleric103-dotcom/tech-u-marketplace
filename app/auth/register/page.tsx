'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (data.user) {
      // create profile row
      await supabase.from('profiles').insert({ id: data.user.id, full_name: fullName, email })
    }
    router.push('/auth/login')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] bg-white rounded-[20px] border shadow-sm p-8">
        <h1 className="text-[24px] font-extrabold tracking-tight">Create account</h1>
        <p className="text-[13px] text-zinc-500 mt-1">Join 3,000+ TECH-U students buying & selling</p>

        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <div>
            <label className="text-[12px] font-semibold">Full name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="John Doe" className="mt-1 w-full h-[44px] px-4 rounded-full bg-[#f6f6f6] border border-transparent focus:bg-white focus:border-[#16a34a] outline-none text-[14px]" />
          </div>
          <div>
            <label className="text-[12px] font-semibold">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="you@tech-u.edu.ng" className="mt-1 w-full h-[44px] px-4 rounded-full bg-[#f6f6f6] border border-transparent focus:bg-white focus:border-[#16a34a] outline-none text-[14px]" />
          </div>
          <div>
            <label className="text-[12px] font-semibold">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="Min 6 characters" className="mt-1 w-full h-[44px] px-4 rounded-full bg-[#f6f6f6] border border-transparent focus:bg-white focus:border-[#16a34a] outline-none text-[14px]" />
          </div>
          {error && <div className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-full px-4 py-2">{error}</div>}
          <button disabled={loading} className="w-full h-[46px] rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-[14px]">{loading ? 'Creating...' : 'Create account'}</button>
        </form>

        <div className="mt-6 text-center text-[13px] text-zinc-500">
          Have account? <Link href="/auth/login" className="font-semibold text-[#16a34a]">Login</Link>
        </div>
      </div>
    </div>
  )
}
