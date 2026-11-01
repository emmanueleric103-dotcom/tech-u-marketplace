'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

function normalizeWA(input: string) {
  if (!input) return ''
  let n = input.replace(/[^\d+]/g, '').trim()
  if (n.startsWith('+')) n = n.slice(1)
  if (n.startsWith('0')) return '234' + n.slice(1)
  if (n.startsWith('234')) return n
  if (n.length === 10) return '234' + n
  return n
}

const categories = ['electronics','phones','laptops','accessories','fashion','books','furniture']
const campuses = ['TECH-U Main Campus','TECH-U North Gate','TECH-U South Hostel','Ibadan Main','Oyo Town']

export default function SellPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState({
    title:'', price:'', category:'electronics', condition:'Used',
    description:'', location: campuses[0], seller_name:'', whatsapp:'', phone:''
  })

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3 - images.length)
    for (const file of files) {
      const base64 = await new Promise<string>((res) => {
        const reader = new FileReader()
        reader.onload = () => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const max = 800
            let { width, height } = img
            if (width > max || height > max) {
              const r = Math.min(max/width, max/height)
              width *= r; height *= r
            }
            canvas.width = width; canvas.height = height
            canvas.getContext('2d')?.drawImage(img,0,0,width,height)
            res(canvas.toDataURL('image/jpeg', 0.7))
          }
          img.src = reader.result as string
        }
        reader.readAsDataURL(file)
      })
      setImages(p => [...p, base64].slice(0,3))
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const waNormalized = normalizeWA(form.whatsapp)
      const { data, error } = await supabase.from('products').insert([{
        title: form.title,
        price: Number(form.price),
        category: form.category,
        condition: form.condition,
        description: form.description,
        pickup_location: form.location,
        seller_name: form.seller_name,
        whatsapp: waNormalized,
        phone: form.phone,
        images,
        status: 'pending',
        views: 0
      }]).select().single()
      if (error) throw error
      router.push(`/products/${data.id}`)
    } catch (err:any) { alert(err.message) }
    finally { setLoading(false) }
  }

  const waPreview = form.whatsapp ? normalizeWA(form.whatsapp) : ''

  return (
    <div className="min-h-screen bg-[#f8faf7] dark:bg-[#0a0f0a] p-4 md:p-8">
      <div className="max-w-[720px] mx-auto">
        <div className="bg-white dark:bg-[#151a15] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-black/[0.04] p-6 md:p-8">
          <h1 className="text-[28px] font-black tracking-tight">Sell Product</h1>
          <p className="text-[13px] text-black/50 dark:text-white/50 mt-1">Full beautiful form restored</p>
          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            {/* Images */}
            <div>
              <label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Images (max 3)</label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {images.map((src,i)=>(
                  <div key={i} className="relative rounded-[16px] overflow-hidden aspect-square bg-black/5">
                    <img src={src} className="w-full h-full object-cover" />
                    <button type="button" onClick={()=>setImages(images.filter((_,j)=>j!==i))} className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white rounded-full">×</button>
                  </div>
                ))}
                {images.length<3 && (
                  <label className="aspect-square rounded-[16px] border-2 border-dashed border-green-500/30 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/10">
                    <span className="text-2xl">+</span><span className="text-[11px] font-bold">Add Photo</span>
                    <input type="file" accept="image/*" multiple hidden onChange={handleImages} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Product title</label>
                <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. iPhone 13 128GB Neat" className="mt-2 w-full h-[48px] px-4 rounded-[14px] bg-[#f3f5f3] dark:bg-white/[0.06] border border-black/5 outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Price (₦)</label>
                <input required type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="85000" className="mt-2 w-full h-[48px] px-4 rounded-[14px] bg-[#f3f5f3] dark:bg-white/[0.06] border border-black/5 outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Category</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-2 w-full h-[48px] px-4 rounded-[14px] bg-[#f3f5f3] dark:bg-white/[0.06] border border-black/5">
                  {categories.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Condition</label>
                <select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} className="mt-2 w-full h-[48px] px-4 rounded-[14px] bg-[#f3f5f3] dark:bg-white/[0.06] border border-black/5">
                  <option>Used</option><option>New</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Pickup location</label>
                <select value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="mt-2 w-full h-[48px] px-4 rounded-[14px] bg-[#f3f5f3] dark:bg-white/[0.06] border border-black/5">
                  {campuses.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Description</label>
                <textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe condition, defects, reason for selling..." rows={4} className="mt-2 w-full p-4 rounded-[14px] bg-[#f3f5f3] dark:bg-white/[0.06] border border-black/5 outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Seller name</label>
                <input required value={form.seller_name} onChange={e=>setForm({...form,seller_name:e.target.value})} placeholder="Your name" className="mt-2 w-full h-[48px] px-4 rounded-[14px] bg-[#f3f5f3] dark:bg-white/[0.06] border border-black/5" />
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Phone</label>
                <input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="080..." className="mt-2 w-full h-[48px] px-4 rounded-[14px] bg-[#f3f5f3] dark:bg-white/[0.06] border border-black/5" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[12px] font-bold uppercase tracking-widest opacity-60">WhatsApp</label>
                <input required value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="WhatsApp e.g. 08100145906 - auto adds +234" className="mt-2 w-full h-[48px] px-4 rounded-[14px] bg-[#f3f5f3] dark:bg-white/[0.06] border border-black/5 outline-none focus:ring-2 focus:ring-green-500" />
                <p className="mt-2 text-[11px] text-black/50 dark:text-white/50">If you type 0810..., we auto convert to +234810... for WhatsApp</p>
                {waPreview && <p className="mt-1 text-[12px] font-bold text-green-600">✓ Will save as: {waPreview}</p>}
              </div>
            </div>
            <button disabled={loading} className="w-full h-[54px] rounded-[16px] bg-[#0a7a2e] text-white font-black text-[15px] tracking-wide hover:bg-[#095a24] disabled:opacity-60">
              {loading ? 'Posting...' : 'Post Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

