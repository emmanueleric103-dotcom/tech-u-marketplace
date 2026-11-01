"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
  seller_name: string;
  pickup_location: string;
  status: string;
  views: number;
  created_at: string;
};

const CATS = ["All","Mobile","Laptop","Bike","Furniture","Clothes","Other"];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<"newest"|"price_low"|"price_high"|"views">("newest");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("status","approved")
        .order("created_at",{ascending:false});
      if(data) setProducts(data as Product[]);
      setLoading(false);
    })();
  },[]);

  const filtered = useMemo(()=>{
    let list = [...products];
    if(q) {
      const low = q.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(low) || p.pickup_location?.toLowerCase().includes(low));
    }
    if(cat!=="All") list = list.filter(p=>p.category===cat);
    if(sort==="newest") list.sort((a,b)=>+new Date(b.created_at)-+new Date(a.created_at));
    if(sort==="price_low") list.sort((a,b)=>a.price-b.price);
    if(sort==="price_high") list.sort((a,b)=>b.price-a.price);
    if(sort==="views") list.sort((a,b)=>(b.views||0)-(a.views||0));
    return list;
  },[products,q,cat,sort]);

  const featured = useMemo(()=> [...products].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,3),[products]);

  const counts = useMemo(()=>{
    const m: Record<string,number> = {};
    products.forEach(p=>{ m[p.category]=(m[p.category]||0)+1 });
    return m;
  },[products]);

  const timeAgo = (d:string)=> {
    const h = Math.floor((Date.now()-+new Date(d))/36e5);
    if(h<1) return "Just now"; if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-black text-white dark:bg-white dark:text-black grid place-items-center font-black">M</div>
          <span className="font-black tracking-tight">MARKET</span>
          <div className="ml-auto flex gap-2">
            <Link href="/admin" className="px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold">Admin</Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
        {/* Hero Search */}
        <div className="rounded-[28px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 md:p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search mobile, bike, location..." className="flex-1 min-w-[220px] px-5 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 outline-none text-sm" />
            <select value={cat} onChange={e=>setCat(e.target.value)} className="px-4 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-bold outline-none">
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={sort} onChange={e=>setSort(e.target.value as any)} className="px-4 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-bold outline-none">
              <option value="newest">Newest</option>
              <option value="price_low">Price Low</option>
              <option value="price_high">Price High</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white font-bold">{products.length} Active Online</span>
            {CATS.slice(1).map(c=>(
              <button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-full border font-bold ${cat===c ? "bg-black text-white border-black" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"}`}>{c} {counts[c] ? `(${counts[c]})` : ""}</button>
            ))}
          </div>
        </div>

        {/* Featured */}
        {!q && cat==="All" && featured.length>0 && (
          <div className="mb-8">
            <h2 className="font-black text-[18px] mb-3">🔥 Most Viewed</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {featured.map(p=>(
                <Link key={p.id} href={`/products/${p.id}`} className="rounded-[20px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex gap-3 p-3">
                  {/* eslint-disable-next-line */}
                  <img src={p.images?.[0]} className="w-[84px] h-[84px] rounded-[14px] object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold opacity-60">{p.category} • {p.views} views</div>
                    <div className="font-bold text-[14px] truncate">{p.title}</div>
                    <div className="font-black">₹{p.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? <div className="py-20 text-center opacity-50">Loading approved products...</div> : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-[18px]">{cat==="All" ? "All Products" : cat} • {filtered.length}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p=>(
                <Link key={p.id} href={`/products/${p.id}`} className="group rounded-[20px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition">
                  <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                    {/* eslint-disable-next-line */}
                    <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-white/90 text-[11px] font-bold text-black">{p.category}</span>
                  </div>
                  <div className="p-3.5">
                    <div className="flex gap-2 justify-between">
                      <h3 className="font-bold text-[14px] leading-tight line-clamp-2 flex-1">{p.title}</h3>
                      <span className="font-black text-[15px]">₹{p.price}</span>
                    </div>
                    <div className="mt-2 text-[11px] opacity-70 flex items-center justify-between">
                      <span>📍 {p.pickup_location}</span>
                      <span>👁 {p.views||0}</span>
                    </div>
                    <div className="mt-1 text-[11px] opacity-60">{p.seller_name} • {timeAgo(p.created_at)}</div>
                  </div>
                </Link>
              ))}
            </div>
            {filtered.length===0 && <div className="py-20 text-center opacity-50 border border-dashed rounded-[20px] mt-6">No products found. Try different search.</div>}
          </>
        )}
      </main>
    </div>
  );
}

