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
