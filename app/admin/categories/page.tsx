export default function AdminCategories() {
  const cats = ['Electronics','Fashion','Books','Hostel','Services','Others']
  return (
    <div>
      <h1 className="text-xl font-black">Categories</h1>
      <div className="mt-4 grid gap-2 max-w-md">
        {cats.map(c=>(
          <div key={c} className="tech-card p-3 flex justify-between"><span>{c}</span><span className="text-xs text-zinc-500">Active</span></div>
        ))}
      </div>
      <p className="text-xs text-zinc-500 mt-4">For SIMPLE build, categories are hardcoded in app/sell and app/products. Edit tailwind.config and this file to add.</p>
    </div>
  )
}
