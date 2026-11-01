import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TECH-U MARKET - Campus Marketplace',
  description: 'Buy and sell on campus - Jiji.ng style marketplace for TECH-U students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8faf7] text-gray-900 antialiased min-h-screen">
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[64px]">
              <div className="flex items-center gap-8">
                <a href="/" className="flex items-center gap-1">
                  <span className="text-[22px] font-black tracking-tight text-gray-900">TECH-U</span>
                  <span className="text-[22px] font-black tracking-tight text-green-600">MARKET</span>
                </a>
                <nav className="hidden md:flex items-center gap-6">
                  <a href="/" className="text-[14px] font-medium text-gray-700 hover:text-green-600 transition-colors">Browse</a>
                  <a href="/products" className="text-[14px] font-medium text-gray-700 hover:text-green-600 transition-colors">Products</a>
                  <a href="/sell" className="text-[14px] font-medium text-gray-700 hover:text-green-600 transition-colors">Sell</a>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <a href="/auth/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 rounded-full hover:bg-gray-50 transition">Login</a>
                <a href="/sell" className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 shadow-sm hover:shadow transition-all">Sell an Item</a>
              </div>
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </body>
    </html>
  )
}
