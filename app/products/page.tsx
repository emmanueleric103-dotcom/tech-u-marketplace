'use client'
import dynamic from 'next/dynamic'
import { supabase } from '../../lib/supabase'
import { useState } from 'react'

const categories = [
  { name: 'All', count: 0 },
  { name: 'Phones', count: 0 },
  { name: 'Laptops', count: 0 },
  { name: 'Fashion', count: 0 },
]

export default function ProductsPage() {
  const [filter, setFilter] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 500000])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-[280px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-[88px]">
            <h3 className="font-bold text-gray-900 mb-4">Filters</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(c => (
                    <label key={c.name} className="flex items-center justify-between py-1.5 cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{c.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{c.count}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <span className="text-4xl mb-4 block">🔍</span>
            <h3 className="font-bold text-lg">No results</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting filters</p>
          </div>
        </div>
      </div>
    </div>
  )
}
