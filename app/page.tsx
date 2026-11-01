'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  image_urls: string[];
  status: string;
  created_at: string;
};

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Books', 'Hostel Essentials', 'Gadgets', 'Furniture', 'Others'];

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      setLoading(true);
      const { data } = await supabase
        .from('listings')
        .select('id,title,price,category,condition,image_urls,status,created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(24);
      if (data) setListings(data as any);
      setLoading(false);
    }
    fetchLatest();
  }, []);

  const filtered = listings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || l.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="card p-6 sm:p-10 overflow-hidden relative">
        <div className="absolute -right-16 -top-16 w-[240px] h-[240px] bg-brand-100 rounded-full blur-2xl" />
        <div className="relative">
          <span className="inline-flex text-[11px] font-bold tracking-widest bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-100">ABIOLA AJIMOBI FIRST TECHNICAL UNIVERSITY</span>
          <h1 className="mt-4 text-[32px] sm:text-[44px] font-black leading-[0.95] tracking-tight">Buy & Sell<br/>on Campus</h1>
          <p className="mt-3 text-zinc-600 max-w-[520px] text-[15px] leading-relaxed">The simple, fast marketplace for TECH-U Ibadan. No buyer accounts. Post in 30 seconds, admin approves, buyers chat you on WhatsApp directly.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/sell" className="btn-pill bg-brand-600 text-white text-center">Sell an Item — Free</Link>
            <Link href="/products" className="btn-pill bg-zinc-900 text-white text-center sm:bg-white sm:text-zinc-900 sm:border sm:border-zinc-200">Browse Products</Link>
          </div>

          {/* Search bar rounded-full shadow-lg */}
          <div className="mt-8 max-w-[640px] relative">
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search phones, books, hostel items..."
              className="w-full h-[56px] rounded-full shadow-lg border border-zinc-100 pl-12 pr-4 outline-none focus:ring-2 focus:ring-brand-600"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">⌕</span>
          </div>
        </div>
      </section>

      {/* Browse by category pills */}
      <div className="flex gap-2 overflow-auto scrollbar-none pb-1">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={()=>setCategory(c)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition ${category===c ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-50'}`}
          >{c}</button>
        ))}
      </div>

      {/* Latest */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[18px]">Latest approved</h2>
          <Link href="/products" className="text-sm font-semibold text-brand-700">View all →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_,i)=><div key={i} className="card h-[220px] animate-pulse bg-zinc-50" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-brand-50 grid place-items-center mb-3">🛒</div>
            <p className="font-semibold">No listings yet</p>
            <p className="text-sm text-zinc-500 mt-1">Be the first to sell on TECH-U Marketplace. Your listing will be reviewed before going public.</p>
            <Link href="/sell" className="mt-4 inline-flex btn-pill bg-brand-600 text-white">Post your first item</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map(item => (
              <Link key={item.id} href={`/products/${item.id}`} className="card overflow-hidden group">
                <div className="aspect-[4/3] bg-zinc-100 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image_urls?.[0] || 'https://via.placeholder.com/400?text=No+Image'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-2 left-2 text-[11px] font-bold bg-white/90 backdrop-blur px-2.5 py-1 rounded-full">{item.condition}</span>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-[14px] leading-tight line-clamp-2">{item.title}</p>
                  <p className="mt-1 font-black text-[16px]">₦{Number(item.price).toLocaleString()}</p>
                  <p className="text-[12px] text-zinc-500">{item.category} • {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trust */}
      <section className="grid sm:grid-cols-3 gap-3">
        <div className="card p-4"><p className="font-bold text-sm">No buyer account</p><p className="text-xs text-zinc-500 mt-1">Browse & contact seller directly via WhatsApp/Call.</p></div>
        <div className="card p-4"><p className="font-bold text-sm">Admin approval</p><p className="text-xs text-zinc-500 mt-1">Every listing is reviewed to reduce scams.</p></div>
        <div className="card p-4"><p className="font-bold text-sm">Mobile-first</p><p className="text-xs text-zinc-500 mt-1">Built for Android, works perfectly on iPhone & desktop.</p></div>
      </section>
    </div>
  );
}
