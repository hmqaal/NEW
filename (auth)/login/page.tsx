"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) window.location.href = "/admin";
    else setErr("Invalid credentials");
  }

  return (
    <main className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full border rounded p-2" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="bg-slate-900 text-white rounded px-4 py-2" type="submit">Sign in</button>
      </form>
    </main>
  );
}
