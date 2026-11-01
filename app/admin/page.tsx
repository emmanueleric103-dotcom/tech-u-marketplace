'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminHome() {
  const [stats, setStats] = useState({pending:0, approved:0, rejected:0, reports:0})

  useEffect(()=>{
    Promise.all([
      supabase.from('products').select('id',{count:'exact'}).eq('status','pending'),
      supabase.from('products').select('id',{count:'exact'}).eq('status','approved'),
      supabase.from('products').select('id',{count:'exact'}).eq('status','rejected'),
      supabase.from('reports').select('id',{count:'exact'})
    ]).then(([p,a,r,rep])=>{
      setStats({ pending: p.count||0, approved: a.count||0, rejected: r.count||0, reports: rep.count||0 })
    })
  },[])

  return (
    <div>
      <h1 className="text-2xl font-black">Admin • SIMPLE</h1>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/pending" className="tech-card p-5"><div className="text-xs text-zinc-500">PENDING</div><div className="text-3xl font-black">{stats.pending}</div></Link>
        <Link href="/admin/approved" className="tech-card p-5"><div className="text-xs text-zinc-500">APPROVED</div><div className="text-3xl font-black text-[#16a34a]">{stats.approved}</div></Link>
        <Link href="/admin/rejected" className="tech-card p-5"><div className="text-xs text-zinc-500">REJECTED</div><div className="text-3xl font-black">{stats.rejected}</div></Link>
        <Link href="/admin/reports" className="tech-card p-5"><div className="text-xs text-zinc-500">REPORTS</div><div className="text-3xl font-black text-red-600">{stats.reports}</div></Link>
      </div>
      <div className="mt-6 flex gap-2">
        <Link href="/admin/categories" className="tech-card px-4 py-2 text-sm">Categories</Link>
        <button onClick={()=>{document.cookie='techu_admin=; path=/; max-age=0'; location.href='/admin/login'}} className="text-sm underline">Logout</button>
      </div>
      <div className="mt-6 tech-card p-4 bg-green-50 border-green-200">
        <div className="font-bold text-[#16a34a]">✅ FIXED BUILD</div>
        <div className="text-sm mt-1">lib/rateLimit.ts now uses forEach not for...of, tsconfig has target es2017 + downlevelIteration true. Will go Live, not 29.6s fail.</div>
      </div>
    </div>
  )
}
