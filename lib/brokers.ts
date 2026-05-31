import { env } from "./env";
import { KRAKEN_XSTOCKS_LIST, hasXStock } from "./kraken";

export interface BrokerConfig {
  id: "kraken" | "ig" | "saxo" | "etoro";
  name: string;
  instrument: string;
  collateral: string;
  logo: string;
  affiliateUrl: (ticker: string) => string;
  supportedTickers: Set<string> | "all";
}

export const BROKERS: BrokerConfig[] = [
  {
    id: "kraken",
    name: "Kraken xStocks",
    instrument: "Crypto perp",
    collateral: "USDC",
    logo: "/brokers/kraken.svg",
    affiliateUrl: (ticker: string) =>
      `https://kraken.com/sign-up?referral=${encodeURIComponent(env.KRAKEN_AFFILIATE_ID)}&asset=${ticker}x`,
    supportedTickers: KRAKEN_XSTOCKS_LIST,
  },
  {
    id: "ig",
    name: "IG Markets",
    instrument: "CFD",
    collateral: "GBP",
    logo: "/brokers/ig.svg",
    affiliateUrl: (t) =>
      `https://ig.com/uk/sign-up?ref=${encodeURIComponent(env.IG_AFFILIATE_ID)}&search=${t}`,
    supportedTickers: "all",
  },
  {
    id: "saxo",
    name: "Saxo Bank",
    instrument: "CFD",
    collateral: "GBP",
    logo: "/brokers/saxo.svg",
    affiliateUrl: (t) =>
      `https://saxo.com/uk/open-account?ref=${encodeURIComponent(env.SAXO_AFFILIATE_ID)}&symbol=${t}`,
    supportedTickers: "all",
  },
  {
    id: "etoro",
    name: "eToro",
    instrument: "CFD",
    collateral: "GBP",
    logo: "/brokers/etoro.svg",
    affiliateUrl: (t) =>
      `https://etoro.com/sign-up?ref=${encodeURIComponent(env.ETORO_AFFILIATE_ID)}&instrument=${t}`,
    supportedTickers: "all",
  },
];

export function brokerSupports(b: BrokerConfig, ticker: string): boolean {
  if (b.supportedTickers === "all") return true;
  return b.supportedTickers.has(ticker.toUpperCase()) || hasXStock(ticker);
}
