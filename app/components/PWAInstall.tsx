'use client'
import { useState, useEffect } from 'react'
export default function PWAInstall(){
  const [deferred,setDeferred]=useState<any>(null)
  const [show,setShow]=useState(false)
  useEffect(()=>{
    if('serviceWorker' in navigator){ navigator.serviceWorker.register('/sw.js').then(()=>console.log('SW registered')).catch(console.error) }
    const handler=(e:any)=>{ e.preventDefault(); setDeferred(e); setShow(true) }
    window.addEventListener('beforeinstallprompt', handler)
    return ()=>window.removeEventListener('beforeinstallprompt', handler)
  },[])
  if(!show) return null
  return (
    <button onClick={async()=>{ if(deferred){deferred.prompt(); const {outcome}=await deferred.userChoice; if(outcome==='accepted') setShow(false); setDeferred(null)}}} className="fixed bottom-[80px] left-1/2 -translate-x-1/2 bg-[#1E1B4B] text-white px-5 py-2.5 rounded-full text-[13px] font-bold shadow-lg z-[60] flex items-center gap-2">📲 Install TECH-U App</button>
  )
}
