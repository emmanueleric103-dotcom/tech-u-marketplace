'use client'
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (!data.user) return;
      const { data: prods } = await supabase.from("products").select("*").eq("user_id", data.user.id);
      if (prods) setProducts(prods);
      const { data: reqs } = await supabase.from("requests").select("*").eq("seller_id", data.user.id);
      if (reqs) setRequests(reqs);
    });
  }, []);

  if (!user) return <main className="max-w-6xl mx-auto px-6 py-20"><div className="text-center"><h1 className="text-2xl font-bold">Not logged in</h1><Link href="/auth/login" className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-full">Go to Login</Link></div></main>;

  const totalStock = products.reduce((a, p) => a + (p.stock || 0), 0);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-white border p-6 rounded-2xl"><div className="text-xs uppercase">Total Products</div><div className="text-3xl font-black mt-2">{products.length}</div></div>
        <div className="bg-white border p-6 rounded-2xl"><div className="text-xs uppercase">Stock Left</div><div className="text-3xl font-black mt-2">{totalStock}</div></div>
        <div className="bg-white border p-6 rounded-2xl"><div className="text-xs uppercase">Requests</div><div className="text-3xl font-black mt-2">{requests.length}</div></div>
      </div>
      <div className="mt-10">
        <h2 className="font-bold">My Listings</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {products.map(p => (
            <Link key={p.id} href={"/products/" + p.id} className="bg-white border rounded-2xl p-4">
              <div className="font-bold">{p.title}</div>
              <div className="text-sm text-zinc-500">NGN {p.price} - Stock: {p.stock}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
