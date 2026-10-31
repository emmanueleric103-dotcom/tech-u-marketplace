'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [dept, setDept] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({data}) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({data:profile}) => {
          if (profile) {
            setFullName(profile.full_name || '')
            setDept(profile.department || '')
          }
        })
      }
    })
  }, [])

  const saveProfile = async () => {
    if (!user) return
    await supabase.from('profiles').upsert({ id: user.id, full_name: fullName, department: dept, email: user.email })
    alert('Profile saved!')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
      <input className="border p-2 w-full mb-2" placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} />
      <input className="border p-2 w-full mb-4" placeholder="Department" value={dept} onChange={e=>setDept(e.target.value)} />
      <button onClick={saveProfile} className="bg-green-600 text-white px-4 py-2 rounded w-full">Save Profile</button>
    </div>
  )
}
