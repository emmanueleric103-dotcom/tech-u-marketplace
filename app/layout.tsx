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
    images: [{ url: 'https://tech-u-marketplace.netlify.app/og-image.jpg', width: 1200, height: 630, alt: 'TECH-U Marketplace - Buy Smart Sell Easy' }]
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
      </body>
    </html>
  )
}
