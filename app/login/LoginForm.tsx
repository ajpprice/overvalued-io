"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const supabase = createClient();
    if (!supabase) {
      setErr("Supabase not configured.");
      setBusy(false);
      return;
    }
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-border bg-panel p-5 text-sm">
        Magic link sent to <span className="ticker text-bear">{email}</span>. Check your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full bg-panel border border-border px-3 py-3 ticker"
      />
      {err && <div className="text-bear text-sm">{err}</div>}
      <button type="submit" disabled={busy}
              className="w-full bg-bear text-bg font-bold uppercase tracking-wider px-6 py-3 disabled:opacity-50">
        {busy ? "Sending..." : "Send magic link"}
      </button>
    </form>
  );
}
