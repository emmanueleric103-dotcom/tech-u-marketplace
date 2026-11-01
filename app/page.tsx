'use client'
import dynamic from 'next/dynamic'
import { supabase } from '../lib/supabase'
import { useState } from 'react'

const categories = [
  { name: 'All', emoji: '🛍️' },
  { name: 'Electronics', emoji: '📱' },
  { name: 'Fashion', emoji: '👕' },
  { name: 'Books', emoji: '📚' },
  { name: 'Hostel', emoji: '🛏️' },
  { name: 'Gadgets', emoji: '🎧' },
]

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')
  const products: any[] = []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar - Jiji style */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-lg">🔍</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phones, laptops, fashion, books..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-[15px] placeholder:text-gray-400"
          />
          <button className="absolute right-2 top-2 bottom-2 px-6 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition">Search</button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5 mb-8 justify-center sm:justify-start">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCat(cat.name)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${selectedCat === cat.name ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-700'}`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Product Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{products.length}</span> products found
          {selectedCat !== 'All' && <span> in {selectedCat}</span>}
        </p>
        <select className="text-sm border border-gray-200 rounded-full px-3 py-1.5 bg-white">
          <option>Newest first</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      {/* Empty State - Beautiful */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 py-20 px-8 text-center">
        <div className="w-20 h-20 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-[36px]">🛍️</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No products yet</h3>
        <p className="text-gray-500 text-[15px] mb-8 max-w-sm mx-auto">Be first to sell - list your items and reach thousands of TECH-U students instantly.</p>
        <a href="/sell" className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full text-[15px] font-semibold hover:bg-green-700 shadow-sm hover:shadow-md transition-all">
          Sell an Item
        </a>
      </div>
    </div>
  )
}
