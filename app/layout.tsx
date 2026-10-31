import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "TECH-U Marketplace - Buy & Sell on Campus",
  description: "Official marketplace for Technical University Ibadan students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f5f5f5] text-zinc-900 antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-white border-t mt-16 py-10">
          <div className="max-w-[1280px] mx-auto px-4 text-sm text-zinc-500 flex justify-between">
            <span>© 2025 TECH-U Marketplace</span>
            <span>Built for TECH-U Ibadan • Jiji-style Edition</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
