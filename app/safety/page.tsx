export default function Safety() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-black">Safety Tips</h1>
      <div className="mt-4 space-y-4">
        <div className="tech-card p-4"><h3 className="font-bold">1. Meet on campus</h3><p className="text-sm text-zinc-600">Transact in public, daylight, TECH-U premises.</p></div>
        <div className="tech-card p-4"><h3 className="font-bold">2. Verify item</h3><p className="text-sm text-zinc-600">Check product before paying. No pre-payment for unseen goods.</p></div>
        <div className="tech-card p-4"><h3 className="font-bold">3. Report scams</h3><p className="text-sm text-zinc-600">Use Report button. Admin reviews all reports at /admin/reports.</p></div>
        <div className="tech-card p-4"><h3 className="font-bold">4. No prohibited items</h3><p className="text-sm text-zinc-600">Weapons, drugs, exam leaks banned. Admin rejects instantly.</p></div>
      </div>
    </div>
  )
}
