'use client'
import { useState } from 'react'

function normalizeWA(num: string){
  if(!num) return ''
  let n = num.replace(/\D/g,'')
  if(n.startsWith('0')){ n = '234' + n.slice(1) }
  else if(n.startsWith('234')){ /* already */ }
  else if(n.length===10){ n = '234' + n }
  else if(n.length===11 && n.startsWith('0')){ n = '234' + n.slice(1) }
  return n
}

export default function SellPage(){
  const [whatsapp, setWhatsapp] = useState('')
  const [phone, setPhone] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const normalizedWA = normalizeWA(whatsapp)
    const normalizedPhone = phone ? normalizeWA(phone) : normalizedWA
    
    // TODO: replace with your supabase insert
    // await supabase.from('products').insert({
    //   title,
    //   whatsapp: normalizedWA,
    //   phone: normalizedPhone,
    //   seller_whatsapp: normalizedWA
    // })
    
    console.log('Saving normalized:', { whatsapp: normalizedWA, phone: normalizedPhone })
    setTimeout(()=>{ setLoading(false); setDone(true); }, 800)
  }

  const waPreview = whatsapp ? normalizeWA(whatsapp) : ''

  return (
    <main className="max-w-md mx-auto p-4 pt-10">
      <h1 className="text-2xl font-bold mb-6">Sell Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Product title" className="w-full border rounded-lg px-3 py-2.5" required />
        <div>
          <input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="WhatsApp e.g. 08100145906 - auto adds +234" className="w-full border rounded-lg px-3 py-2.5" required />
          <p className="text-[11px] mt-1.5 text-neutral-500 leading-snug">If you type 0810..., we auto convert to +234810... for WhatsApp</p>
          {waPreview && <p className="text-[11px] mt-1 text-green-600 font-mono">✓ Will save as: {waPreview} → wa.me/{waPreview}</p>}
        </div>
        <button disabled={loading} className="w-full bg-black text-white rounded-full py-3.5 text-[14px] font-medium">
          {loading ? 'Posting...' : done ? 'Posted ✓' : 'Post Product'}
        </button>
      </form>
    </main>
  )
}
