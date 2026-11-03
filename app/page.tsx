"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "./lib/supabase";

// 08100145906 -> 2348100145906 for WhatsApp
function normalizeWA(num: string) {
  if (!num) return "";
  let n = String(num).replace(/[^0-9]/g, "");
  if (n.startsWith("0")) n = "234" + n.slice(1);
  if (n.length === 10 && !n.startsWith("234")) n = "234" + n;
  if (n.length === 13 && n.startsWith("234")) return n;
  if (n.length >= 11) return n;
  return n;
}

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  location?: string;
  condition?: string;
  image_url?: string;
  whatsapp_number?: string;
  phone_number?: string;
  status: string;
  created_at: string;
};

const CATEGORIES = [
  { id: "All", label: "All Items", icon: "◍", bg: "bg-[#F5F3FF]", dot: "bg-[#5B21B6]" },
  { id: "Electronics", label: "Electronics", icon: "◑", bg: "bg-[#EFF6FF]", dot: "bg-[#2563EB]" },
  { id: "Fashion", label: "Fashion", icon: "◍", bg: "bg-[#FFF1F2]", dot: "bg-[#E11D48]" },
  { id: "Books", label: "Books", icon: "⬙", bg: "bg-[#FEFCE8]", dot: "bg-[#CA8A04]" },
  { id: "Hostel", label: "Hostel Essentials", icon: "⌂", bg: "bg-[#F0FDF4]", dot: "bg-[#16A34A]" },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(24);
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = cat === "All" || p.category === cat;
      const text = (p.title + " " + p.category + " " + (p.location || "")).toLowerCase();
      const matchQ = !q || text.includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [products, q, cat]);

  return (
    <div className="min-h-screen bg-[#F8F7FF] text-[#111827]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#EDE9FE]">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#5B21B6] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(91,33,182,0.25)]">
              {/* bag + grad cap */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 7.5A3 3 0 0 1 9 4.5h6a3 3 0 0 1 3 3v1.2a2.5 2.5 0 0 1-1.2 2.1L12 14 7.2 10.8A2.5 2.5 0 0 1 6 8.7V7.5Z" fill="white" />
                <path d="M6 9.5V17a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9.5" stroke="white" strokeWidth="1.5" />
                <path d="M2 7l10-4 10 4-10 4-10-4Z" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div className="leading-none">
              <div className="font-[800] tracking-tight text-[15px]">TECH-U</div>
              <div className="text-[11px] tracking-[0.18em] font-bold text-[#5B21B6] -mt-0.5">MARKETPLACE</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium">
            <Link href="/" className="text-[#5B21B6]">Home</Link>
            <Link href="/sell" className="text-[#6B7280] hover:text-[#111827]">Sell</Link>
            <Link href="/about" className="text-[#6B7280] hover:text-[#111827]">Safety</Link>
            <Link href="/sell" className="h-9 px-5 rounded-full bg-[#5B21B6] text-white font-semibold shadow-[0_8px_16px_rgba(91,33,182,0.25)]">Sell an Item</Link>
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 rounded-full bg-white border border-[#EDE9FE] flex items-center justify-center">
            <span className="w-4 h-[2px] bg-[#111827] block relative before:content-[''] before:w-4 before:h-[2px] before:bg-[#111827] before:absolute before:-top-1.5 after:content-[''] after:w-4 after:h-[2px] after:bg-[#111827] after:absolute after:top-1.5" />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[#EDE9FE] bg-white px-4 py-4 flex flex-col gap-3">
            <Link href="/" className="py-2 font-semibold text-[#5B21B6]">Home</Link>
            <Link href="/sell" className="py-2 text-[#374151]">Sell an Item</Link>
            <Link href="/about" className="py-2 text-[#374151]">Safety Tips</Link>
            <Link href="/sell" className="mt-2 h-11 rounded-full bg-[#5B21B6] text-white flex items-center justify-center font-semibold">Start Selling</Link>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 pb-28">
        {/* HERO */}
        <section className="mt-6">
          <div className="relative overflow-hidden rounded-[28px] bg-[#5B21B6] min-h-[520px] md:min-h-[560px] p-6 sm:p-10 md:p-12 flex flex-col justify-between">
            {/* background image layer */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6D28D9]/95 via-[#5B21B6]/90 to-[#4C1D95]/95" />
              {/* Gate placeholder - gradient with shapes */}
              <div className="absolute right-0 top-0 bottom-0 w-[62%] opacity-30 hidden md:block">
                <div className="w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.35),transparent_50%),linear-gradient(100deg,transparent,rgba(255,255,255,0.12))]" />
              </div>
              {/* Decor circles */}
              <div className="absolute -right-20 -top-20 w-[380px] h-[380px] rounded-full bg-white/10 blur-[1px]" />
              <div className="absolute -left-20 -bottom-20 w-[300px] h-[300px] rounded-full bg-[#FACC15]/15" />
            </div>

            <div className="relative z-10 max-w-[640px]">
              <div className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-white/15 border border-white/20 text-white text-[12px] font-semibold tracking-wide backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse" /> TECH-U COMMUNITY • VERIFIED SELLERS
              </div>

              <h1 className="mt-6 text-[38px] sm:text-[54px] md:text-[64px] font-[900] leading-[0.95] tracking-[-0.04em] text-white">
                Buy Smart.<br />
                Sell Easy.<br />
                <span className="relative inline-block">
                  <span className="text-[#FACC15]">Campus</span> <span className="text-[#FACC15]">Connected.</span>
                  <svg className="absolute left-0 -bottom-2 w-full h-3" viewBox="0 0 200 10" preserveAspectRatio="none">
                    <path d="M2 8 Q 50 2, 100 6 T 198 4" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="mt-6 text-[16px] md:text-[18px] leading-[1.6] text-white/85 max-w-[520px] font-[450]">
                The trusted marketplace for Technical University Ibadan students. Laptops, textbooks, fashion & hostel essentials — all in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/sell" className="h-[48px] px-7 rounded-full bg-white text-[#5B21B6] font-bold text-[15px] inline-flex items-center gap-2 shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:translate-y-[-1px] transition">
                  Sell an Item <span className="w-6 h-6 rounded-full bg-[#5B21B6] text-white flex items-center justify-center">↗</span>
                </Link>
                <div className="h-[48px] px-5 rounded-full bg-white/10 border border-white/20 text-white inline-flex items-center gap-2 text-[14px] font-medium">
                  <span className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center">✓</span> 1,200+ Active Listings
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 md:mt-0 flex flex-wrap gap-3 items-center">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#5B21B6] bg-[#EDE9FE] flex items-center justify-center text-[12px] font-bold">{String.fromCharCode(64+i)}</div>
                ))}
              </div>
              <div className="text-white/80 text-[13px]">Trusted by 3,400+ TECH-U students</div>
            </div>

            {/* floating card */}
            <div className="hidden md:flex absolute right-10 bottom-10 z-20 w-[300px] rounded-[20px] bg-white p-4 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-[14px] bg-[#F5F3FF] flex items-center justify-center text-[24px]">💻</div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold leading-tight">MacBook Air M1 - Barely Used</div>
                  <div className="text-[13px] text-[#6B7280]">Engr. Faculty • 2h ago</div>
                  <div className="mt-1 text-[#5B21B6] font-extrabold">₦520,000</div>
                </div>
              </div>
              <div className="mt-3 h-9 rounded-full bg-[#16A34A] text-white text-[13px] font-semibold flex items-center justify-center">Available Now</div>
            </div>
          </div>
        </section>

        {/* SEARCH PILL */}
        <section className="mt-6">
          <div className="mx-auto max-w-[760px] h-[56px] rounded-full bg-white border border-[#EDE9FE] shadow-[0_8px_30px_rgba(91,33,182,0.06)] flex items-center px-2">
            <div className="w-10 h-10 rounded-full bg-[#F5F3FF] flex items-center justify-center ml-1 text-[#5B21B6]">⌕</div>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search laptops, books, fashion..." className="flex-1 h-full bg-transparent outline-none px-3 text-[15px] placeholder:text-[#9CA3AF]" />
            <button className="hidden sm:flex h-10 px-6 rounded-full bg-[#111827] text-white text-[14px] font-semibold">Search</button>
          </div>
        </section>

        {/* BROWSE BY CATEGORY */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] md:text-[26px] font-[800] tracking-tight">Browse by Category</h2>
            <Link href="#" className="text-[13px] font-semibold text-[#5B21B6]">View all →</Link>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {CATEGORIES.map(c => {
              const active = cat === c.id;
              return (
                <button key={c.id} onClick={()=>setCat(c.id)} className={"text-left rounded-[20px] p-4 md:p-5 border transition-all " + (active ? "bg-[#5B21B6] border-[#5B21B6] text-white shadow-[0_12px_24px_rgba(91,33,182,0.25)]" : "bg-white border-[#EDE9FE] hover:border-[#DDD6FE] hover:shadow-[0_8px_20px_rgba(91,33,182,0.08)]")}>
                  <div className={"w-10 h-10 rounded-full flex items-center justify-center text-[16px] font-bold " + (active ? "bg-white/15 text-white" : c.bg + " text-[#111827]")}>{c.icon}</div>
                  <div className="mt-4 font-bold text-[14px] leading-tight">{c.label}</div>
                  <div className={"mt-1 text-[12px] " + (active ? "text-white/70" : "text-[#6B7280]")}>{active ? "Selected" : "Explore →"}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* FEATURED LISTINGS */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[22px] md:text-[26px] font-[800] tracking-tight">Featured Listings</h2>
              <p className="text-[13px] text-[#6B7280] mt-1">{filtered.length} items • {cat} • TECH-U verified</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[12px] font-medium text-[#6B7280]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block" /> Live • Updates every 30s
            </div>
          </div>

          {loading ? (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i=>(
                <div key={i} className="rounded-[20px] bg-white border border-[#EDE9FE] p-3 animate-pulse">
                  <div className="h-[150px] rounded-[14px] bg-[#F5F3FF]" />
                  <div className="mt-3 h-4 bg-[#F3F4F6] rounded" />
                  <div className="mt-2 h-3 bg-[#F3F4F6] rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {(filtered.length ? filtered : [
                { id:"1", title:"HP EliteBook 840 G6 - 8GB RAM", price:185000, category:"Electronics", location:"Main Campus", image_url:"", whatsapp_number:"08100145906", status:"approved", created_at:"" },
                { id:"2", title:"Engineering Mathematics Textbook", price:4500, category:"Books", location:"Faculty Block", image_url:"", whatsapp_number:"08100145906", status:"approved", created_at:"" },
                { id:"3", title:"Unisex Vintage Hoodie - M", price:8000, category:"Fashion", location:"Hostel A", image_url:"", whatsapp_number:"08100145906", status:"approved", created_at:"" },
                { id:"4", title:"Gas Cooker + Cylinder", price:22000, category:"Hostel", location:"Off-campus", image_url:"", whatsapp_number:"08100145906", status:"approved", created_at:"" },
              ] as Product[]).map((p) => {
                const isLiked = liked.has(p.id);
                const wa = normalizeWA(p.whatsapp_number || "");
                const msg = encodeURIComponent("Hi, I saw " + p.title + " on TECH-U Marketplace. Is it still available?");
                return (
                  <div key={p.id} className="group rounded-[20px] bg-white border border-[#EDE9FE] overflow-hidden hover:shadow-[0_16px_40px_rgba(91,33,182,0.10)] hover:border-[#DDD6FE] transition-all">
                    <div className="relative p-2">
                      <div className="relative h-[156px] md:h-[180px] rounded-[14px] bg-[#F8F7FF] overflow-hidden flex items-center justify-center">
                        {p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-[36px]">📦</div>
                        )}
                        <div className="absolute left-3 top-3 h-6 px-2.5 rounded-full bg-[#16A34A] text-white text-[11px] font-bold flex items-center">Available</div>
                        <button onClick={()=> setLiked(prev=>{ const n=new Set(prev); if(n.has(p.id)) n.delete(p.id); else n.add(p.id); return n; })} className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur border border-white shadow flex items-center justify-center">
                          <span className={isLiked ? "text-[#E11D48]" : "text-[#9CA3AF]"}>{isLiked ? "♥" : "♡"}</span>
                        </button>
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-1">
                      <div className="text-[11px] font-bold tracking-wide text-[#6B7280] uppercase">{p.category}</div>
                      <div className="mt-1 font-semibold text-[14px] leading-[1.25] line-clamp-2 min-h-[36px]">{p.title}</div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-[#5B21B6] font-extrabold text-[16px]">₦{Number(p.price).toLocaleString()}</span>
                        <span className="text-[11px] text-[#9CA3AF] line-through">₦{(Number(p.price)*1.25).toFixed(0)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-[#6B7280]"><span>📍</span> {p.location || "TECH-U Campus"}</div>
                      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                        <a href={wa ? "https://wa.me/" + wa + "?text=" + msg : "#"} target="_blank" rel="noopener noreferrer" className="h-9 rounded-full bg-[#16A34A] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#15803D] transition">
                          <span className="text-[14px]">◍</span> Message Seller
                        </a>
                        <a href={p.phone_number ? "tel:" + p.phone_number : "tel:" + (p.whatsapp_number || "")} className="w-9 h-9 rounded-full bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#5B21B6]">☎</a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* STAY SAFE BANNER */}
        <section className="mt-12">
          <div className="rounded-[24px] bg-[#111827] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between overflow-hidden relative">
            <div className="absolute right-0 top-0 w-[40%] h-full bg-[radial-gradient(circle_at_50%_0%,rgba(91,33,182,0.35),transparent_60%)]" />
            <div className="relative z-10">
              <div className="inline-flex h-7 px-3 rounded-full bg-white/10 border border-white/10 text-white text-[11px] font-bold tracking-wide">STAY SAFE ON CAMPUS</div>
              <h3 className="mt-3 text-[20px] md:text-[24px] font-[800] text-white leading-tight">Meet in public. Verify items. Pay after inspection.</h3>
              <p className="mt-2 text-[13px] text-white/60 max-w-[520px]">Always meet at TECH-U main gate, faculty reception, or hostel common room. Never pay before seeing the item. Report suspicious sellers.</p>
            </div>
            <div className="relative z-10 flex gap-3">
              <Link href="/safety" className="h-10 px-5 rounded-full bg-white text-[#111827] text-[13px] font-semibold flex items-center">Read safety guide</Link>
              <Link href="/report" className="h-10 px-5 rounded-full bg-white/10 border border-white/15 text-white text-[13px] font-semibold flex items-center">Report</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 pt-8 border-t border-[#EDE9FE] flex flex-col md:flex-row justify-between gap-4 text-[12px] text-[#6B7280]">
          <div>© 2025 TECH-U Marketplace • Built for students, by students.</div>
          <div className="flex gap-4"><span>Privacy</span><span>Terms</span><span>Contact: 0810 014 5906</span></div>
        </footer>
      </main>

      {/* BOTTOM NAV MOBILE */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#EDE9FE] px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#5B21B6]"><span className="text-[18px]">⌂</span><span className="text-[10px] font-bold">Home</span></Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-[#9CA3AF]"><span className="text-[18px]">◍</span><span className="text-[10px]">Search</span></Link>
        <Link href="/sell" className="w-12 h-12 rounded-full bg-[#5B21B6] text-white flex items-center justify-center shadow-[0_10px_20px_rgba(91,33,182,0.35)] text-[22px] -mt-2">+</Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-[#9CA3AF]"><span className="text-[18px]">♥</span><span className="text-[10px]">Saved</span></Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-[#9CA3AF]"><span className="text-[18px]">☺</span><span className="text-[10px]">You</span></Link>
      </div>
    </div>
  );
}

