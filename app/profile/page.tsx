'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ProfilePage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({ full_name: '', department: '', phone: '' })
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) setProfile({ full_name: data.full_name||'', department: data.department||'', phone: data.phone||'' })
      }
    }
    load()
  }, [])

  const save = async () => {
    if (!user) return
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...profile, email: user.email })
    if (error) setMsg(error.message)
    else setMsg('Saved to public.profiles - FIX for 404 error!')
  }

  if (!user) return <div className="p-10 text-center border border-dashed rounded-2xl">Login to view profile (this page previously 404)</div>

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-2xl p-6">
      <h1 className="text-xl font-black">Profile (Real - fixes 404)</h1>
      <p className="text-sm text-zinc-500 mb-4">{user.email}</p>
      <div className="space-y-3">
        <input placeholder="Full name" value={profile.full_name} onChange={e=>setProfile({...profile, full_name: e.target.value})} />
        <input placeholder="Department e.g. Computer Science" value={profile.department} onChange={e=>setProfile({...profile, department: e.target.value})} />
        <input placeholder="Phone" value={profile.phone} onChange={e=>setProfile({...profile, phone: e.target.value})} />
        <button onClick={save} className="w-full bg-black text-white py-2.5 rounded-full">Save</button>
        {msg && <p className="text-sm p-2 bg-zinc-50 border rounded">{msg}</p>}
      </div>
    </div>
  )
}
