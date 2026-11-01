'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function ProductDetails() {
  const { id } = useParams() as { id: string };
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState('Scam or suspicious listing');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSent, setReportSent] = useState(false);

  useEffect(()=>{
    async function load(){
      const { data } = await supabase.from('listings').select('*').eq('id', id).single();
      if (data) {
        setItem(data);
        // bump views
        await supabase.from('listings').update({ views: (data.views||0)+1 }).eq('id', id);
      }
      setLoading(false);
    }
    if (id) load();
  },[id]);

  if (loading) return <div className="card p-10 animate-pulse">Loading...</div>;
  if (!item) return <div className="card p-10 text-center">Listing not found. <Link href="/products" className="text-brand-600 font-semibold">Browse</Link></div>;

  // WhatsApp format required: https://wa.me/number?text=Hello - then product name auto included
  // Example spec: https://wa.me/number?text=Hello, I saw your [PRODUCT NAME] on TECH-U Marketplace and I am interested in buying it. Is it still available?
  const whatsappText = `Hello, I saw your ${item.title} on TECH-U Marketplace and I am interested in buying it. Is it still available?`;
  const waLink = `https://wa.me/${item.whatsapp.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(whatsappText)}`;
  const telLink = `tel:${item.phone}`;

  async function submitReport(e: React.FormEvent){
    e.preventDefault();
    const { error } = await supabase.from('reports').insert({ listing_id: id, reason: reportReason, description: reportDesc });
    if (!error) { setReportSent(true); setReporting(false); }
  }

  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
      <div className="space-y-3">
        <div className="card overflow-hidden">
          <div className="aspect-[4/3] bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_urls?.[activeImg] || 'https://via.placeholder.com/600'} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-2 flex gap-2 overflow-auto">
            {item.image_urls?.map((u:string,i:number)=>(
              <button key={i} onClick={()=>setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${i===activeImg?'border-brand-600':'border-transparent'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-5 sm:p-6">
          <div className="flex gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-900 text-white">{item.category}</span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-100">{item.condition}</span>
            {item.status==='sold' ? <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-600 text-white">SOLD</span> : <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">Available</span>}
          </div>
          <h1 className="mt-3 text-[22px] sm:text-[28px] font-black leading-tight tracking-tight">{item.title}</h1>
          <p className="mt-2 text-[28px] font-black">₦{Number(item.price).toLocaleString()}</p>
          <p className="mt-2 text-sm text-zinc-500">Posted {new Date(item.created_at).toLocaleDateString()} • {item.location || 'TECH-U Campus'} • {item.views||0} views</p>
          <div className="mt-5">
            <p className="text-sm font-semibold mb-2">Description</p>
            <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-zinc-700">{item.description}</p>
          </div>
        </div>

        <div className="card p-4 space-y-3">
          <a href={waLink} target="_blank" rel="noopener" className="flex btn-pill bg-[#25D366] hover:bg-[#20bd5a] text-white justify-center text-[15px]">💬 MESSAGE ON WHATSAPP</a>
          <a href={telLink} className="flex btn-pill bg-zinc-900 hover:bg-black text-white justify-center text-[15px]">📞 CALL SELLER</a>
          <p className="text-[11px] text-center text-zinc-500">Seller contact is shown directly. No chat history saved.</p>
        </div>

        <div className="card p-4">
          <button onClick={()=>setReporting(v=>!v)} className="text-xs font-semibold text-zinc-600 hover:text-zinc-900">⚠️ Report this Listing</button>
          {reporting && (
            <form onSubmit={submitReport} className="mt-3 space-y-3">
              <select value={reportReason} onChange={e=>setReportReason(e.target.value)} className="w-full h-11 rounded-xl border px-3 text-sm">
                <option>Scam or suspicious listing</option>
                <option>Wrong information</option>
                <option>Inappropriate content</option>
                <option>Item already sold</option>
                <option>Other</option>
              </select>
              <textarea value={reportDesc} onChange={e=>setReportDesc(e.target.value)} placeholder="Describe the issue (optional)" className="w-full min-h-[80px] rounded-xl border p-3 text-sm" />
              <button className="w-full h-11 rounded-full bg-zinc-900 text-white font-bold text-sm">Submit Report</button>
            </form>
          )}
          {reportSent && <p className="mt-2 text-sm text-green-700 bg-green-50 p-2 rounded-xl">Report submitted. Admin will review.</p>}
        </div>
      </div>
    </div>
  );
}
