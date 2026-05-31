import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Avatar from "@/components/Avatar";
import BagsTrackRecord, { BagsPick } from "@/components/BagsTrackRecord";
import { ShortItPanel } from "@/components/design/ShortItPanel";

export const dynamic = "force-dynamic";

interface BagsProfileRow {
  id: string;
  slug: string;
  name: string;
  profile_type: "vc" | "podcaster" | "politician";
  bags_score: number;
  description: string | null;
  track_record_summary: string | null;
  avatar_url: string | null;
}

interface PickRow extends BagsPick {
  bags_profile_id: string;
}

interface StockRow {
  ticker: string;
}

const TYPE_LABEL: Record<string, string> = {
  vc: "VC",
  podcaster: "PODCASTER",
  politician: "POLITICIAN",
};

export default async function BagsProfilePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  if (!supabase) {
    // Without a configured DB we can't render — show a stub.
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 36px" }}>
        <div className="ov-card" style={{ padding: 32, textAlign: "center", color: "var(--ov-fg-dim)" }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>SUPABASE NOT CONFIGURED</div>
          <div className="font-mono" style={{ fontSize: 12 }}>
            Populate <code>NEXT_PUBLIC_SUPABASE_URL</code> and the anon key, then return.
          </div>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("bags_profiles")
    .select("id,slug,name,profile_type,bags_score,description,track_record_summary,avatar_url")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!profile) notFound();
  const p = profile as BagsProfileRow;

  const { data: pickRows } = await supabase
    .from("bags_picks")
    .select("id,bags_profile_id,ticker_or_name,pick_date,pick_price,current_price,return_pct,notes")
    .eq("bags_profile_id", p.id)
    .order("pick_date", { ascending: false });
  const picks = (pickRows ?? []) as PickRow[];

  // Find which picks correspond to real stocks in our catalog → eligible for "Fade This Pick".
  const candidateTickers = picks
    .map((pk) => pk.ticker_or_name.toUpperCase())
    .filter((t) => /^[A-Z.]{1,8}$/.test(t));
  const { data: stockMatches } = candidateTickers.length
    ? await supabase.from("stocks").select("ticker").in("ticker", candidateTickers)
    : { data: [] as StockRow[] };
  const matchedTickers = new Set((stockMatches ?? []).map((s) => (s as StockRow).ticker));
  const fadeable = picks.filter((pk) => matchedTickers.has(pk.ticker_or_name.toUpperCase()));

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 36px" }}>
      <Link
        href="/bags"
        className="font-mono"
        style={{ fontSize: 10, color: "var(--ov-fg-dim)", letterSpacing: "0.22em", textDecoration: "none" }}
      >
        ← ALL BAGS
      </Link>

      {/* Header */}
      <div
        className="ov-fade-in"
        style={{ display: "flex", alignItems: "flex-start", gap: 24, marginTop: 20, marginBottom: 32 }}
      >
        <Avatar name={p.name} src={p.avatar_url ?? undefined} size={96} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>{TYPE_LABEL[p.profile_type]}</div>
          <h1
            className="font-display"
            style={{ fontSize: 56, color: "#fff", letterSpacing: "-0.005em", lineHeight: 1, margin: 0 }}
          >
            {p.name.toUpperCase()}
          </h1>
          {p.description && (
            <p
              className="font-mono"
              style={{
                fontSize: 12,
                color: "var(--ov-fg-dim)",
                marginTop: 14,
                letterSpacing: "0.04em",
                lineHeight: 1.6,
                maxWidth: 560,
              }}
            >
              {p.description}
            </p>
          )}
        </div>
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "14px 22px",
            border: "1px solid var(--ov-cat-bags)",
            color: "var(--ov-cat-bags)",
          }}
        >
          <span className="font-mono" style={{ fontSize: 9, letterSpacing: "0.32em" }}>BAGS SCORE</span>
          <span className="font-display" style={{ fontSize: 56, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {Math.round(Number(p.bags_score) || 0)}
          </span>
        </div>
      </div>

      {/* Track record */}
      <section className="ov-card" style={{ padding: 0, marginBottom: 24 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--ov-hairline)" }}>
          <div className="eyebrow">TRACK RECORD</div>
        </div>
        <BagsTrackRecord picks={picks} />
      </section>

      {/* Two columns: commentary + fade picks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="ov-card">
          <div className="eyebrow" style={{ marginBottom: 14 }}>COMMUNITY COMMENTARY</div>
          <div
            className="font-mono"
            style={{ fontSize: 11, color: "var(--ov-fg-mute)", letterSpacing: "0.04em", lineHeight: 1.6 }}
          >
            THESIS-ON-BAGS COMING SOON.
            <br />
            FOLLOW THE PICKS. WAIT FOR THE FADE.
          </div>
        </div>

        <div>
          {fadeable.length > 0 ? (
            <ShortItPanel
              ticker={fadeable[0].ticker_or_name.toUpperCase()}
              blurb={`Fade ${p.name.split(" ")[0]}'s loudest pick.`}
            />
          ) : (
            <div className="ov-card" style={{ padding: 24, color: "var(--ov-fg-dim)" }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>FADE THIS PICK</div>
              <div className="font-mono" style={{ fontSize: 11, lineHeight: 1.6 }}>
                No picks in this profile match a stock in the catalog yet.
              </div>
            </div>
          )}
        </div>
      </div>

      {fadeable.length > 1 && (
        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {fadeable.slice(1).map((pk) => (
            <ShortItPanel key={pk.id} ticker={pk.ticker_or_name.toUpperCase()} />
          ))}
        </div>
      )}
    </div>
  );
}
