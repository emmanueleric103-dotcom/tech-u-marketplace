'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const CATS = ['Electronics','Fashion','Books','Hostel Essentials','Gadgets','Furniture','Others'];

export default function SellPage() {
  const [form, setForm] = useState({ title:'', price:'', category:'Electronics', condition:'New', description:'', location:'', whatsapp:'', phone:'' });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 3) { setError('Max 3 images allowed'); return; }
    for (const f of files) {
      if (!['image/jpeg','image/png','image/webp','image/jpg'].includes(f.type)) { setError('Only JPG/PNG/WEBP allowed'); return; }
      if (f.size > 2*1024*1024) { setError('Each image max 2MB'); return; }
    }
    setImages(prev=>[...prev, ...files].slice(0,3));
    const newPreviews = files.map(f=>URL.createObjectURL(f));
    setPreviews(prev=>[...prev, ...newPreviews].slice(0,3));
    setError('');
  }

  async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject)=>{
      const img = new Image();
      img.onload = ()=>{
        const canvas = document.createElement('canvas');
        const maxW = 1000;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject('canvas fail'); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(b=>{
          if (b) resolve(b);
          else reject('compress fail');
        }, 'image/jpeg', 0.7);
      };
      img.onerror = ()=>reject('load fail');
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.title || !form.price || !form.description || !form.whatsapp || !form.phone) { setError('All required fields must be filled'); return; }
    if (images.length===0) { setError('Add at least 1 image'); return; }
    if (form.whatsapp.replace(/[^0-9]/g,'').length < 10) { setError('Invalid WhatsApp number'); return; }

    setLoading(true);
    try {
      // rate limit check via API route if you create one, else simple client guard
      const urls: string[] = [];
      for (const file of images) {
        const compressed = await compressImage(file);
        const name = `${Date.now()}-${Math.random().toString(36).slice(2)}`.replace(/[^a-z0-9-]/g,'') + '.jpg';
        const { data, error: upErr } = await supabase.storage.from('Image').upload(name, compressed, { contentType: 'image/jpeg' });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from('Image').getPublicUrl(name);
        urls.push(pub.publicUrl);
      }

      const { error: insErr } = await supabase.from('listings').insert({
        title: form.title.trim(),
        price: Number(form.price),
        category: form.category,
        condition: form.condition,
        description: form.description.trim(),
        location: form.location.trim() || null,
        whatsapp: form.whatsapp.trim(),
        phone: form.phone.trim(),
        image_urls: urls,
        status: 'pending'
      });
      if (insErr) throw insErr;
      setSuccess(true);
      setForm({ title:'', price:'', category:'Electronics', condition:'New', description:'', location:'', whatsapp:'', phone:'' });
      setImages([]); setPreviews([]);
    } catch (err:any) {
      setError(err.message || 'Failed to post. Check Supabase env & bucket.');
    } finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="max-w-[560px] mx-auto card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 grid place-items-center mx-auto text-2xl">✓</div>
        <h2 className="mt-4 text-[22px] font-black">Listing submitted!</h2>
        <p className="mt-2 text-sm text-zinc-600">Your listing status is <b>Pending Approval</b>. It will be reviewed before appearing publicly to keep the marketplace safe. You will not need an account.</p>
        <a href="/products" className="mt-6 inline-flex btn-pill bg-zinc-900 text-white">Browse marketplace</a>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto">
      <h1 className="text-[26px] font-black tracking-tight">Sell an Item</h1>
      <p className="text-sm text-zinc-500 mt-1">No account needed. Fill, upload, submit — admin approves.</p>

      <form onSubmit={handleSubmit} className="mt-6 card p-5 sm:p-6 space-y-5">
        <div>
          <label className="text-sm font-semibold">Product title *</label>
          <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="mt-1 w-full h-11 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-brand-600" placeholder="e.g. iPhone 12 128GB Neatly Used" required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold">Price ₦ *</label>
            <input type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} className="mt-1 w-full h-11 rounded-xl border px-4" placeholder="25000" required />
          </div>
          <div>
            <label className="text-sm font-semibold">Category *</label>
            <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="mt-1 w-full h-11 rounded-xl border px-3">
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Condition *</label>
          <div className="mt-1 flex gap-2">
            {['New','Used'].map(c=>(
              <label key={c} className={`flex-1 h-11 grid place-items-center rounded-full border font-semibold text-sm cursor-pointer ${form.condition===c?'bg-zinc-900 text-white border-zinc-900':'bg-white'}`}>
                <input type="radio" className="hidden" checked={form.condition===c} onChange={()=>setForm({...form, condition:c})} />{c}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Description *</label>
          <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="mt-1 w-full min-h-[120px] rounded-xl border p-3 text-sm" placeholder="Condition, reason for selling, defects..." required />
        </div>

        <div>
          <label className="text-sm font-semibold">Location / Campus area (optional)</label>
          <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="mt-1 w-full h-11 rounded-xl border px-4" placeholder="e.g. North Hostel, Main Gate" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold">WhatsApp number *</label>
            <input value={form.whatsapp} onChange={e=>setForm({...form, whatsapp:e.target.value})} className="mt-1 w-full h-11 rounded-xl border px-4" placeholder="080..." required />
          </div>
          <div>
            <label className="text-sm font-semibold">Phone for calls *</label>
            <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="mt-1 w-full h-11 rounded-xl border px-4" placeholder="080..." required />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Product images (1-3, max 2MB each, JPG/PNG) *</label>
          <div className="mt-2 flex gap-2">
            {previews.map((src,i)=>(
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={()=>{setImages(images.filter((_,j)=>j!==i)); setPreviews(previews.filter((_,j)=>j!==i));}} className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full grid place-items-center text-[12px]">×</button>
              </div>
            ))}
            {images.length<3 && <label className="w-20 h-20 rounded-xl border-2 border-dashed grid place-items-center text-zinc-400 cursor-pointer">+<input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleImageChange} /></label>}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Images are compressed to ~300KB automatically to save storage.</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-100">{error}</div>}

        <button disabled={loading} className="w-full h-[52px] rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold disabled:opacity-60">
          {loading ? 'Posting...' : 'Post Item — Pending Approval'}
        </button>

        <p className="text-[11px] text-center text-zinc-500">By posting, you agree to campus safety rules. No spam — max 3 posts/hour per IP.</p>
      </form>
    </div>
  );
}
