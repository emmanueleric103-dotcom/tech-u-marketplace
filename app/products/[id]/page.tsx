'use client'
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useParams } from "next/navigation";

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    supabase.from("products").select("*").eq("id", params.id).single().then(async ({ data }) => {
      if (data) {
        setProduct(data);
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", data.user_id).single();
        if (prof) setSeller(prof);
      }
    });
  }, [params.id]);

  const handleRequest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login"); return; }
    setRequesting(true);
    await supabase.from("requests").insert({ product_id: product.id, buyer_id: user.id, seller_id: product.user_id, message: "I want to buy " + product.title });
    setRequesting(false);
    alert("Request sent - seller will contact you");
  };

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {product.image_urls?.[0] && <img src={product.image_urls[0]} className="w-full h-[420px] object-cover rounded-2xl border" />}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {product.image_urls?.slice(1).map((url: string, i: number) => <img key={i} src={url} className="h-20 object-cover rounded-xl border" />)}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black">{product.title}</h1>
          <div className="text-2xl font-bold mt-2">NGN {product.price}</div>
          <div className="mt-2 text-sm"><span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">{product.stock} remaining</span> <span className="ml-2 px-3 py-1 bg-zinc-100 rounded-full">{product.product_type}</span></div>
          <p className="mt-6 text-zinc-600">{product.description}</p>
          <div className="mt-6 p-4 bg-white border rounded-xl">
            <div className="font-bold">Seller</div>
            <div className="text-sm">{seller?.full_name || product.user_id}</div>
            <div className="mt-3 flex gap-2">
              {product.whatsapp && <a href={"https://wa.me/" + product.whatsapp} target="_blank" className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold">WhatsApp</a>}
              {product.phone && <a href={"tel:" + product.phone} className="px-4 py-2 bg-black text-white rounded-full text-sm">Call</a>}
            </div>
          </div>
          <button onClick={handleRequest} disabled={requesting} className="mt-6 w-full p-4 bg-black text-white rounded-xl font-bold">{requesting ? "Sending..." : "Request Product"}</button>
        </div>
      </div>
    </main>
  );
}
