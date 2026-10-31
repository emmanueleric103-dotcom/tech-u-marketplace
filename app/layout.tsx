import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'TECH-U Marketplace',
  description: 'Buy and sell within TECH-U - Jiji style for students',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', color: '#0f172a' }}>
        <Header />
        <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '24px 20px' }}>{children}</main>
      </body>
    </html>
  )
}
