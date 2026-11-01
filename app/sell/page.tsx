'use client'
import dynamic from 'next/dynamic'
import { supabase } from '../../lib/supabase'
import { useState } from 'react'

export default function SellPage() {
  const [dragActive, setDragActive] = useState(false)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Sell an Item</h1>
        <p className="text-gray-500 text-sm mt-1">List your product in under 2 minutes</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
        {/* Image Upload */}
        <div>
          <label className="text-sm font-semibold text-gray-900 block mb-3">Product Images</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📸</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Drag photos here or click to browse</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each • Max 5 images</p>
            <button className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50">Choose Files</button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium block mb-2">Title</label>
            <input placeholder="iPhone 13 Pro Max 256GB" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Price (₦)</label>
            <input placeholder="450,000" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Description</label>
          <textarea rows={4} placeholder="Describe condition, features..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"></textarea>
        </div>

        <button className="w-full py-3.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-sm transition">Publish Listing</button>
      </div>
    </div>
  )
}
