'use client'
import { useEffect, useState } from 'react'

function normalizeWA(num: string){
  if(!num) return ''
  let n = num.replace(/\D/g,'')
  if(n.startsWith('0')){ n = '234' + n.slice(1) }
  else if(n.startsWith('234')){ }
  else if(n.length===10){ n = '234' + n }
  else if(n.length===11 && n.startsWith('0')){ n = '234' + n.slice(1) }
  return n
}

export default function ProductPage({ params }: { params: { id: string } }){
  const [p, setP] = useState<any>(null)
  
  useEffect(()=>{
    // fetch product by id - mock for example
    setP({ id: params.id, title: 'Test Product', whatsapp: '08100145906', price: 5000 })
  },[params.id])

  if(!p) return <div className="p-6">Loading...</div>

  const waNumber = normalizeWA(p.whatsapp || p.seller_whatsapp || p.phone)
  const waLink = `https://wa.me/${waNumber}?text=Hi,%20I%27m%20interested%20in%20${encodeURIComponent(p.title)}`

  return (
    <main className="max-w-md mx-auto p-4 pt-10">
      <h1 className="text-xl font-bold">{p.title}</h1>
      <p className="mt-2 text-sm opacity-70">Seller number raw: {p.whatsapp} → normalized: +{waNumber}</p>
      <a href={waLink} target="_blank" className="mt-6 inline-flex w-full justify-center bg-[#25D366] text-white rounded-full py-3.5 font-medium">
        WhatsApp Seller
      </a>
    </main>
  )
}
