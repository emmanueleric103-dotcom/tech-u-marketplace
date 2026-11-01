'use client'
import dynamic from 'next/dynamic'
import { supabase } from '../../lib/supabase'
import { useState } from 'react'

export default function DashboardPage() {
  const stats = [
    { label: 'Active Listings', value: '0', icon: '📦' },
    { label: 'Total Sales', value: '₦0', icon: '💰' },
    { label: 'Views', value: '0', icon: '👁️' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <span>{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <p className="text-gray-500">No activity yet. Start selling!</p>
      </div>
    </div>
  )
}
