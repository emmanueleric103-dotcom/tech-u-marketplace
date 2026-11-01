import { supabase } from '../../lib/supabase'
import Link from 'next/link'
export default async function Products({ searchParams }: any){
  const q = searchParams?.q || ''
  let query = supabase.from('products').select('*').order('created_at',{ascending:false}).eq('status','approved')
  if(q) query = query.ilike('title', `%${q}%`)
  const { data } = await query
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-black">All Products {q && `for "${q}"`}</h1>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {(data||[]).map((p:any)=>(
          <Link key={p.id} href={`/products/${p.id}`} className="rounded-2xl border border-black/10 overflow-hidden">
            <img src={p.image_url} alt={p.title} className="aspect-square object-cover w-full" />
            <div className="p-3"><div className="font-bold truncate">{p.title}</div><div className="text-[#FF4D00] font-black">₦{p.price}</div><div className="text-xs opacity-60">{p.seller_name || 'Student'}</div></div>
          </Link>
        ))}
      </div>
    </main>
  )
}
