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
