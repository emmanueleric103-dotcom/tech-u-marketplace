'use client'
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (!data.user) return;
      const { data: reqs } = await supabase.from("requests").select("*, products(title, price, whatsapp, phone)").or("buyer_id.eq." + data.user.id + ",seller_id.eq." + data.user.id);
      if (reqs) setRequests(reqs);
    });
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black">Requests</h1>
      <div className="mt-8 space-y-4">
        {requests.map(r => (
          <div key={r.id} className="bg-white border rounded-2xl p-5">
            <div className="font-bold">{r.products?.title}</div>
            <div className="text-sm text-zinc-500">NGN {r.products?.price} - {r.status}</div>
            <div className="mt-3 flex gap-2">
              {r.products?.whatsapp && <a href={"https://wa.me/" + r.products.whatsapp} target="_blank" className="px-4 py-2 bg-green-500 text-white rounded-full text-xs">WhatsApp Seller</a>}
              {r.products?.phone && <a href={"tel:" + r.products.phone} className="px-4 py-2 bg-zinc-900 text-white rounded-full text-xs">Call Seller</a>}
            </div>
          </div>
        ))}
        {requests.length === 0 && <div className="text-zinc-500">No requests yet</div>}
      </div>
    </main>
  );
}
