'use client'
import { useState, useEffect, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function QRCodeCard({ url, title, subtitle, type }: { url: string; title: string; subtitle?: string; type: 'product'|'business' }){
  const [isDark,setIsDark]=useState(false)
  const canvasRef=useRef<HTMLCanvasElement>(null)
  useEffect(()=>{
    const check=()=>{const s=localStorage.getItem('techu-theme'); setIsDark(document.documentElement.classList.contains('dark')||s==='dark')}
    check()
    const obs=new MutationObserver(check)
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
    window.addEventListener('theme-change',check as any)
    return ()=>{obs.disconnect(); window.removeEventListener('theme-change',check as any)}
  },[])
  const download=()=>{
    const qrCanvas=document.getElementById(`qr-${type}-${title}`)?.querySelector('canvas') as HTMLCanvasElement
    if(!qrCanvas) return
    const out=document.createElement('canvas')
    out.width=1024; out.height=1280
    const ctx=out.getContext('2d')!
    ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,out.width,out.height)
    ctx.fillStyle='#5B21B6'; ctx.fillRect(0,0,out.width,140)
    ctx.fillStyle='#FFFFFF'; ctx.font='bold 36px sans-serif'; ctx.fillText('TECH-U Marketplace',40,85)
    ctx.fillStyle='#FACC15'; ctx.beginPath(); ctx.arc(900,70,18,0,Math.PI*2); ctx.fill()
    ctx.drawImage(qrCanvas,212,200,600,600)
    ctx.fillStyle='#1E1B4B'; ctx.font='bold 32px sans-serif'; ctx.fillText(title.slice(0,32),40,880)
    if(subtitle){ctx.fillStyle='#6B7280'; ctx.font='22px sans-serif'; ctx.fillText(subtitle.slice(0,50),40,920)}
    ctx.fillStyle='#8B5CF6'; ctx.font='18px sans-serif'; ctx.fillText(url,40,970)
    ctx.fillStyle='#9CA3AF'; ctx.font='16px sans-serif'; ctx.fillText('Scan to open in TECH-U Marketplace • tech-u-marketplace.netlify.app',40,1230)
    const link=document.createElement('a'); link.download=`${title.replace(/[^a-z0-9]/gi,'_').slice(0,20)}-QR.png`; link.href=out.toDataURL('image/png'); link.click()
  }
  const share=async()=>{
    const u=url.startsWith('http')?url:`https://tech-u-marketplace.netlify.app${url}`
    if(navigator.share){
      try{ const res=await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(u)}`); const blob=await res.blob(); const file=new File([blob],`${title}-QR.png`,{type:'image/png'}); await navigator.share({title, text:`Check ${title} on TECH-U`, url:u, files:[file]}); return }catch(e){}
    }
    try{await navigator.clipboard.writeText(u); alert('Link copied: '+u)}catch{prompt('Copy link:',u)}
  }
  const card=isDark?'bg-[#1A1A1E] border-[#2A2A2E]':'bg-white border-gray-100'
  return (
    <div id={`qr-${type}-${title}`} className={`${card} border rounded-[24px] p-5`}>
      <div className="flex justify-between items-center"><h3 className={`text-[14px] font-bold ${isDark?'text-white':'text-[#1E1B4B]'}`}>{type==='product'?'Product QR':'Business QR'}</h3><span className="text-[10px] px-2 py-1 rounded-full bg-[#5B21B6] text-white">Scan Me</span></div>
      <div className="mt-4 flex justify-center bg-white rounded-2xl p-4"><QRCodeCanvas value={url} size={200} level="H" includeMargin /></div>
      <div className={`mt-3 text-center text-[13px] font-bold truncate ${isDark?'text-white':'text-[#1E1B4B]'}`}>{title}</div>
      {subtitle&&<div className={`text-center text-[11px] ${isDark?'text-gray-400':'text-gray-500'}`}>{subtitle}</div>}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={download} className="h-10 bg-[#1E1B4B] text-white rounded-full text-[12px] font-bold">⬇️ Download</button>
        <button onClick={share} className={`h-10 rounded-full text-[12px] font-bold border ${isDark?'bg-[#2A2A2E] text-white border-[#2A2A2E]':'bg-gray-100 text-black border-gray-200'}`}>🔗 Share</button>
      </div>
      <div className={`text-[10px] mt-3 text-center ${isDark?'text-gray-500':'text-gray-400'}`}>{url}</div>
    </div>
  )
}
