import { isSupabaseConfigured, isFinnhubConfigured } from "@/lib/env";

export default function ConfigNotice() {
  const supa = isSupabaseConfigured();
  const finn = isFinnhubConfigured();
  if (supa && finn) return null;
  const missing: string[] = [];
  if (!supa) missing.push("Supabase");
  if (!finn) missing.push("Finnhub");
  return (
    <div className="bg-amber/10 border border-amber/40 text-amber text-xs px-4 py-2">
      Configure your environment variables to enable {missing.join(" and ")}. See <span className="ticker">.env.local.example</span>.
    </div>
  );
}
