"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
  description: string;
  seller_name: string;
  phone: string;
  whatsapp: string;
  pickup_location: string;
  status: string;
  views: number;
  created_at: string;
};

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if(data){
        setProduct(data as Product);
        // increment views
        await supabase.from("products").update({ views: (data.views||0)+1 }).eq("id", id);
      }
      setLoading(false);
    })();
  },[id]);

  if(loading) return <div className="min-h-screen grid place-items-center bg-[#fbfaf7] dark:bg-black">Loading...</div>;
  if(!product) return <div className="min-h-screen grid place-items-center">Product not found. <Link href="/" className="underline ml-2">Go Home</Link></div>;

  return (
    <div className="min-h-screen bg-[#fbfaf7] dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-6">
        <Link href="/" className="inline-flex px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border text-sm font-bold mb-6">← Back to Market</Link>
        
        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* Gallery */}
          <div className="rounded-[24px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images?.[idx]} alt={product.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full">
                {product.images?.map((_:any,i:number)=>(
                  <button key={i} onClick={()=>setIdx(i)} className={`w-2 h-2 rounded-full ${i===idx ? "bg-white" : "bg-white/40"}`} />
                ))}
              </div>
            </div>
            <div className="p-3 flex gap-2 overflow-auto">
              {product.images?.map((img:string,i:number)=>(
                <button key={i} onClick={()=>setIdx(i)} className={`w-[72px] h-[72px] rounded-[14px] overflow-hidden border-2 shrink-0 ${i===idx ? "border-black dark:border-white" : "border-transparent"}`}>
                  {/* eslint-disable-next-line */}
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="rounded-[24px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 md:p-7 h-fit">
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold">{product.category}</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">{product.views} views</span>
            </div>
            <h1 className="text-[24px] md:text-[30px] font-black leading-[1.05]">{product.title}</h1>
            <div className="text-[32px] font-black mt-2">₹{product.price}</div>
            
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a href={`https://wa.me/${product.whatsapp}?text=Hi, I want ${encodeURIComponent(product.title)} - ₹${product.price}`} target="_blank" className="py-3 rounded-full bg-emerald-500 text-white text-center font-black text-sm">WhatsApp Seller</a>
              <a href={`tel:${product.phone}`} className="py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-center font-black text-sm">Call {product.phone}</a>
            </div>

            <div className="mt-6 space-y-4 text-[14px] leading-6">
              <div>
                <div className="font-black text-[12px] uppercase tracking-widest opacity-60 mb-1">Seller</div>
                <div className="font-bold">{product.seller_name} • {product.phone}</div>
              </div>
              <div>
                <div className="font-black text-[12px] uppercase tracking-widest opacity-60 mb-1">Pickup Location</div>
                <div>📍 {product.pickup_location}</div>
              </div>
              <div>
                <div className="font-black text-[12px] uppercase tracking-widest opacity-60 mb-1">Description</div>
                <div className="opacity-80 whitespace-pre-wrap">{product.description || "No description provided."}</div>
              </div>
              <div className="text-[11px] opacity-50">Posted {new Date(product.created_at).toLocaleString()} • ID: {product.id.slice(0,8)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

