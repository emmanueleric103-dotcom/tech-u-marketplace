'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchApproved = async () => {
      // FIX: fetch all, then client filter including NULL as approved for old listings
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (!data) return
      const approved = data.filter((p:any) => p.status === 'approved' || !p.status || p.status === null || p.status === '')
      setProducts(approved)
    }
    fetchApproved()
  }, [])

  return (
    <div className="min-h-screen bg-[#F6F5F8] p-4">
      <div className="grid grid-cols-2 gap-3">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-[16px] p-2">
            <img src={p.image} className="w-full h-[140px] rounded-[12px] object-cover" />
            <p className="text-[13px] font-semibold mt-2 line-clamp-1">{p.title}</p>
            <p className="text-[13px] font-bold">${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

