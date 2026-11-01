"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from '../../lib/supabase';

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  images: string[]; // base64 or urls
  seller_name: string;
  phone: string;
  whatsapp: string;
  pickup_location: string;
  status: "pending" | "approved" | "rejected";
  views: number;
  created_at: string;
  description?: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "all">("active");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setProducts(data as Product[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === "approved").length,
    pending: products.filter(p => p.status === "pending").length,
    views: products.reduce((s, p) => s + (p.views || 0), 0),
  };

  const filtered = products.filter(p => {
    if (activeTab === "active" && p.status !== "approved") return false;
    if (activeTab === "pending" && p.status !== "pending") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.seller_name?.toLowerCase().includes(q) ||
        p.pickup_location?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const approve = async (id: string) => {
    setBusyId(id);
    await supabase.from("products").update({ status: "approved" }).eq("id", id);
    await load();
    setBusyId(null);
  };

  const reject = async (id: string) => {
    setBusyId(id);
    await supabase.from("products").update({ status: "rejected" }).eq("id", id);
    await load();
    setBusyId(null);
  };

  const del = async (id: string) => {
    if (!confirm("DELETE this product permanently? This cannot be undone.")) return;
    setBusyId(id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert(error.message);
    else await load();
    setBusyId(null);
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs/24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#f6f6f3] dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 p-4 md:p-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-[28px] md:text-[36px] font-black tracking-tight">ADMIN — ACTIVE ONLINE + DELETE</h1>
          <Link href="/" className="px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-bold">← Home</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { k: "Total Listings", v: stats.total },
            { k: "Active Online", v: stats.active, green: true },
            { k: "Pending Approval", v: stats.pending, yellow: true },
            { k: "Total Views", v: stats.views },
          ].map(s => (
            <div key={s.k} className="rounded-[20px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="text-[11px] uppercase tracking-[0.15em] opacity-60 font-bold">{s.k}</div>
              <div className={`text-[28px] font-black mt-1 ${s.green ? "text-emerald-500" : s.yellow ? "text-amber-500" : ""}`}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          {[
            { id: "active", label: `Active Online (${stats.active})` },
            { id: "pending", label: `Pending (${stats.pending})` },
            { id: "all", label: `All (${stats.total})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-bold border transition ${activeTab===tab.id ? "bg-black text-white dark:bg-white dark:text-black border-black" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"}`}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto flex gap-2 w-full md:w-auto">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, seller, location..." className="w-full md:w-[320px] px-4 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm outline-none" />
            <button onClick={load} className="px-4 py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black text-sm font-bold">Reload</button>
          </div>
        </div>

        {loading ? <div className="p-10 text-center opacity-60">Loading products...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="rounded-[20px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images?.[0] || "/placeholder.png"} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${p.status==="approved" ? "bg-emerald-500 text-white" : p.status==="pending" ? "bg-amber-400 text-black" : "bg-zinc-800 text-white"}`}>{p.status}</span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/70 text-white backdrop-blur">{p.category}</span>
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-black">{p.views || 0} views</div>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="flex justify-between gap-2">
                    <h3 className="font-bold text-[16px] leading-tight line-clamp-2 flex-1">{p.title}</h3>
                    <span className="font-black text-[16px]">₹{p.price}</span>
                  </div>
                  <div className="text-[12px] opacity-70 leading-4">
                    <div>Seller: {p.seller_name} • {p.phone}</div>
                    <div>📍 {p.pickup_location} • {timeAgo(p.created_at)}</div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link href={`/products/${p.id}`} className="px-3 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-center text-[12px] font-bold">View</Link>
                    <a href={`https://wa.me/${p.whatsapp}?text=Hi, I'm interested in ${encodeURIComponent(p.title)}`} target="_blank" className="px-3 py-2.5 rounded-full bg-emerald-500 text-white text-center text-[12px] font-bold">WhatsApp</a>
                    {p.status!=="approved" && <button disabled={busyId===p.id} onClick={()=>approve(p.id)} className="px-3 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[12px] font-bold disabled:opacity-50">Approve ✓</button>}
                    {p.status==="pending" && <button disabled={busyId===p.id} onClick={()=>reject(p.id)} className="px-3 py-2.5 rounded-full bg-amber-100 text-amber-900 text-[12px] font-bold">Reject</button>}
                    <button disabled={busyId===p.id} onClick={()=>del(p.id)} className="col-span-2 px-3 py-2.5 rounded-full bg-red-600 text-white text-[12px] font-black disabled:opacity-50">🗑 Delete Permanently</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && filtered.length===0 && <div className="p-16 text-center opacity-50 rounded-[20px] border border-dashed mt-4">No products in this tab.</div>}
      </div>
    </div>
  );
}

