'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase'

export default function ProfilePage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [dept, setDept] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }
      setUser(data.user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      if (profile) { setFullName(profile.full_name || ''); setDept(profile.department || '') }
      setLoading(false)
    })
  }, [])

  async function save() {
    setMsg('Saving...')
    const { error } = await supabase.from('profiles').upsert({ id: user.id, full_name: fullName, department: dept })
    setMsg(error ? error.message : 'Saved ✓')
  }

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading...</div>

  if (!user) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="rounded-[20px] bg-white border shadow-sm p-8 text-center max-w-[420px] w-full">
          <h2 className="font-bold text-lg">You are not logged in</h2>
          <p className="text-sm text-zinc-500 mt-1">Login to manage your TECH-U profile</p>
          <Link href="/auth/login" className="mt-5 inline-flex h-10 px-6 rounded-full bg-[#16a34a] text-white font-semibold items-center">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-8">
      <div className="rounded-[20px] bg-white border shadow-sm p-8">
        <h1 className="text-2xl font-black">My Profile</h1>
        <p className="text-sm text-zinc-500">{user.email}</p>
        <div className="mt-6 space-y-4">
          <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full name" className="w-full h-11 rounded-xl border px-4" />
          <input value={dept} onChange={e=>setDept(e.target.value)} placeholder="Department e.g. Computer Science" className="w-full h-11 rounded-xl border px-4" />
          {msg && <p className="text-sm p-3 rounded-xl bg-zinc-50 border">{msg}</p>}
          <button onClick={save} className="h-11 px-6 rounded-full bg-[#16a34a] text-white font-semibold">Save changes</button>
        </div>
      </div>
    </div>
  )
}
