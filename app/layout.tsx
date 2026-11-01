import './globals.css'
import Link from 'next/link'

export const metadata = { title: 'TECH-U Marketplace', description: 'Simple campus marketplace - No accounts, just deals' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-zinc-200">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
              <span className="w-8 h-8 rounded-lg bg-[#16a34a] text-white grid place-items-center">T</span>
              TECH-U
            </Link>
            <nav className="flex gap-2 text-sm">
              <Link href="/products" className="px-3 py-1.5 rounded-full hover:bg-zinc-100">Products</Link>
              <Link href="/categories" className="px-3 py-1.5 rounded-full hover:bg-zinc-100">Categories</Link>
              <Link href="/sell" className="bg-[#16a34a] text-white px-4 py-1.5 rounded-full">Sell</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t mt-12 py-6 text-center text-xs text-zinc-500">
          TECH-U Marketplace SIMPLE • No buyer accounts • WhatsApp/Call • <Link href="/safety" className="underline">Safety</Link> • <Link href="/admin/login" className="underline">Admin</Link>
        </footer>
      </body>
    </html>
  )
}
