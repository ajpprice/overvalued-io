export function getEnv(key: string): string | null {
  const v = process.env[key];
  if (!v || v.length === 0) return null;
  return v;
}

export function isSupabaseConfigured(): boolean {
  return !!getEnv("NEXT_PUBLIC_SUPABASE_URL") && !!getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function isFinnhubConfigured(): boolean {
  return !!getEnv("FINNHUB_API_KEY");
}

export function krakenAffiliateId(): string {
  return getEnv("KRAKEN_AFFILIATE_ID") ?? "PENDING";
}
