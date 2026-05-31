import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getQuote } from "@/lib/finnhub";
import { BearBadge } from "@/components/design/BearBadge";
import { ShortItPanel } from "@/components/design/ShortItPanel";
import { CAT_LABEL, StockCategory } from "@/components/design/types";
import Numbers from "@/components/Numbers";
import Receipts from "@/components/Receipts";
import BearScoreBreakdown from "@/components/BearScoreBreakdown";
import ThesisCard, { ThesisCardData } from "@/components/ThesisCard";
import VoteButtons from "@/components/VoteButtons";

export const dynamic = "force-dynamic";

interface StockRow {
  ticker: string;
  name: string;
  exchange: string | null;
  current_price: number | null;
  bear_score: number;
  bear_score_community: number;
  bear_score_valuation: number;
  bear_score_short_interest: number;
  bear_score_sentiment: number;
  valuation_discount_pct: number | null;
  short_interest_pct: number | null;
  insider_selling_3m_usd: number | null;
  trustpilot_score: number | null;
  reddit_sentiment: number | null;
  category: StockCategory;
  total_theses: number;
  total_votes: number;
}

export default async function StockPage({ params }: { params: { ticker: string } }) {
  const ticker = params.ticker.toUpperCase();
  const supabase = createClient();

  let stock: StockRow | null = null;
  let theses: ThesisCardData[] = [];

  if (supabase) {
    const { data: s } = await supabase
      .from("stocks")
      .select(
        "ticker,name,exchange,current_price,bear_score,bear_score_community,bear_score_valuation,bear_score_short_interest,bear_score_sentiment,valuation_discount_pct,short_interest_pct,insider_selling_3m_usd,trustpilot_score,reddit_sentiment,category,total_theses,total_votes"
      )
      .eq("ticker", ticker)
      .maybeSingle();
    stock = s as StockRow | null;
    if (!stock) notFound();

    const { data: t } = await supabase
      .from("theses")
      .select("id,ticker,title,body,key_risks,target_price,time_horizon,upvotes,downvotes,created_at")
      .eq("ticker", ticker)
      .order("upvotes", { ascending: false });
    theses = (t ?? []) as ThesisCardData[];
  } else {
    stock = {
      ticker,
      name: ticker,
      exchange: null,
      current_price: null,
      bear_score: 0,
      bear_score_community: 0,
      bear_score_valuation: 0,
      bear_score_short_interest: 0,
      bear_score_sentiment: 0,
      valuation_discount_pct: null,
      short_interest_pct: null,
      insider_selling_3m_usd: null,
      trustpilot_score: null,
      reddit_sentiment: null,
      category: "valuation",
      total_theses: 0,
      total_votes: 0,
    };
  }

  const quote = await getQuote(ticker);
  const livePrice = quote.price ?? stock!.current_price;
  const top3 = theses.slice(0, 3);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 36px 64px" }}>
      <Link
        href="/"
        className="font-mono"
        style={{ fontSize: 10, color: "var(--ov-fg-dim)", letterSpacing: "0.22em", textDecoration: "none" }}
      >
        ← MOST OVERVALUED
      </Link>

      {/* Header */}
      <div
        className="ov-fade-in"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 32,
          marginTop: 20,
          marginBottom: 36,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            {stock!.exchange && <span className="label">{stock!.exchange}</span>}
            <span className={`ov-tag cat-${stock!.category}`}>{CAT_LABEL[stock!.category]}</span>
          </div>
          <div
            className="font-display"
            style={{ fontSize: 96, color: "#fff", letterSpacing: "-0.02em", lineHeight: 0.95 }}
          >
            {stock!.ticker}
          </div>
          <div
            className="font-mono"
            style={{ fontSize: 16, color: "var(--ov-fg-dim)", marginTop: 6, letterSpacing: "0.02em" }}
          >
            {stock!.name}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 32, marginTop: 24 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>PRICE</div>
              <div className="font-mono" style={{ fontSize: 32, color: "#fff", fontWeight: 700, lineHeight: 1 }}>
                {livePrice != null ? `$${Number(livePrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"}
              </div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>TODAY</div>
              <div
                className="font-mono"
                style={{
                  fontSize: 24,
                  color: quote.percentChange != null && quote.percentChange < 0 ? "var(--ov-red)" : "#fff",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                {quote.percentChange != null
                  ? `${quote.percentChange >= 0 ? "+" : ""}${quote.percentChange.toFixed(2)}%`
                  : "—"}
              </div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>THESES</div>
              <div className="font-mono" style={{ fontSize: 24, color: "#fff", fontWeight: 500, lineHeight: 1 }}>
                {stock!.total_theses}
              </div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>VOTES</div>
              <div className="font-mono" style={{ fontSize: 24, color: "#fff", fontWeight: 500, lineHeight: 1 }}>
                {stock!.total_votes}
              </div>
            </div>
          </div>
        </div>
        <BearBadge score={Math.round(Number(stock!.bear_score) || 0)} size="xl" />
      </div>

      {/* Numbers + Receipts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Numbers
          currentPrice={livePrice}
          valuationDiscountPct={stock!.valuation_discount_pct}
          shortInterestPct={stock!.short_interest_pct}
          insiderSelling3mUsd={stock!.insider_selling_3m_usd}
          trustpilotScore={stock!.trustpilot_score}
          redditSentiment={stock!.reddit_sentiment}
        />
        <Receipts topTheses={top3.map((t) => ({ id: t.id, title: t.title, body: t.body }))} />
      </div>

      {/* Bear Score Breakdown */}
      <div style={{ marginBottom: 24 }}>
        <BearScoreBreakdown
          community={Number(stock!.bear_score_community) || 0}
          valuation={Number(stock!.bear_score_valuation) || 0}
          shortInterest={Number(stock!.bear_score_short_interest) || 0}
          sentiment={Number(stock!.bear_score_sentiment) || 0}
          total={Number(stock!.bear_score) || 0}
        />
      </div>

      {/* Short It */}
      <div style={{ marginBottom: 36 }}>
        <ShortItPanel ticker={stock!.ticker} blurb="Take a position with a regulated third-party broker." />
      </div>

      {/* All theses */}
      <section>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h2
            className="font-display"
            style={{ fontSize: 32, color: "#fff", letterSpacing: "-0.005em", margin: 0 }}
          >
            ALL THESES
          </h2>
          <Link
            href="/submit"
            className="font-mono"
            style={{
              fontSize: 10,
              color: "var(--ov-red)",
              letterSpacing: "0.22em",
              textDecoration: "none",
            }}
          >
            + ADD THESIS
          </Link>
        </div>
        {theses.length === 0 ? (
          <div
            className="ov-card"
            style={{ textAlign: "center", padding: 48, color: "var(--ov-fg-dim)" }}
          >
            <div className="font-mono" style={{ fontSize: 12, letterSpacing: "0.04em" }}>
              No theses yet. Be the first to bring receipts.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {theses.map((t) => (
              <div key={t.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <ThesisCard thesis={t} />
                <div style={{ paddingLeft: 4 }}>
                  <VoteButtons thesisId={t.id} initialUp={t.upvotes} initialDown={t.downvotes} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
