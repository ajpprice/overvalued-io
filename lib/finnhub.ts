import { getEnv } from "./env";

export interface Quote {
  price: number | null;
  percentChange: number | null;
}

export async function getQuote(ticker: string): Promise<Quote> {
  const key = getEnv("FINNHUB_API_KEY");
  if (!key) {
    return { price: null, percentChange: null };
  }
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${key}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return { price: null, percentChange: null };
    const data = (await res.json()) as { c?: number; dp?: number };
    return {
      price: typeof data.c === "number" ? data.c : null,
      percentChange: typeof data.dp === "number" ? data.dp : null,
    };
  } catch {
    return { price: null, percentChange: null };
  }
}
