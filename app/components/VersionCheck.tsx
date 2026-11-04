'use client'
import { useEffect, useState } from 'react'
export default function VersionCheck(){
  const [needs,setNeeds]=useState(false)
  useEffect(()=>{
    (window as any).__APP_VERSION__='v7'
    fetch('/api/version',{cache:'no-store'}).then(r=>r.json()).then(v=>{
      if(v.minRequired && v.minRequired!=='v7') setNeeds(true)
      if('serviceWorker' in navigator){
        navigator.serviceWorker.addEventListener('controllerchange',()=>window.location.reload())
      }
    })
  },[])
  if(!needs) return null
  return <div className="fixed bottom-20 left-4 right-4 bg-[#1E1B4B] text-white p-3 rounded-xl text-[13px] z-50 flex justify-between items-center"><span>New security update - refresh</span><button onClick={()=>window.location.reload()} className="bg-white text-[#1E1B4B] px-3 py-1 rounded-full font-bold">Refresh</button></div>
}
