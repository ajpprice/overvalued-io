import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getQuote } from "@/lib/finnhub";
import BearScoreBadge from "@/components/BearScoreBadge";
import KrakenCTA from "@/components/KrakenCTA";
import ThesisCard, { ThesisCardData } from "@/components/ThesisCard";
import VoteButtons from "@/components/VoteButtons";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface StockRow {
  ticker: string;
  name: string;
  bear_score: number;
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
      .select("ticker,name,bear_score,total_theses,total_votes")
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
    stock = { ticker, name: ticker, bear_score: 0, total_theses: 0, total_votes: 0 };
  }

  const quote = await getQuote(ticker);
  const totalShortInterest = theses.reduce((acc, t) => acc + t.upvotes, 0);
  const top3 = theses.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link href="/" className="text-xs text-muted hover:text-bear ticker">← back to leaderboard</Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        <div className="md:col-span-2">
          <div className="ticker text-bear text-7xl font-bold tracking-tight">{stock!.ticker}</div>
          <div className="headline text-2xl text-ink/80 mt-2">{stock!.name}</div>

          <div className="flex items-baseline gap-6 mt-6 ticker">
            <div>
              <div className="text-xs text-muted uppercase">Price</div>
              <div className="text-2xl">{quote.price != null ? `$${quote.price.toFixed(2)}` : "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase">Today</div>
              <div className={`text-2xl ${quote.percentChange != null && quote.percentChange < 0 ? "text-bear" : "text-ink"}`}>
                {quote.percentChange != null ? `${quote.percentChange >= 0 ? "+" : ""}${quote.percentChange.toFixed(2)}%` : "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase">Short Interest (community)</div>
              <div className="text-2xl">{totalShortInterest}</div>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <div className="text-xs uppercase tracking-widest text-muted mb-2">Bear Score</div>
            <BearScoreBadge score={Number(stock!.bear_score) || 0} large />
          </div>

          <div className="mt-8">
            <KrakenCTA ticker={stock!.ticker} />
          </div>
        </div>

        <aside className="border border-border bg-panel p-5 h-fit">
          <div className="text-xs uppercase tracking-widest text-muted mb-3">Top theses</div>
          <ol className="space-y-3">
            {top3.length === 0 && <li className="text-sm text-muted">No theses yet.</li>}
            {top3.map((t, i) => (
              <li key={t.id} className="text-sm">
                <span className="ticker text-bear mr-2">{i + 1}.</span>
                {t.title}
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <section className="mt-14">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="headline text-3xl font-semibold">All Theses</h2>
          <Link href="/submit" className="text-xs uppercase tracking-widest text-bear hover:underline">+ Add Thesis</Link>
        </div>
        {theses.length === 0 && (
          <div className="border border-border bg-panel p-8 text-center text-muted">
            No theses yet. Be the first to short the narrative.
          </div>
        )}
        <div className="space-y-4">
          {theses.map((t) => (
            <div key={t.id} className="space-y-2">
              <ThesisCard thesis={t} />
              <div className="pl-1">
                <VoteButtons thesisId={t.id} initialUp={t.upvotes} initialDown={t.downvotes} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
