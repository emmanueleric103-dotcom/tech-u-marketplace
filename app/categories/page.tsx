'use client';
import Link from 'next/link';
const cats = [
  { name:'Electronics', desc:'Phones, laptops, accessories', emoji:'📱' },
  { name:'Fashion', desc:'Clothes, shoes, bags', emoji:'👕' },
  { name:'Books', desc:'Textbooks, handouts, novels', emoji:'📚' },
  { name:'Hostel Essentials', desc:'Buckets, pots, fans', emoji:'🏠' },
  { name:'Gadgets', desc:'Power banks, earpods', emoji:'🔋' },
  { name:'Furniture', desc:'Chairs, tables, beds', emoji:'🪑' },
  { name:'Others', desc:'Everything else', emoji:'📦' },
];
export default function CategoriesPage(){
  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-black">Browse by Category</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cats.map(c=>(
          <Link key={c.name} href={`/products?category=${encodeURIComponent(c.name)}`} className="card p-5 hover:shadow-md transition">
            <div className="text-[28px]">{c.emoji}</div>
            <p className="mt-2 font-bold">{c.name}</p>
            <p className="text-sm text-zinc-500">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
