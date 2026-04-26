"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SubmitForm({ stocks }: { stocks: { ticker: string; name: string }[] }) {
  const router = useRouter();
  const [ticker, setTicker] = useState(stocks[0]?.ticker ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [risks, setRisks] = useState("");
  const [target, setTarget] = useState("");
  const [horizon, setHorizon] = useState("6-12 months");
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
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      router.push("/login?next=/submit");
      return;
    }
    const payload = {
      ticker: ticker.toUpperCase(),
      title,
      body,
      key_risks: risks.split(",").map((s) => s.trim()).filter(Boolean),
      target_price: target ? Number(target) : null,
      time_horizon: horizon,
      author_id: u.user.id,
    };
    const { error } = await supabase.from("theses").insert(payload);
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push(`/stock/${payload.ticker}`);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted mb-2">Ticker</label>
        <select
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="w-full bg-panel border border-border px-3 py-2 ticker text-bear"
        >
          {stocks.map((s) => (
            <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted mb-2">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={140}
               className="w-full bg-panel border border-border px-3 py-2" />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted mb-2">Body (markdown)</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={10}
                  className="w-full bg-panel border border-border px-3 py-2 font-mono text-sm" />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted mb-2">Key risks (comma-separated)</label>
        <input value={risks} onChange={(e) => setRisks(e.target.value)}
               placeholder="Short squeeze, Earnings beat, M&A"
               className="w-full bg-panel border border-border px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Target price ($)</label>
          <input value={target} onChange={(e) => setTarget(e.target.value)} type="number" step="0.01"
                 className="w-full bg-panel border border-border px-3 py-2 ticker" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Time horizon</label>
          <select value={horizon} onChange={(e) => setHorizon(e.target.value)}
                  className="w-full bg-panel border border-border px-3 py-2">
            {["1-3 months","3-6 months","6-12 months","12-18 months","18+ months"].map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>
      {err && <div className="text-bear text-sm">{err}</div>}
      <button type="submit" disabled={busy}
              className="bg-bear text-bg font-bold uppercase tracking-wider px-6 py-3 disabled:opacity-50">
        {busy ? "Submitting..." : "Publish Thesis"}
      </button>
    </form>
  );
}
