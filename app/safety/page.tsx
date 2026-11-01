export default function SafetyPage() {
  return (
    <div className="max-w-[720px] mx-auto space-y-6">
      <h1 className="text-[26px] font-black">Safety Tips</h1>
      <div className="card p-6 space-y-4 text-sm leading-relaxed">
        <p className="font-semibold">Buy & sell safely on TECH-U Campus</p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-700">
          <li>Meet in public, busy areas on campus — e.g. library, cafeteria, main gate.</li>
          <li>Inspect items before paying. For phones, test SIM, camera, battery.</li>
          <li>Do not pay in advance. No online payment needed — this site uses WhatsApp/Call only.</li>
          <li>Verify hostel items with photos/videos, but still inspect physically.</li>
          <li>Report suspicious listings: scam, wrong price, already sold.</li>
          <li>Admin approves every listing, but stay vigilant — if too good to be true, it likely is.</li>
        </ul>
        <p className="text-zinc-500 text-xs">Seller → Post Item → Pending Approval → Admin Approves → Appears Online → Buyer Clicks WhatsApp → Contacts Seller Directly.</p>
      </div>
    </div>
  );
}
