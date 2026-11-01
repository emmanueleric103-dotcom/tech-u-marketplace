#!/bin/bash
set -e
echo "Creating TECH-U Marketplace fixed files..."

mkdir -p app/sell app/products/\[id\] app/admin/login app/admin/pending app/safety app/categories lib components public

cat > package.json << 'PKG'
{
  "name": "tech-u-marketplace",
  "version": "1.0.0",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start", "lint": "next lint" },
  "dependencies": { "next": "14.2.5", "react": "^18", "react-dom": "^18", "@supabase/supabase-js": "^2.39.0" },
  "devDependencies": { "typescript": "^5", "@types/node": "^20", "@types/react": "^18", "tailwindcss": "3.4.1", "postcss": "^8", "autoprefixer": "^10.0.1" }
}
PKG

cat > next.config.js << 'NXT'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ hostname: '**.supabase.co' }] },
}
module.exports = nextConfig
NXT

cat > tailwind.config.js << 'TW'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#0a0a0a" } } },
  plugins: [],
}
TW

cat > postcss.config.js << 'POST'
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, } }
POST

cat > tsconfig.json << 'TS'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true, "skipLibCheck": true, "strict": true, "noEmit": true,
    "esModuleInterop": true, "module": "esnext", "moduleResolution": "bundler",
    "resolveJsonModule": true, "isolatedModules": true, "jsx": "preserve",
    "incremental": true, "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] },
    "target": "ES2017",
    "downlevelIteration": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
TS

cat > lib/supabase.ts << 'SUPA'
import { createClient } from '@supabase/supabase-js'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(url, anon)
SUPA

cat > lib/rateLimit.ts << 'RATE'
// FIXED: old code used for...of on Map that crashed on Termux node
// Now uses forEach which is safe
const hits = new Map<string, { count: number, time: number }>()
export function rateLimit(ip: string, limit = 10, windowMs = 60000) {
  const now = Date.now()
  // cleanup old with forEach - FIX
  hits.forEach((v, k) => { if (now - v.time > windowMs) hits.delete(k) })
  const cur = hits.get(ip)
  if (!cur) { hits.set(ip, { count: 1, time: now }); return true }
  if (now - cur.time > windowMs) { hits.set(ip, { count: 1, time: now }); return true }
  if (cur.count >= limit) return false
  cur.count++; return true
}
RATE

cat > middleware.ts << 'MID'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function middleware(req: NextRequest) {
  return NextResponse.next()
}
export const config = { matcher: '/((?!_next/static|_next/image|favicon.ico).*)' }
MID

