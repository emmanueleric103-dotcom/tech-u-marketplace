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
