'use client'
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    supabase.from("products").select("*").then(({ data }) => { if (data) setProducts(data); });
  }, []);

  const cats = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || p.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black">Browse Products</h1>
      <div className="mt-6 flex gap-3 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="border p-3 rounded-full px-5 flex-1 min-w-[200px]" />
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} className={"px-4 py-2 rounded-full text-sm border " + (cat === c ? "bg-black text-white" : "bg-white")}>{c}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {filtered.map(p => (
          <Link key={p.id} href={"/products/" + p.id} className="bg-white border rounded-2xl overflow-hidden">
            {p.image_urls?.[0] && <img src={p.image_urls[0]} className="h-48 w-full object-cover" />}
            <div className="p-4">
              <div className="font-bold">{p.title}</div>
              <div className="text-sm text-zinc-600">NGN {p.price}</div>
              <div className="text-xs mt-1 text-emerald-600 font-medium">{p.stock} left in stock - {p.product_type}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
