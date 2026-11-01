'use client'
import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    if (file.size <= 300 * 1024) { resolve(file); return; }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxW = 1024;
      let w = img.width, h = img.height;
      if (w > maxW) { h = h * (maxW / w); w = maxW; }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, w, h);
      const tryCompress = (quality: number) => {
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return; }
          if (blob.size <= 300 * 1024 || quality <= 0.2) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            tryCompress(quality - 0.15);
          }
        }, "image/jpeg", quality);
      };
      tryCompress(0.7);
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [type, setType] = useState("physical");
  const [category, setCategory] = useState("General");
  const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFiles = async (newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles);
    for (const f of arr) {
      if (f.size > 2 * 1024 * 1024) { setError("Max 2MB per image: " + f.name); continue; }
      const compressed = await compressImage(f);
      setFiles(prev => [...prev, compressed]);
      setPreviews(prev => [...prev, URL.createObjectURL(compressed)]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Please login first"); setUploading(false); return; }

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const fileName = Date.now() + "-" + file.name.replace(/\s/g, "-");
      const { data, error: upErr } = await supabase.storage.from("Image").upload(fileName, file);
      if (upErr) { setError(upErr.message); setUploading(false); return; }
      const { data: pub } = supabase.storage.from("Image").getPublicUrl(data.path);
      uploadedUrls.push(pub.publicUrl);
    }

    const { error: insertErr } = await supabase.from("products").insert({
      user_id: user.id,
      title, description: desc, price: parseFloat(price), stock: parseInt(stock),
      product_type: type, category, whatsapp, phone, image_urls: uploadedUrls
    });

    setUploading(false);
    if (insertErr) { setError(insertErr.message); return; }
    router.push("/dashboard");
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black">Sell Item</h1>
      <p className="text-sm text-zinc-600 mt-2">Drag photos, auto-compress to 300KB, upload to bucket Image (capital I)</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div onDragOver={e => e.preventDefault()} onDrop={onDrop} className="border-2 border-dashed rounded-2xl p-8 text-center bg-white">
          <div className="font-medium">Drag photos here</div>
          <div className="text-xs text-zinc-500 mt-1">2MB max each, auto compress to 300KB via canvas</div>
          <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 px-5 py-2 bg-black text-white rounded-full text-sm">Choose Files</button>
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
          {previews.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {previews.map((src, i) => <img key={i} src={src} className="h-24 w-full object-cover rounded-xl border" />)}
            </div>
          )}
        </div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full border p-3 rounded-xl" required />
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="w-full border p-3 rounded-xl h-24" />
        <div className="grid grid-cols-2 gap-4">
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (NGN)" type="number" className="border p-3 rounded-xl" required />
          <input value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock remaining" type="number" min="1" className="border p-3 rounded-xl" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select value={type} onChange={e => setType(e.target.value)} className="border p-3 rounded-xl">
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
          </select>
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="border p-3 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp number (e.g 234...)" className="border p-3 rounded-xl" required />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="border p-3 rounded-xl" />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={uploading} className="w-full bg-black text-white p-4 rounded-xl font-bold">{uploading ? "Uploading..." : "List Product"}</button>
      </form>
    </main>
  );
}