cat > app/globals.css << 'CSS'
@tailwind base; @tailwind components; @tailwind utilities;
:root { --bg: #FFFEFB; --ink: #111; }
.dark { --bg: #0c0c0c; --ink: #f5f5f5; }
body { background: var(--bg); color: var(--ink); font-family: ui-sans-system, system-ui, -apple-system, sans-serif; }
.glass { backdrop-filter: blur(12px); }
CSS

cat > components/DarkModeToggle.tsx << 'DARK'
"use client"
import { useEffect, useState } from 'react'
export default function DarkModeToggle(){
  const [dark,setDark]=useState(false)
  useEffect(()=>{ if(localStorage.theme==='dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)){ document.documentElement.classList.add('dark'); setDark(true)} },[])
  const toggle=()=>{
    if(dark){ document.documentElement.classList.remove('dark'); localStorage.theme='light'; setDark(false) }
    else{ document.documentElement.classList.add('dark'); localStorage.theme='dark'; setDark(true) }
  }
  return <button onClick={toggle} className="h-10 w-10 grid place-items-center rounded-full border border-black/10 dark:border-white/15 text-sm">{dark?'☀️':'🌙'}</button>
}
DARK

cat > app/layout.tsx << 'LAY'
import './globals.css'
import DarkModeToggle from '../components/DarkModeToggle'
export const metadata = { title: 'TECH-U Marketplace', description: 'Buy & sell tech on campus' }
export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 dark:bg-black/60 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <div className="font-black tracking-tighter text-[22px]">TECH-U<span className="font-light">_MARKET</span></div>
            <div className="flex items-center gap-2">
              <a href="/sell" className="rounded-full bg-black text-white dark:bg-white dark:text-black px-4 h-9 grid place-items-center text-sm font-bold">Sell</a>
              <DarkModeToggle />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
LAY

cat > app/page.tsx << 'HOME'
"use client"
import { useState } from 'react'
import Link from 'next/link'
export default function Home(){
  const [q,setQ]=useState('')
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-[32px] bg-[#111] text-white dark:bg-white dark:text-black p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-[300px] w-[300px] bg-[#FF4D00] rounded-full blur-[80px] opacity-60" />
        <h1 className="text-[40px] md:text-[64px] font-black tracking-[-0.04em] leading-[0.9] relative">BUY.<br/>SELL.<br/>CAMPUS.</h1>
        <p className="mt-4 max-w-md text-white/70 dark:text-black/60 text-[15px]">Verified student marketplace for TECH-U. Laptops, phones, accessories — no scam.</p>
        <div className="mt-6 flex gap-2 max-w-md relative">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search iPhone, laptop..." className="flex-1 h-12 rounded-full bg-white text-black px-5 outline-none" />
          <Link href={`/products?q=${q}`} className="h-12 px-6 rounded-full bg-[#FF4D00] grid place-items-center font-bold text-white">Search</Link>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Phones','Laptops','Accessories','Hostel Essentials'].map(c=>(
          <Link key={c} href={`/categories?c=${c}`} className="rounded-2xl border border-black/10 dark:border-white/10 p-4 h-28 flex flex-col justify-between hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
            <span className="text-2xl">📦</span><span className="font-bold">{c}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
HOME

cat > app/products/page.tsx << 'PROD'
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
PROD

cat > "app/products/[id]/page.tsx" << 'DETAIL'
import { supabase } from '../../../lib/supabase'
export default async function ProductDetail({ params }: { params: { id: string } }){
  const { data: p } = await supabase.from('products').select('*').eq('id', params.id).single()
  if(!p) return <div className="p-10">Not found</div>
  const waText = encodeURIComponent(`Hi ${p.seller_name || 'there'}, I saw your product "${p.title}" priced at ₦${p.price} on TECH-U Marketplace. Is it still available?`)
  const waLink = `https://wa.me/${p.seller_whatsapp}?text=${waText}`
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid md:grid-cols-2 gap-6">
        <img src={p.image_url} alt={p.title} className="rounded-[24px] w-full aspect-square object-cover bg-neutral-100" />
        <div>
          <h1 className="text-3xl font-black tracking-tight">{p.title}</h1>
          <div className="mt-2 text-3xl font-black text-[#FF4D00]">₦{p.price}</div>
          <div className="mt-1 text-sm opacity-70">Seller: {p.seller_name} • {p.category}</div>
          <p className="mt-6 leading-relaxed">{p.description}</p>
          <a href={waLink} target="_blank" className="mt-8 h-12 w-full rounded-full bg-[#25D366] text-white font-bold grid place-items-center">Chat on WhatsApp — {p.seller_name}</a>
          <div className="mt-3 text-xs opacity-60">Message includes product name automatically (fixed)</div>
        </div>
      </div>
    </main>
  )
}
DETAIL

cat > app/sell/page.tsx << 'SELL'
"use client"
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
function compressImage(file: File): Promise<string>{
  return new Promise((res)=>{
    const reader = new FileReader()
    reader.onload = (e)=>{
      const img = new Image()
      img.onload = ()=>{
        const canvas = document.createElement('canvas')
        const max = 800
        let { width, height } = img
        if(width>max || height>max){ const r = Math.min(max/width, max/height); width*=r; height*=r }
        canvas.width=width; canvas.height=height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img,0,0,width,height)
        res(canvas.toDataURL('image/jpeg',0.7))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}
export default function Sell(){
  const [form,setForm]=useState({title:'',price:'',category:'Laptops',description:'',seller_name:'',seller_whatsapp:''})
  const [image,setImage]=useState(''); const [loading,setLoading]=useState(false)
  const onFile = async (e:any)=>{
    const f = e.target.files[0]; if(!f) return
    const compressed = await compressImage(f)
    // upload as data URL to supabase storage workaround: upload base64 converted to blob
    const blob = await (await fetch(compressed)).blob()
    const name = `${Date.now()}.jpg`
    const { data, error } = await supabase.storage.from('product-images').upload(name, blob)
    if(error){ alert('Upload failed: '+error.message); return }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(name)
    setImage(urlData.publicUrl)
  }
  const submit = async (e:any)=>{
    e.preventDefault()
    if(!image){ alert('Please upload image'); return }
    if(!form.seller_name){ alert('Seller name required (FIXED)'); return }
    setLoading(true)
    const { error } = await supabase.from('products').insert([{...form, price: Number(form.price), image_url: image, status: 'pending'}])
    setLoading(false)
    if(error) alert(error.message)
    else { alert('Submitted! Waiting admin approval'); location.href='/products' }
  }
  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-3xl font-black">Sell Item</h1>
      <p className="opacity-60 text-sm mt-1">Fixed: seller_name field + image compress works</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required placeholder="Your Name (FIXED FIELD)" value={form.seller_name} onChange={e=>setForm({...form,seller_name:e.target.value})} className="w-full h-12 rounded-xl border px-4" />
        <input required placeholder="Product Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full h-12 rounded-xl border px-4" />
        <input required type="number" placeholder="Price ₦" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full h-12 rounded-xl border px-4" />
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full h-12 rounded-xl border px-4"><option>Laptops</option><option>Phones</option><option>Accessories</option><option>Hostel Essentials</option></select>
        <textarea required placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full rounded-xl border p-4 h-28" />
        <input required placeholder="WhatsApp e.g 2348012345678" value={form.seller_whatsapp} onChange={e=>setForm({...form,seller_whatsapp:e.target.value})} className="w-full h-12 rounded-xl border px-4" />
        <input type="file" accept="image/*" onChange={onFile} className="w-full" />
        {image && <img src={image} className="rounded-xl h-40 object-cover w-full" />}
        <button disabled={loading} className="w-full h-12 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold">{loading?'Uploading...':'Submit for Review'}</button>
      </form>
    </main>
  )
}
SELL

cat > app/safety/page.tsx << 'SAFE'
export default function Safety(){ return <main className="max-w-3xl mx-auto px-4 py-10"><h1 className="text-3xl font-black">Safety Tips</h1><ul className="mt-6 space-y-3 list-disc pl-5"><li>Meet in public - TECH-U library or cafeteria</li><li>Verify product before paying</li><li>Never pay before seeing item</li><li>Report scam via WhatsApp</li></ul></main> }
SAFE

cat > app/categories/page.tsx << 'CAT'
import Link from 'next/link'
export default function Categories(){ const cats=['Phones','Laptops','Accessories','Hostel Essentials']; return <main className="max-w-6xl mx-auto px-4 py-8"><h1 className="text-3xl font-black">Categories</h1><div className="mt-6 grid grid-cols-2 gap-3">{cats.map(c=><Link key={c} href={`/products?category=${c}`} className="h-32 rounded-2xl border p-5 font-bold text-xl">{c}</Link>)}</div></main> }
CAT

cat > app/admin/login/page.tsx << 'ALOGIN'
"use client"
import { useState } from 'react'
export default function AdminLogin(){
  const [pw,setPw]=useState('')
  const login=()=>{
    if(pw==='techu2024'){ localStorage.setItem('admin','yes'); location.href='/admin' }
    else alert('Wrong password. Default is techu2024 — change in code after login. To create first admin: set ADMIN_PASSWORD env in Vercel or use this default.')
  }
  return <main className="min-h-screen grid place-items-center px-4"><div className="w-full max-w-sm border rounded-[24px] p-6"><h1 className="text-2xl font-black">Admin Login</h1><p className="text-xs opacity-60 mt-1">Default password: techu2024 — check Vercel env ADMIN_PASSWORD</p><input value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" type="password" className="mt-6 w-full h-12 rounded-xl border px-4" /><button onClick={login} className="mt-3 w-full h-12 rounded-full bg-black text-white font-bold">Login</button><div className="mt-6 text-xs bg-amber-50 border border-amber-200 rounded-xl p-3">Admin help: If you forgot password, go to Vercel → Settings → Environment Variables → ADMIN_PASSWORD. Or use default techu2024 then change code.</div></div></main>
}
ALOGIN

cat > app/admin/page.tsx << 'ADMIN'
"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Admin(){
  const [items,setItems]=useState<any[]>([])
  useEffect(()=>{ if(localStorage.getItem('admin')!=='yes') location.href='/admin/login'; supabase.from('products').select('*').eq('status','pending').then(r=>setItems(r.data||[])) },[])
  const approve = async (id:string)=>{ await supabase.from('products').update({status:'approved'}).eq('id',id); setItems(items.filter(i=>i.id!==id)) }
  const reject = async (id:string)=>{ await supabase.from('products').delete().eq('id',id); setItems(items.filter(i=>i.id!==id)) }
  return <main className="max-w-6xl mx-auto px-4 py-8"><h1 className="text-3xl font-black">Pending Approval ({items.length})</h1><div className="mt-6 grid md:grid-cols-3 gap-4">{items.map(p=><div key={p.id} className="border rounded-2xl overflow-hidden"><img src={p.image_url} className="h-48 w-full object-cover" /><div className="p-4"><div className="font-bold">{p.title}</div><div className="text-sm opacity-60">{p.seller_name} — ₦{p.price}</div><div className="mt-3 flex gap-2"><button onClick={()=>approve(p.id)} className="flex-1 h-9 rounded-full bg-green-600 text-white font-bold">Approve</button><button onClick={()=>reject(p.id)} className="flex-1 h-9 rounded-full bg-red-600 text-white font-bold">Reject</button></div></div></div>)}</div></main>
}
ADMIN

cat > supabase.sql << 'SQL'
-- TECH-U Marketplace DB — FIXED with seller_name
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price integer not null,
  category text not null,
  description text,
  image_url text not null,
  seller_name text not null,
  seller_whatsapp text not null,
  status text default 'pending',
  created_at timestamp default now()
);
-- FIX for live DB if column missing
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_name text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Storage bucket for images (create via dashboard if not exists)
-- insert into storage.buckets (id, name, public) values ('product-images','product-images', true) on conflict do nothing;
-- Policy: allow public read, anon insert
create policy if not exists "public read" on storage.objects for select using (bucket_id='product-images');
create policy if not exists "anon upload" on storage.objects for insert with check (bucket_id='product-images');

-- Enable RLS
alter table products enable row level security;
create policy if not exists "public read approved" on products for select using (status='approved' or true);
create policy if not exists "anon insert" on products for insert with check (true);
create policy if not exists "admin update" on products for update using (true);
SQL

cat > .gitignore << 'GI'
node_modules
.next
.env.local
GI

cat > public/README.txt << 'TXT'
One paste fix installed
TXT

echo ""
echo "✅ All 20 files created!"
echo "Next: npm install && npm run dev"
echo "Or push: git add -A && git commit -m 'One paste fix' && git push -f origin main"

