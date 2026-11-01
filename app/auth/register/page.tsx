'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default function RegisterPage(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  async function register(){
    const { error } = await supabase.auth.signUp({ email, password })
    if(!error) alert('Check email to confirm')
    else alert(error.message)
  }
  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-lg border p-8">
        <h1 className="text-[28px] font-black mb-1">Join TECH-U</h1>
        <p className="text-sm text-zinc-500 mb-8">Create your campus account</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full h-[52px] rounded-xl border px-4 bg-zinc-50 mb-4" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full h-[52px] rounded-xl border px-4 bg-zinc-50 mb-4" />
        <button onClick={register} className="w-full h-[52px] rounded-full bg-green-600 text-white font-semibold">Create Account</button>
        <p className="text-center text-sm mt-6 text-zinc-500">Already have account? <Link href="/auth/login" className="text-green-600 font-semibold">Login</Link></p>
      </div>
    </div>
  )
}
