import Link from 'next/link'
const cats = [{name:'Electronics',icon:'📱'}, {name:'Fashion',icon:'👕'}, {name:'Books',icon:'📚'}, {name:'Hostel',icon:'🏠'}, {name:'Services',icon:'🛠️'}, {name:'Others',icon:'📦'}]
export default function Categories() {
  return (
    <div>
      <h1 className="text-2xl font-black">Categories</h1>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {cats.map(c=>(
          <Link key={c.name} href={`/products?cat=${c.name}`} className="tech-card p-6 text-center hover:border-[#16a34a]">
            <div className="text-3xl">{c.icon}</div>
            <div className="mt-2 font-bold">{c.name}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
