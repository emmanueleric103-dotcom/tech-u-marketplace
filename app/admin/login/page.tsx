'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent){
    e.preventDefault();
    setLoading(true); setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    // Check if admin email allowed or in admins table
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
    const isEnvAdmin = adminEmails.length===0 || adminEmails.includes(email.toLowerCase());
    if (!isEnvAdmin) {
      const { data: adminRow } = await supabase.from('admins').select('email').eq('email', email).single();
      if (!adminRow) { setError('Not authorized as admin. Add email to ADMIN_EMAILS or admins table.'); setLoading(false); return; }
    }
    router.push('/admin');
  }

  return (
    <div className="max-w-[420px] mx-auto card p-6 sm:p-8">
      <h1 className="text-[22px] font-black">Admin Login</h1>
      <p className="text-sm text-zinc-500 mt-1">Only administrators can log in. Buyers need no account.</p>
      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="admin@tech-u.edu.ng" className="w-full h-11 rounded-xl border px-4" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full h-11 rounded-xl border px-4" required />
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded-xl">{error}</div>}
        <button disabled={loading} className="w-full h-11 rounded-full bg-zinc-900 text-white font-bold">{loading?'Logging in...':'Login'}</button>
      </form>
    </div>
  );
}
