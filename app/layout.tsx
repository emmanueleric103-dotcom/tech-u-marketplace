import './globals.css'
import Header from '../components/Header'

export const metadata = {
  title: 'TECH-U MARKET',
  description: 'Official campus marketplace for TECH-U students',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f5f7f5] min-h-screen text-zinc-900 antialiased">
        <Header />
        <main>{children}</main>
        <footer className="mt-16 border-t bg-white py-8 text-center text-sm text-zinc-500">
          © 2026 TECH-U MARKET • Built for campus trade
        </footer>
      </body>
    </html>
  )
}
