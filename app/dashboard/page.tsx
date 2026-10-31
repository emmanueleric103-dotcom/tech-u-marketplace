'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [stats, setStats] = useState({ total:0, active:0, sold:0 })

  useEffect(()=>{
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('products').select('*').eq('user_id', user.id).order('created_at', { ascending:false })
      setProducts(data || [])
      setStats({ total: data?.length||0, active: data?.filter((p:any)=>p.status!=='sold').length||0, sold: data?.filter((p:any)=>p.status==='sold').length||0 })
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-black">Dashboard - Real Data</h1>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-white border rounded-2xl p-4"><p className="text-xs text-zinc-500">Total</p><p className="text-2xl font-bold">{stats.total}</p></div>
        <div className="bg-white border rounded-2xl p-4"><p className="text-xs text-zinc-500">Active</p><p className="text-2xl font-bold">{stats.active}</p></div>
        <div className="bg-white border rounded-2xl p-4"><p className="text-xs text-zinc-500">Sold</p><p className="text-2xl font-bold">{stats.sold}</p></div>
      </div>
      {products.length===0 ? (
        <div className="border border-dashed rounded-2xl p-12 text-center mt-6"><p className="font-semibold">No listings yet</p><p className="text-sm text-zinc-500">Your real products will appear here (query where user_id = current user)</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {products.map(p=>(
            <Link key={p.id} href={`/product/${p.id}`} className="bg-white border rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-zinc-100">{p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" />}</div>
              <div className="p-3"><p className="truncate font-medium">{p.title}</p><p className="text-green-600 font-bold">₦{Number(p.price).toLocaleString()}</p></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
