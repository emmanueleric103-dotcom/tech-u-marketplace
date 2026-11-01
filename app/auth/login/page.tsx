'use client'
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/dashboard");
  };

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-black">Login</h1>
      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-3 rounded-xl" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border p-3 rounded-xl" required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-black text-white p-3 rounded-xl font-bold">{loading ? "Logging..." : "Login"}</button>
      </form>
      <p className="mt-4 text-sm">No account? <Link href="/auth/register" className="underline">Register</Link></p>
    </main>
  );
}
