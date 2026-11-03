'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

function normalizeWA(num:string){
  let n=num.replace(/\D/g,'')
  if(n.startsWith('0')) n='62'+n.slice(1)
  if(!n.startsWith('62')) n='62'+n
  return n
}

export default function Sell(){
  const [form,setForm]=useState({title:'',price:'',category:'Laptops',condition:'Used',description:'',whatsapp:'',location:''})
  const [previews,setPreviews]=useState<string[]>([])
  const [base64s,setBase64s]=useState<string[]>([])
  const [uploading,setUploading]=useState(false)
  const [done,setDone]=useState(false)

  const handleFiles=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const files=Array.from(e.target.files||[]).slice(0,4)
    const np:string[]=[]; const nb:string[]=[]
    for(const f of files){
      np.push(URL.createObjectURL(f))
      const b=await new Promise<string>(r=>{const rd=new FileReader();rd.onload=()=>r(rd.result as string);rd.readAsDataURL(f)})
      nb.push(b)
    }
    setPreviews(np); setBase64s(nb)
  }

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault()
    if(!form.title||!form.price){alert('Title & price required');return}
    setUploading(true)
    try{
      const payload={title:form.title,price:Number(form.price),category:form.category,condition:form.condition,description:form.description,whatsapp:normalizeWA(form.whatsapp),location:form.location,images:base64s,created_at:new Date().toISOString()}
      const {error}=await supabase.from('products').insert([payload])
      if(error) throw error
      setDone(true); setForm({title:'',price:'',category:'Laptops',condition:'Used',description:'',whatsapp:'',location:''}); setPreviews([]); setBase64s([])
    }catch(err:any){alert('Failed: '+err.message)}finally{setUploading(false)}
  }

  if(done){
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
        <h1 className="text-2xl font-extrabold">Product Posted!</h1>
        <button onClick={()=>setDone(false)} className="mt-6 bg-[#5B21B6] text-white px-6 py-3 rounded-full font-bold w-full">Sell Another</button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto p-4 pb-24">
      <h1 className="text-xl font-extrabold">Sell Item</h1>
      <form onSubmit={submit} className="space-y-5 mt-4">
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="block w-full text-sm file:mr-3 file:bg-[#5B21B6] file:text-white file:px-4 file:py-2 file:rounded-full file:border-0" />
        <div className="grid grid-cols-4 gap-2">{previews.map((s,i)=>(<img key={i} src={s} className="h-20 object-cover rounded-xl border" alt="preview" />))}</div>
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full h-12 px-4 rounded-2xl border" />
        <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price (Rp)" type="number" className="w-full h-12 px-4 rounded-2xl border" />
        <div className="grid grid-cols-2 gap-3">
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="h-12 px-4 rounded-2xl border bg-white"><option>Laptops</option><option>Phones</option><option>Accessories</option><option>Gaming</option></select>
          <select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} className="h-12 px-4 rounded-2xl border bg-white"><option>New</option><option>Used</option><option>Refurbished</option></select>
        </div>
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" rows={4} className="w-full p-4 rounded-2xl border" />
        <input value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="WhatsApp" className="w-full h-12 px-4 rounded-2xl border" />
        <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Location" className="w-full h-12 px-4 rounded-2xl border" />
        <button disabled={uploading} className="w-full h-14 bg-[#5B21B6] text-white rounded-2xl font-extrabold">{uploading?'Posting...':'Post Product'}</button>
      </form>
    </div>
  )
}
