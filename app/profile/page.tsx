'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({ data: p }) => {
          if (p) setFullName(p.full_name || '')
        })
      }
    })
  }, [])

  async function save() {
    if (!user) return
    const { error } = await supabase.from('profiles').upsert({ id: user.id, full_name: fullName, updated_at: new Date().toISOString() })
    setMsg(error ? error.message : 'Profile saved!')
  }

  if (!user) return <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}><p>Please login to view profile.</p></div>

  return (
    <div style={{ maxWidth: '480px', background: 'white', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>Profile</h1>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '18px' }}>{user.email}</p>
      <label style={{ fontSize: '12px', fontWeight: 600 }}>FULL NAME</label>
      <input value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Your name" style={{ width: '100%', padding: '12px', margin: '6px 0 14px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
      <button onClick={save} style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', borderRadius: '8px', border: 0, fontWeight: 700 }}>Save Profile</button>
      {msg && <p style={{ marginTop: '12px', fontSize: '13px' }}>{msg}</p>}
    </div>
  )
}
