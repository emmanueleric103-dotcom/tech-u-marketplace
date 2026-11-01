'use client'
import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
export const dynamic = 'force-dynamic'

export default function SellPage() {
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Phones')
  const [location, setLocation] = useState('Lagos')
  const [desc, setDesc] = useState('')
  const [seller, setSeller] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // INSTANT PREVIEW - NO AWAIT, NO COMPRESS BEFORE STATE
  const handleFiles = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming).filter(f => f.type.startsWith('image/'))
    if(arr.length === 0) return
    const newPreviews = arr.map(f => URL.createObjectURL(f)) // synchronous!
    setPreviews(p => [...p, ...newPreviews].slice(0,6))
    setFiles(f => [...f, ...arr].slice(0,6))
  }

  const removeAt = (i:number) => {
    URL.revokeObjectURL(previews[i])
    setPreviews(p => p.filter((_,idx)=> idx!==i))
    setFiles(f => f.filter((_,idx)=> idx!==i))
  }

  const onSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    // VALIDATE PREVIEWS NOT OLD URLS
    if(previews.length === 0){
      alert('Please upload image - add at least 1 photo (JPG, WEBP, PNG)')
      return
    }
    if(!title || !price){ alert('Title & Price required'); return }
    setLoading(true)
    try{
      const uploadedUrls: string[] = []
      for(const file of files){
        const name = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g,'')
        const { error } = await supabase.storage.from('Image').upload(name, file)
        if(error) throw error
        const { data } = supabase.storage.from('Image').getPublicUrl(name)
        uploadedUrls.push(data.publicUrl)
      }
      const { error: dbErr } = await supabase.from('products').insert({
        title, price: Number(price), category, location,
        description: desc, seller_name: seller, phone,
        image_url: uploadedUrls[0],
        images: uploadedUrls,
      })
      if(dbErr) throw dbErr
      alert('Posted! Check homepage')
      setPreviews([]); setFiles([]); setTitle(''); setPrice('')
    }catch(err:any){
      alert('Upload failed: '+ err.message)
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-4 md:p-8">
      <div className="max-w-[720px] mx-auto">
        {/* Steps */}
        <div className="flex gap-2 mb-6">
          {['Details','Photos','Contact'].map((s,i)=>(
            <div key={s} className={`flex-1 h-2 rounded-full ${i<=1?'bg-emerald-500':'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
        <div className="rounded-[24px] bg-white dark:bg-[#0F172A] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="h-[96px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 flex items-end">
            <h1 className="text-white text-[24px] font-bold tracking-tight">Sell Faster on Tech-U</h1>
          </div>
          <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-6">
            {/* Floating inputs */}
            <div className="relative">
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder=" " className="peer w-full h-[56px] rounded-[14px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 pt-4 outline-none focus:border-emerald-500" />
              <label className="absolute left-4 top-2 text-[11px] uppercase tracking-widest text-slate-400 peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-[14px] transition-all">What are you selling? *</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-4 top-[18px] text-slate-500 font-bold">₦</span>
                <input value={price} onChange={e=>setPrice(e.target.value)} placeholder=" " type="number" className="peer w-full h-[56px] rounded-[14px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-8 pr-4 pt-4 outline-none focus:border-emerald-500" />
                <label className="absolute left-8 top-2 text-[11px] uppercase tracking-widest text-slate-400 peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-[14px] transition-all">Price *</label>
              </div>
              <select value={category} onChange={e=>setCategory(e.target.value)} className="h-[56px] rounded-[14px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4">
                <option>Phones</option><option>Laptops</option><option>Accessories</option><option>Gadgets</option>
              </select>
            </div>

            {/* DRAG & DROP ZONE - BEAUTIFUL */}
            <div>
              <p className="text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-3">Photos • {previews.length}/6 • JPG WEBP PNG instant</p>
              <div
                onDragOver={e=>{e.preventDefault(); setDragOver(true)}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={e=>{e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files)}}
                onClick={()=>inputRef.current?.click()}
                className={`group cursor-pointer rounded-[20px] border-2 border-dashed p-8 text-center transition-all ${dragOver?'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 scale-[1.01]':'border-slate-300 dark:border-slate-700 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white grid place-items-center mb-3 group-hover:scale-110 transition">+</div>
                <p className="font-semibold">Tap or drag images here</p>
                <p className="text-sm text-slate-500 mt-1">JPG, WEBP, PNG - previews instantly, no waiting</p>
                <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={e=> e.target.files && handleFiles(e.target.files)} />
              </div>

              {/* INSTANT THUMBNAILS */}
              {previews.length>0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {previews.map((src,i)=>(
                    <div key={src} className="relative aspect-square rounded-[16px] overflow-hidden bg-slate-100 dark:bg-slate-800 group">
                      <img src={src} alt={"preview "+i} className="w-full h-full object-cover" />
                      <button type="button" onClick={()=>removeAt(i)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white grid place-items-center hover:bg-red-500">✕</button>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">{files[i]?.type.split('/')[1]?.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe condition, specs, warranty..." className="w-full min-h-[110px] rounded-[14px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 outline-none focus:border-emerald-500" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={seller} onChange={e=>setSeller(e.target.value)} placeholder="Your name" className="h-[56px] rounded-[14px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 outline-none focus:border-emerald-500" />
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="WhatsApp number" className="h-[56px] rounded-[14px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 outline-none focus:border-emerald-500" />
            </div>

            <button disabled={loading} className="w-full h-[56px] rounded-[14px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[16px] tracking-wide shadow-[0_10px_20px_-10px_rgba(16,185,129,0.6)] disabled:opacity-50">
              {loading ? 'Uploading to Image bucket...' : 'Post Now • '+previews.length+' photos ready'}
            </button>
            <p className="text-center text-[11px] text-slate-400">Validation checks previews.length — never old uploaded URLs</p>
          </form>
        </div>
      </div>
    </div>
  )
}

