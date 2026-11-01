'use client'
import dynamic from 'next/dynamic'
import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <h3 className="font-bold text-lg">Not logged in</h3>
          <p className="text-gray-500 text-sm mt-2 mb-6">Please sign in to view your profile</p>
          <a href="/auth/login" className="inline-flex px-6 py-2.5 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="font-bold text-xl">Profile</h2>
        <p className="text-gray-600 mt-2">{user.email}</p>
      </div>
    </div>
  )
}
