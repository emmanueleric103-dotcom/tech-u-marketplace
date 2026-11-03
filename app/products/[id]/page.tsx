'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
function normalizeWA(num:string){if(!num)return'';let s=String(num).replace(/[^0-9]/g,'');if(s.startsWith('0'))s='234'+s.slice(1);if(s.startsWith('+'))s=s.slice(1);return s}
export default function ProductDetail(){
  const params=useParams();const id=params?.id as string
  const [product,setProduct]=useState<any>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState('')
  useEffect(()=>{
    const fetchProduct=async()=>{
      if(!id){setError('No ID');setLoading(false);return}
      try{
        const {data,error}=await supabase.from('products').select('*').eq('id',id).maybeSingle()
        if(error){setError(error.message)}else if(!data){setError('Product not found')}else{setProduct(data)}
      }catch(e:any){setError(e.message||'Failed')}
      finally{setLoading(false)}
    }
    fetchProduct()
  },[id])
  if(loading){return <div className="min-h-screen bg-white p-6 pb-24"><div className="max-w-[600px] mx-auto"><div className="text-[14px]">Loading...</div><div className="mt-4 h-64 bg-gray-100 rounded-2xl animate-pulse"></div></div></div>}
  if(error||!product){return <div className="min-h-screen bg-white p-6 pb-24"><div className="max-w-[600px] mx-auto text-center pt-20"><div className="text-[16px] font-bold">Product not found</div><div className="text-[12px] text-gray-500 mt-2">{error}</div><Link href="/" className="inline-block mt-6 bg-[#5B21B6] text-white rounded-full px-6 py-3 text-[13px] font-bold">Back to Home</Link></div></div>}
  const waNorm=normalizeWA(product.whatsapp_number||product.whatsapp||'');const callNorm=normalizeWA(product.call_number||'');const images=product.images&&Array.isArray(product.images)&&product.images.length>0?product.images:[product.image_url].filter(Boolean);const waMessage=`Hi! I saw ${product.title} (₦${product.price}) on TECH-U Marketplace. Is it still available?`;const waLink=waNorm?`https://wa.me/${waNorm}?text=${encodeURIComponent(waMessage)}`:''
  return (
    <div className="min-h-screen bg-white pb-24"><div className="max-w-[600px] mx-auto"><div className="px-4 pt-4 flex items-center gap-2"><Link href="/" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">←</Link><span className="text-[13px] text-gray-500">Back</span></div><div className="mt-4 px-4"><div className="rounded-2xl overflow-hidden bg-gray-100 h-[320px]"><img src={images[0]||'https://via.placeholder.com/400'} alt="" className="w-full h-full object-cover" /></div></div><div className="px-4 mt-5"><div className="flex justify-between"><h1 className="text-[18px] font-bold flex-1">{product.title}</h1><span className="bg-[#5B21B6] text-white text-[10px] px-2 py-1 rounded-full">{product.condition||'New'}</span></div><div className="text-[20px] font-extrabold text-[#5B21B6] mt-1">₦{product.price}</div><div className="text-[12px] text-gray-500 mt-2">📍 {product.location||product.campus_location||'Campus'} • 📦 {product.category}</div><div className="mt-5"><h3 className="text-[13px] font-bold">Description</h3><p className="text-[13px] text-gray-600 mt-2 whitespace-pre-wrap">{product.description}</p></div><div className="mt-6 flex gap-3">{waLink&&<a href={waLink} target="_blank" className="flex-1 bg-[#25D366] text-white rounded-full h-12 flex items-center justify-center gap-2 text-[13px] font-bold">💬 WhatsApp</a>}{callNorm&&<a href={`tel:+${callNorm}`} className="flex-1 bg-[#5B21B6] text-white rounded-full h-12 flex items-center justify-center gap-2 text-[13px] font-bold">📞 Call</a>}</div></div></div></div>
  )
}
