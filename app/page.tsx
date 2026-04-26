import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BearScoreBadge from "@/components/BearScoreBadge";

export const dynamic = "force-dynamic";

interface StockRow {
  ticker: string;
  name: string;
  bear_score: number;
  total_theses: number;
  total_votes: number;
}

async function getStocks(): Promise<StockRow[]> {
  const supabase = createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("stocks")
    .select("ticker,name,bear_score,total_theses,total_votes")
    .order("bear_score", { ascending: false })
    .limit(50);
  if (error) return [];
  return (data ?? []) as StockRow[];
}

export default async function Home() {
  const stocks = await getStocks();
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="headline text-5xl font-bold tracking-tight mb-2">Most Overvalued</h1>
        <p className="text-muted text-sm">Ranked by community Bear Score. The higher the number, the louder the bears.</p>
      </div>

      {stocks.length === 0 ? (
        <div className="border border-border bg-panel p-8 text-center text-muted">
          No stocks yet. Once Supabase is configured and seeded, the leaderboard appears here.
        </div>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {stocks.map((s, i) => (
            <li key={s.ticker}>
              <Link
                href={`/stock/${s.ticker}`}
                className="grid grid-cols-12 gap-4 items-center py-5 hover:bg-panel transition-colors px-2"
              >
                <div className="col-span-1 text-muted ticker text-sm">{(i + 1).toString().padStart(2, "0")}</div>
                <div className="col-span-3">
                  <div className="ticker text-bear text-2xl font-bold">{s.ticker}</div>
                  <div className="text-xs text-muted truncate">{s.name}</div>
                </div>
                <div className="col-span-4">
                  <BearScoreBadge score={Number(s.bear_score) || 0} />
                </div>
                <div className="col-span-2 text-xs text-muted ticker">
                  {s.total_theses} theses
                </div>
                <div className="col-span-2 text-xs text-muted ticker text-right">
                  {s.total_votes} votes
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
