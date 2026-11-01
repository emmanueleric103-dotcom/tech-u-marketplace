'use client'
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, email, full_name: fullName });
    }
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-black">Create Account</h1>
      <form onSubmit={handleRegister} className="mt-8 space-y-4">
        <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" className="w-full border p-3 rounded-xl" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="TECH-U Email" className="w-full border p-3 rounded-xl" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min 6)" className="w-full border p-3 rounded-xl" required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-black text-white p-3 rounded-xl font-bold">{loading ? "Creating..." : "Register"}</button>
      </form>
      <p className="mt-4 text-sm">Have account? <Link href="/auth/login" className="underline">Login</Link></p>
    </main>
  );
}
