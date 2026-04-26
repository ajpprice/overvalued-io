import { krakenAffiliateId } from "./env";

const XSTOCKS = new Set<string>([
  "TSLA", "NVDA", "AAPL", "GOOGL", "MSFT", "AMZN", "META", "SPY", "QQQ",
  "CMCSA", "BAC", "GME", "HOOD", "NFLX", "PFE", "PM", "XOM", "MCD", "WMT",
  "COIN", "MSTR", "INTC", "ORCL", "IBM", "KO", "PEP", "JPM", "GS", "CRM", "PLTR",
]);

export function hasXStock(ticker: string): boolean {
  return XSTOCKS.has(ticker.toUpperCase());
}

export function krakenAsset(ticker: string): string | null {
  return hasXStock(ticker) ? `${ticker.toUpperCase()}x` : null;
}

export function krakenLink(ticker: string): string {
  const ref = krakenAffiliateId();
  const asset = krakenAsset(ticker);
  if (asset) {
    return `https://www.kraken.com/sign-up?referral=${encodeURIComponent(ref)}&asset=${asset}`;
  }
  return `https://www.kraken.com/sign-up?referral=${encodeURIComponent(ref)}`;
}

export function krakenButtonText(ticker: string): string {
  return hasXStock(ticker) ? "🐻 Short It on Kraken" : "Sign up on Kraken";
}
