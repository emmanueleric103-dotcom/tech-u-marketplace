'use client'
import dynamic from 'next/dynamic'
import { supabase } from '../../../lib/supabase'
import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-500 text-sm mt-2">Join TECH-U MARKET today</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Full Name</label>
            <input placeholder="John Doe" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Email</label>
            <input type="email" placeholder="you@tech-u.edu.ng" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <button className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 shadow-sm">Create Account</button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have account? <a href="/auth/login" className="text-green-600 font-medium">Sign in</a>
        </p>
      </div>
    </div>
  )
}
