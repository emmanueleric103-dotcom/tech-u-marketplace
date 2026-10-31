'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [department, setDepartment] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        setLoading(false)
        return
      }
      setUser(data.user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      if (profile) {
        setFullName(profile.full_name || '')
        setDepartment(profile.department || '')
      } else {
        setFullName(data.user.user_metadata?.full_name || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({ id: user.id, full_name: fullName, department, email: user.email })
    setSaving(false)
    if (!error) alert('Profile saved!')
  }

  if (loading) return <div className="p-10 text-center text-sm text-zinc-500">Loading profile...</div>

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-[20px] border shadow-sm p-10 text-center max-w-[400px] w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#fef3c7] flex items-center justify-center text-[28px]">🔒</div>
          <h2 className="font-bold text-[18px] mt-4">You are not logged in</h2>
          <p className="text-[13px] text-zinc-500 mt-2">Login to view and edit your TECH-U profile. No loop — direct to login.</p>
          <Link href="/auth/login" className="inline-flex mt-6 h-[44px] px-7 bg-[#16a34a] text-white rounded-full font-semibold items-center hover:bg-[#15803d]">
            Go to Login
          </Link>
          <div className="mt-4 text-[11px] text-zinc-400">Fixed: Profile now shows actionable Login button, not just text.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[560px] mx-auto px-4 py-10">
      <div className="bg-white rounded-[20px] border shadow-sm p-8">
        <h1 className="text-[22px] font-extrabold">My Profile</h1>
        <p className="text-[12px] text-zinc-500 mt-1">{user.email}</p>

        <form onSubmit={handleSave} className="mt-8 space-y-4">
          <div>
            <label className="text-[12px] font-semibold">Full name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 w-full h-[44px] px-4 rounded-full bg-[#f6f6f6] border focus:bg-white focus:border-[#16a34a] outline-none text-[14px]" />
          </div>
          <div>
            <label className="text-[12px] font-semibold">Department</label>
            <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Computer Science" className="mt-1 w-full h-[44px] px-4 rounded-full bg-[#f6f6f6] border focus:bg-white focus:border-[#16a34a] outline-none text-[14px]" />
          </div>
          <button disabled={saving} className="w-full h-[46px] rounded-full bg-black text-white font-semibold text-[14px] hover:bg-zinc-800">{saving ? 'Saving...' : 'Save changes'}</button>
        </form>

        <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} className="w-full mt-3 h-[44px] rounded-full bg-white border font-semibold text-[13px] hover:bg-zinc-50">
          Logout
        </button>
      </div>
    </div>
  )
}
