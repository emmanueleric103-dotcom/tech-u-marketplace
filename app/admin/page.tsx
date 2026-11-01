'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard(){
  const [stats, setStats] = useState({ pending:0, approved:0, rejected:0, reports:0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(()=>{
    async function init(){
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }
      const [p,a,r,rep] = await Promise.all([
        supabase.from('listings').select('id',{count:'exact'}).eq('status','pending'),
        supabase.from('listings').select('id',{count:'exact'}).eq('status','approved'),
        supabase.from('listings').select('id',{count:'exact'}).eq('status','rejected'),
        supabase.from('reports').select('id',{count:'exact'})
      ]);
      setStats({ pending: p.count||0, approved: a.count||0, rejected: r.count||0, reports: rep.count||0 });
      setLoading(false);
    }
    init();
  },[router]);

  if (loading) return <div className="card p-10 animate-pulse">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-black">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Link href="/admin/pending" className="card p-5"><p className="text-xs text-zinc-500 font-bold tracking-widest">PENDING</p><p className="text-[28px] font-black mt-1">{stats.pending}</p></Link>
        <Link href="/admin/approved" className="card p-5"><p className="text-xs text-zinc-500 font-bold tracking-widest">APPROVED</p><p className="text-[28px] font-black mt-1">{stats.approved}</p></Link>
        <Link href="/admin/rejected" className="card p-5"><p className="text-xs text-zinc-500 font-bold tracking-widest">REJECTED</p><p className="text-[28px] font-black mt-1">{stats.rejected}</p></Link>
        <Link href="/admin/reports" className="card p-5"><p className="text-xs text-zinc-500 font-bold tracking-widest">REPORTS</p><p className="text-[28px] font-black mt-1">{stats.reports}</p></Link>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/admin/pending" className="card p-5 font-semibold">View Pending Listings →</Link>
        <Link href="/admin/categories" className="card p-5 font-semibold">Manage Categories →</Link>
      </div>
    </div>
  );
}
