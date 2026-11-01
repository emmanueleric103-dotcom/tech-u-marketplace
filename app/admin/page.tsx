'use client'

function normalizeWA(num: string){
  if(!num) return ''
  let n = num.replace(/\D/g,'')
  if(n.startsWith('0')){ n = '234' + n.slice(1) }
  else if(n.startsWith('234')){ }
  else if(n.length===10){ n = '234' + n }
  else if(n.length===11 && n.startsWith('0')){ n = '234' + n.slice(1) }
  return n
}

export default function AdminPage(){
  const products = [
    { id: 1, title: 'Demo Item', whatsapp: '08100145906', phone: '08100145906' }
  ]

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Admin - Products</h1>
      <div className="space-y-3">
        {products.map(p=> {
          const wa = normalizeWA(p.whatsapp || p.phone)
          return (
            <div key={p.id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{p.title}</p>
                <p className="text-xs opacity-60">{p.whatsapp} → {wa}</p>
              </div>
              <a href={`https://wa.me/${wa}`} target="_blank" className="text-xs bg-black text-white px-4 py-2 rounded-full">WhatsApp</a>
            </div>
          )
        })}
      </div>
    </main>
  )
}
