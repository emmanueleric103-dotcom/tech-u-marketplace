import { createServerSupabase } from '@/lib/supabase'
import Link from 'next/link'

// Jiji style WhatsApp contact link required: https://wa.me/{whatsapp}?text=Hi
// Real implementation uses product.whatsapp dynamically
export default async function ProductDetail({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single()

  if (!product) return <div className="p-10 text-center">Product not found - check real DB id</div>

  const waText = encodeURIComponent(`Hi, I'm interested in ${product.title} on TECH-U Marketplace`)
  const waLink = `https://wa.me/${product.whatsapp}?text=${waText}`
  // Example pattern for spec: https://wa.me/{whatsapp}?text=Hi

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center">
          {product.images?.[0] ? <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" /> : <span className="text-zinc-400">No image</span>}
        </div>
        <div className="flex gap-2 p-2">
          {product.images?.slice(1).map((img:string,i:number)=>(<img key={i} src={img} className="w-20 h-20 rounded-xl object-cover border" alt="" />))}
        </div>
      </div>
      <div className="bg-white border rounded-2xl p-6">
        <h1 className="text-2xl font-black">{product.title}</h1>
        <p className="text-2xl text-green-600 font-bold mt-2">₦{Number(product.price).toLocaleString()}</p>
        <div className="flex gap-2 mt-3 text-xs"><span className="border px-2 py-1 rounded-full">{product.condition}</span><span className="border px-2 py-1 rounded-full">{product.category}</span></div>
        <p className="mt-4 text-sm text-zinc-600 whitespace-pre-wrap">{product.description}</p>
        <p className="mt-4 text-sm"><span className="text-zinc-500">Pickup:</span> {product.pickup_location}</p>
        <a href={waLink} target="_blank" className="mt-6 block text-center bg-[#25D366] text-white font-bold py-3 rounded-full hover:opacity-90">Chat on WhatsApp (Jiji style)</a>
        <Link href="/products" className="mt-3 block text-center border py-2.5 rounded-full">Back to products</Link>
      </div>
    </div>
  )
}
