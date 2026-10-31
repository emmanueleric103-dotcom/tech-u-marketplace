import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'TECH-U Marketplace - Real Jiji.ng Engine',
  description: 'Student marketplace with real Supabase backend',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafafa] text-zinc-900 antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
