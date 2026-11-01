'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isRateLimited } from '@/lib/rateLimit'

export default function ProductDetail() {
  const { id } = useParams() as { id:string }
  const [p, setP] = useState<any>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single().then(({data})=> setP(data))
  }, [id])

  const handleReport = async () => {
    if (isRateLimited('report_'+id, 3, 60*60*1000)) { setMsg('Too many reports. Try later'); return }
    if (!reason) return
    const { error } = await supabase.from('reports').insert({ product_id: id, reason })
    if (!error) { setMsg('Reported. Admin will review.'); setReportOpen(false); setReason('') }
  }

  if (!p) return <div className="p-6">Loading...</div>

  const waLink = `https://wa.me/${p.seller_whatsapp?.replace(/[^0-9]/g,'')}?text=Hi%20I%20want%20${encodeURIComponent(p.title)}`

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="tech-card p-2">
        <div className="aspect-square bg-zinc-100 rounded-xl overflow-hidden">
          {p.images?.[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover"/> : <div className="h-full grid place-items-center text-zinc-400">No image</div>}
        </div>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {p.images?.slice(1,5).map((img:string,i:number)=>(<img key={i} src={img} alt="" className="aspect-square object-cover rounded-lg bg-zinc-100"/>))}
        </div>
      </div>
      <div>
        <div className="flex gap-2 items-start">
          <h1 className="text-2xl font-black flex-1">{p.title}</h1>
          {p.status==='sold' && <span className="bg-black text-white text-xs px-3 py-1 rounded-full">SOLD</span>}
          <span className="bg-zinc-100 px-3 py-1 rounded-full text-xs">{p.category}</span>
        </div>
        <div className="mt-2 text-3xl font-black text-[#16a34a]">₦{p.price?.toLocaleString()}</div>
        <div className="text-sm text-zinc-500 mt-1">{p.condition} • {new Date(p.created_at).toLocaleDateString()}</div>
        <p className="mt-4 text-zinc-700 leading-relaxed whitespace-pre-wrap">{p.description}</p>

        <div className="mt-6 tech-card p-4">
          <div className="font-semibold">Seller: {p.seller_name}</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a href={waLink} target="_blank" className="tech-btn text-center">WhatsApp</a>
            <a href={`tel:${p.seller_phone}`} className="bg-zinc-900 text-white px-5 py-3 rounded-xl text-center font-semibold">Call</a>
          </div>
          <button onClick={()=>setReportOpen(!reportOpen)} className="mt-3 text-xs text-red-600 underline">Report this product</button>
          {reportOpen && (
            <div className="mt-3 border-t pt-3">
              <select value={reason} onChange={e=>setReason(e.target.value)} className="tech-input">
                <option value="">Select reason</option>
                <option>Scam / Fraud</option>
                <option>Wrong price / Duplicate</option>
                <option>Prohibited item</option>
                <option>Other</option>
              </select>
              <button onClick={handleReport} className="mt-2 w-full bg-red-600 text-white py-2 rounded-xl text-sm">Submit report</button>
            </div>
          )}
          {msg && <div className="mt-2 text-sm text-[#16a34a]">{msg}</div>}
        </div>
      </div>
    </div>
  )
}
