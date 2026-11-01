import './globals.css'

export const metadata = {
  title: 'TECH-U MARKET | Student Marketplace',
  description: 'Buy and sell textbooks, electronics, furniture at Technical University',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f9fafb] text-zinc-900 antialiased">{children}</body>
    </html>
  )
}
