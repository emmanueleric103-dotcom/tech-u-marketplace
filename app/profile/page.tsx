'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function ProfilePage(){
  const [user,setUser]=useState<any>(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{ setUser(data.user); setLoading(false) })
  },[])

  if(loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if(!user){
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-6">
        <div className="bg-white rounded-[24px] shadow-lg border border-zinc-100 p-10 text-center max-w-[420px] w-full">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-5"><span className="text-3xl">👤</span></div>
          <h2 className="text-xl font-bold mb-2">Please login to view profile</h2>
          <p className="text-sm text-zinc-500 mb-6">You need an account to manage your listings and profile</p>
          <Link href="/auth/login" className="inline-flex w-full justify-center h-12 items-center rounded-full bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 transition">Go to Login</Link>
          <p className="text-xs text-zinc-400 mt-4">Fixed: no more login loop</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <div className="max-w-[560px] mx-auto bg-white rounded-[24px] border shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <p className="text-sm text-zinc-600 mb-4">Email: {user.email}</p>
        <input defaultValue={user.email} className="w-full h-12 rounded-xl border px-4 mb-4" />
        <button className="w-full h-12 rounded-full bg-zinc-900 text-white font-semibold">Save Changes</button>
      </div>
    </div>
  )
}
