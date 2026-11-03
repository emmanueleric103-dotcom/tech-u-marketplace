// app/page.tsx - COMPACT HERO + REAL LISTINGS
import { supabase } from './lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false}).limit(12)
  return (
    <div className="max-w-7xl mx-auto">
      {/* HERO - 220 mobile / 320 desktop compact */}
      <div className="mx-4 mt-3 rounded-[20px] overflow-hidden relative h-[260px] md:h-[320px] bg-[#1E1B4B]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B4B]/90 via-[#1E1B4B]/70 to-[#5B21B6]/30" />
        <div className="relative h-full p-5 md:p-8 flex flex-col justify-center max-w-[560px]">
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur text-white text-[11px] font-bold px-3 py-1 rounded-full w-fit">🎓 TECH-U Community</span>
          <h1 className="mt-3 text-[24px] md:text-[36px] font-extrabold leading-[0.95] tracking-tight text-white">
            Buy Smart. Sell Easy.<br/><span className="text-[#FACC15] underline decoration-[#FACC15] decoration-4 underline-offset-4">Campus Connected.</span>
          </h1>
          <p className="mt-2 text-white/80 text-[13px] leading-snug line-clamp-2 max-w-[320px]">The official marketplace for TECH-U community — buying and selling within campus.</p>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 h-11 bg-white rounded-full flex items-center px-4 gap-2">
              <span>🔍</span><input placeholder="Search for items..." className="flex-1 outline-none text-sm"/>
              <button className="h-8 px-4 rounded-full bg-[#5B21B6] text-white text-xs font-bold">Search</button>
            </div>
          </div>
          <a href="/sell" className="mt-3 w-fit px-5 py-2.5 rounded-full bg-[#7C3AED] text-white text-sm font-bold flex items-center gap-2">✈️ Sell an Item</a>
        </div>
      </div>

      {/* BROWSE CATEGORIES */}
      <section id="categories" className="mt-5 px-4">
        <div className="flex items-center justify-between"><h2 className="font-extrabold flex items-center gap-2"><span className="w-6 h-6 rounded bg-gray-100 grid place-items-center">◫</span>Browse by Category</h2><a className="text-[#5B21B6] text-xs font-bold" href="/categories">See All</a></div>
        <div className="mt-3 flex md:grid md:grid-cols-8 gap-3 overflow-x-auto scrollbar-hide pb-2">
          {['Electronics','Phones','Fashion','Books','Home','Vehicles','Sports','More'].map(c=>(
            <div key={c} className="min-w-[80px] md:min-w-0 rounded-2xl bg-gray-50 p-3 text-center border border-gray-100">
              <div className="w-8 h-8 mx-auto bg-white rounded-full grid place-items-center">📦</div>
              <div className="mt-2 text-[11px] font-bold">{c}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED + LATEST - 2 col mobile */}
      <section className="mt-5 px-4">
        <h2 className="font-extrabold">Featured Listings</h2>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products?.map(p=>(
            <Link key={p.id} href={`/products/${p.id}`} className="rounded-[16px] overflow-hidden bg-white border border-gray-100 shadow-sm">
              <div className="h-[140px] bg-gray-100 relative"><img src={p.image_url} alt={p.title} className="w-full h-full object-cover"/><span className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full bg-[#5B21B6] text-white">Available</span></div>
              <div className="p-3"><div className="text-[13px] font-bold line-clamp-2 leading-tight">{p.title}</div><div className="mt-1 text-sm font-extrabold text-[#5B21B6]">₦{p.price?.toLocaleString()}</div><div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">📍 TECH-U Campus • <span className="text-green-600">● Available</span></div><div className="mt-2 text-[11px] font-bold text-[#5B21B6]">View details →</div></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

