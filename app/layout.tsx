import './globals.css'
import Header from './components/Header'
import PWAInstall from './components/PWAInstall'
export const metadata = {
  metadataBase: new URL('https://tech-u-marketplace.netlify.app'),
  title: 'TECH-U Marketplace | Buy & Sell on Campus',
  description: 'Discover products, advertise your business, and connect with buyers within the TECH-U community.',
  manifest: '/manifest.webmanifest',
  themeColor: '#5B21B6',
  appleWebApp: { capable: true, title: 'TECH-U', statusBarStyle: 'black-translucent' },
  openGraph: {
    title: 'TECH-U Marketplace | Buy & Sell on Campus',
    description: 'Discover products, advertise your business, and connect with buyers within the TECH-U community.',
    url: 'https://tech-u-marketplace.netlify.app',
    siteName: 'TECH-U Marketplace',
    type: 'website',
    images: [{ url: 'https://tech-u-marketplace.netlify.app/og-image.jpg', width: 1200, height: 630, alt: 'TECH-U Marketplace' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TECH-U Marketplace | Buy & Sell on Campus',
    description: 'Discover products, advertise your business, and connect with buyers within the TECH-U community.',
    images: ['https://tech-u-marketplace.netlify.app/og-image.jpg']
  },
  icons: { apple: '/icons/apple-touch-icon-180x180.png' }
}
export const viewport = { themeColor: '#5B21B6', width: 'device-width', initialScale: 1 }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png" /></head>
      <body className="bg-white text-[#1E1B4B] overflow-x-hidden antialiased">
        <Header />
        <main className="pb-20">{children}</main>
        <PWAInstall />
      </body>
    </html>
  )
}
