'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMsg(error.message)
    else { router.push('/'); router.refresh() }
  }

  const signup = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMsg(error.message)
    else setMsg('Check email to confirm, then login. Session will persist due to middleware.')
  }

  return (
    <div className="max-w-sm mx-auto bg-white border rounded-2xl p-6">
      <h1 className="font-black text-xl">Login - Real Auth</h1>
      <form onSubmit={login} className="space-y-3 mt-4">
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="w-full bg-black text-white py-2.5 rounded-full">Login (persists)</button>
        <button type="button" onClick={signup} className="w-full border py-2.5 rounded-full">Sign Up</button>
        {msg && <p className="text-sm p-2 border rounded bg-zinc-50">{msg}</p>}
      </form>
    </div>
  )
}
