// app/components/BottomNav.tsx
'use client'
export default function BottomNav(){
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#1A1A1E] border-t border-gray-100 z-50 flex items-center justify-around px-2">
      <a href="/" className="flex flex-col items-center gap-1 text-[#5B21B6] dark:text-[#C4B5FD]"><span>⌂</span><span className="text-[10px] font-bold">Home</span></a>
      <button onClick={()=>document.getElementById('search')?.focus()} className="flex flex-col items-center gap-1"><span>⌕</span><span className="text-[10px]">Search</span></button>
      <a href="/sell" className="w-12 h-12 rounded-full bg-[#5B21B6] text-white grid place-items-center -mt-3 shadow-lg"><span className="text-xl">+</span></a>
      <a href="#categories" className="flex flex-col items-center gap-1"><span>◫</span><span className="text-[10px]">Categories</span></a>
      <a href="#safety" className="flex flex-col items-center gap-1"><span>🛡</span><span className="text-[10px]">Safety</span></a>
    </nav>
  )
}

