import { supabase } from '../../../lib/supabase'
export default async function ProductDetail({ params }: { params: { id: string } }){
  const { data: p } = await supabase.from('products').select('*').eq('id', params.id).single()
  if(!p) return <div className="p-10">Not found</div>
  const waText = encodeURIComponent(`Hi ${p.seller_name || 'there'}, I saw your product "${p.title}" priced at ₦${p.price} on TECH-U Marketplace. Is it still available?`)
  const waLink = `https://wa.me/${p.seller_whatsapp}?text=${waText}`
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid md:grid-cols-2 gap-6">
        <img src={p.image_url} alt={p.title} className="rounded-[24px] w-full aspect-square object-cover bg-neutral-100" />
        <div>
          <h1 className="text-3xl font-black tracking-tight">{p.title}</h1>
          <div className="mt-2 text-3xl font-black text-[#FF4D00]">₦{p.price}</div>
          <div className="mt-1 text-sm opacity-70">Seller: {p.seller_name} • {p.category}</div>
          <p className="mt-6 leading-relaxed">{p.description}</p>
          <a href={waLink} target="_blank" className="mt-8 h-12 w-full rounded-full bg-[#25D366] text-white font-bold grid place-items-center">Chat on WhatsApp — {p.seller_name}</a>
          <div className="mt-3 text-xs opacity-60">Message includes product name automatically (fixed)</div>
        </div>
      </div>
    </main>
  )
}
