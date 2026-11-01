import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'TECH-U MARKETPLACE - Buy & Sell on Campus',
  description: 'Simple, fast campus marketplace for Abiola Ajimobi First Technical University, Ibadan. No buyer accounts needed.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-40 glass border-b border-zinc-100">
          <div className="mx-auto max-w-6xl px-4 h-[64px] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white grid place-items-center font-black text-[14px] tracking-tighter">TU</div>
              <span className="font-extrabold tracking-tight text-[18px]">TECH-U MARKET</span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link href="/products" className="hidden sm:inline-flex text-sm font-medium px-3 py-2 rounded-full hover:bg-zinc-100">Browse</Link>
              <Link href="/categories" className="hidden sm:inline-flex text-sm font-medium px-3 py-2 rounded-full hover:bg-zinc-100">Categories</Link>
              <Link href="/safety" className="hidden md:inline-flex text-sm font-medium px-3 py-2 rounded-full hover:bg-zinc-100">Safety</Link>
              <Link href="/sell" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm">Sell an Item</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
        <footer className="mt-16 border-t border-zinc-100 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-500 flex flex-col sm:flex-row justify-between gap-2">
            <span>© {new Date().getFullYear()} TECH-U Marketplace • First Technical University, Ibadan</span>
            <span className="flex gap-4"><Link href="/safety" className="hover:underline">Safety Tips</Link><Link href="/admin/login" className="hover:underline">Admin</Link></span>
          </div>
        </footer>
      </body>
    </html>
  );
}
