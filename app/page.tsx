'use client'
export const dynamic = "force-dynamic";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getUser().then((res) => setUser(res.data.user));
  }, []);
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl font-black leading-[0.9] tracking-tight">TECH-U<br/>MARKETPLACE</h1>
          <p className="mt-4 text-zinc-600">The real student marketplace for Thomas Adewumi University. Buy, sell, request - all inside campus. No fake files, all at root.</p>
          <div className="mt-8 p-5 bg-white border rounded-2xl">
            <h2 className="font-bold">What is this for?</h2>
            <p className="text-sm text-zinc-600 mt-2">Students list physical items (books, gadgets, clothes) and digital services (tutorials, designs). Buyers contact via WhatsApp or Call directly. Stock tracking built-in.</p>
          </div>
          <div className="mt-6 p-5 bg-zinc-900 text-white rounded-2xl">
            <h3 className="font-bold">How to use - 3 steps</h3>
            <ol className="list-decimal pl-5 text-sm space-y-2 mt-3 text-zinc-300">
              <li>Create account with your TECH-U email and matric number</li>
              <li>List product with photos (drag and drop), set stock, price, WhatsApp</li>
              <li>Buyers request and contact you - manage sales in Dashboard</li>
            </ol>
          </div>
          <div className="mt-8 flex gap-4">
            <Link href="/auth/login" className="px-8 py-4 bg-black text-white font-bold rounded-full text-lg">Login</Link>
            <Link href="/auth/register" className="px-8 py-4 bg-white border-2 border-black text-black font-bold rounded-full text-lg">Register</Link>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-widest">Live status</div>
            <div className="mt-4 text-2xl font-bold">{user ? "Welcome " + (user.email || "") : "Not logged in - please login"}</div>
            <div className="mt-4 text-sm text-zinc-500">Real Supabase auth - no mock</div>
          </div>
          <div className="bg-white border rounded-[1.5rem] p-6">
            <div className="font-bold">Why TECH-U Market?</div>
            <ul className="mt-3 text-sm text-zinc-600 list-disc pl-5 space-y-1">
              <li>Real image upload to bucket Image (capital I)</li>
              <li>Stock management - buyers see remaining</li>
              <li>WhatsApp wa.me and tel: links</li>
              <li>Profile per user, no login loop</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
