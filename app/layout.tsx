import './globals.css'
import Header from './components/Header'
export const metadata = {
  metadataBase: new URL('https://tech-u-marketplace.netlify.app'),
  title: 'TECH-U Marketplace | Buy & Sell on Campus',
  description: 'Discover products, advertise your business, and connect with buyers within the TECH-U community.',
  openGraph: {
    title: 'TECH-U Marketplace | Buy & Sell on Campus',
    description: 'Discover products, advertise your business, and connect with buyers within the TECH-U community.',
    url: 'https://tech-u-marketplace.netlify.app',
    siteName: 'TECH-U Marketplace',
    type: 'website',
    images: [{ url: 'https://tech-u-marketplace.netlify.app/og-image.jpg', width: 1200, height: 630, alt: 'TECH-U Marketplace - Buy Smart Sell Easy - Your Campus Marketplace' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TECH-U Marketplace | Buy & Sell on Campus',
    description: 'Discover products, advertise your business, and connect with buyers within the TECH-U community.',
    images: ['https://tech-u-marketplace.netlify.app/og-image.jpg']
  }
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-[#1E1B4B] overflow-x-hidden antialiased">
        <Header />
        <main className="pb-20">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[64px] flex justify-around items-center z-50 md:hidden">
          <a href="/" className="flex flex-col items-center gap-0.5 w-16"><span className="text-[20px]">🏠</span><span className="text-[10px]">Home</span></a>
          <a href="/#search" className="flex flex-col items-center gap-0.5 w-16"><span className="text-[20px]">🔍</span><span className="text-[10px]">Search</span></a>
          <a href="/sell" className="w-14 h-14 bg-[#5B21B6] rounded-full flex items-center justify-center text-white text-[24px] -mt-3">+</a>
          <a href="/#categories" className="flex flex-col items-center gap-0.5 w-16"><span>⊞</span><span className="text-[10px]">Categories</span></a>
          <a href="/#safety" className="flex flex-col items-center gap-0.5 w-16"><span className="text-[20px]">🛡️</span><span className="text-[10px]">Safety</span></a>
        </nav>
      </body>
    </html>
  )
}
