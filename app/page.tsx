import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StockCard } from "@/components/design/StockCard";
import type { StockCategory, StockData } from "@/components/design/types";

export const dynamic = "force-dynamic";

interface StockRow {
  ticker: string;
  name: string;
  exchange: string | null;
  current_price: number | null;
  bear_score: number;
  valuation_discount_pct: number | null;
  short_interest_pct: number | null;
  trustpilot_score: number | null;
  category: StockCategory;
  total_theses: number;
}

const FILTERS: { key: string; label: string; href: string }[] = [
  { key: "all", label: "ALL", href: "/" },
  { key: "valuation", label: "VALUATION", href: "/?cat=valuation" },
  { key: "consumer_hate", label: "CONSUMER HATE", href: "/?cat=consumer_hate" },
  { key: "bags", label: "BAGS", href: "/bags" },
  { key: "structural_decay", label: "STRUCTURAL DECAY", href: "/?cat=structural_decay" },
];

async function getStocks(cat?: string): Promise<StockRow[]> {
  const supabase = createClient();
  if (!supabase) return [];
  let q = supabase
    .from("stocks")
    .select(
      "ticker,name,exchange,current_price,bear_score,valuation_discount_pct,short_interest_pct,trustpilot_score,category,total_theses"
    )
    .order("bear_score", { ascending: false })
    .limit(50);
  if (cat) q = q.eq("category", cat);
  const { data, error } = await q;
  if (error) return [];
  return (data ?? []) as StockRow[];
}

function fmtPrice(n: number | null, exchange: string | null): string {
  if (n == null) return "—";
  const isLSE = (exchange ?? "").toUpperCase().includes("LSE");
  const num = Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  return isLSE ? `${num}p` : `$${num}`;
}

function toCardData(s: StockRow, idx: number): StockData {
  return {
    ticker: s.ticker,
    name: s.name,
    mkt: s.exchange ?? "—",
    price: fmtPrice(s.current_price, s.exchange),
    chg: "—",
    score: Math.round(Number(s.bear_score) || 0),
    over: s.valuation_discount_pct != null ? `${s.valuation_discount_pct.toFixed(0)}%` : "—",
    shortInt: s.short_interest_pct != null ? `${s.short_interest_pct.toFixed(1)}%` : "—",
    trust: s.trustpilot_score != null ? `${s.trustpilot_score.toFixed(1)}/5` : "—",
    cat: s.category,
    note: s.total_theses > 0 ? `${s.total_theses} THESES` : undefined,
  };
}

export default async function Home({ searchParams }: { searchParams: { cat?: string } }) {
  const cat = searchParams.cat;
  const stocks = await getStocks(cat);
  const activeKey = cat ?? "all";

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 36px" }}>
      {/* Hero */}
      <div className="ov-fade-in" style={{ marginBottom: 40 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>OVERVALUED · MOST SHORTED</div>
        <h1
          className="font-display"
          style={{ fontSize: 112, color: "#fff", letterSpacing: "-0.02em", lineHeight: 0.9, margin: 0 }}
        >
          SHORT WHAT
          <br />
          YOU <span style={{ color: "var(--ov-red)" }}>HATE</span>.
        </h1>
        <p
          className="font-mono"
          style={{
            fontSize: 14,
            color: "var(--ov-fg-dim)",
            marginTop: 18,
            letterSpacing: "0.04em",
            maxWidth: 640,
            lineHeight: 1.6,
          }}
        >
          Community bear theses. Real broker execution. Back your reviews with capital — or shut up.
        </p>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 28,
          borderBottom: "1px solid var(--ov-hairline)",
          overflowX: "auto",
        }}
      >
        {FILTERS.map((f) => {
          const isActive = f.key === activeKey;
          return (
            <Link
              key={f.key}
              href={f.href}
              className={`ov-nav-link ${isActive ? "active" : ""}`}
              style={{ padding: "12px 18px", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {stocks.length === 0 ? (
        <div
          className="ov-card"
          style={{ textAlign: "center", padding: 64, color: "var(--ov-fg-dim)" }}
        >
          <div className="eyebrow" style={{ marginBottom: 10 }}>NO STOCKS YET</div>
          <div className="font-mono" style={{ fontSize: 12 }}>
            Configure Supabase and run the seed migration to populate the leaderboard.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {stocks.map((s, i) => (
            <Link key={s.ticker} href={`/stock/${s.ticker}`} style={{ textDecoration: "none" }}>
              <StockCard data={toCardData(s, i)} seed={i + 1} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
