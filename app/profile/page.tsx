'use client'
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (!data.user) return;
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      setProfile(prof);
    });
  }, []);

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-black">Profile not found - please login</h1>
        <Link href="/auth/login" className="mt-6 inline-block px-8 py-3 bg-black text-white rounded-full font-bold">Go to Login</Link>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-black">My Profile</h1>
      <div className="mt-8 bg-white border rounded-2xl p-6">
        <div className="text-sm">Email</div><div className="font-bold">{user.email}</div>
        <div className="text-sm mt-4">Full Name</div><div className="font-bold">{profile?.full_name || "Not set"}</div>
        <div className="text-sm mt-4">Matric</div><div className="font-bold">{profile?.matric_no || "Not set"}</div>
        <div className="text-sm mt-4">Department</div><div className="font-bold">{profile?.department || "Not set"}</div>
      </div>
    </main>
  );
}
