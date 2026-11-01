import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "TECH-U Marketplace",
  description: "Real student marketplace for Thomas Adewumi University",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-black tracking-tight">TECH-U MARKET</Link>
            <nav className="flex gap-4 text-sm font-medium">
              <Link href="/products">Browse</Link>
              <Link href="/sell">Sell</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/profile">Profile</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
