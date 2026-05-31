import { createClient } from "@/lib/supabase/server";
import BagsProfileCard from "@/components/BagsProfileCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface BagsProfileRow {
  id: string;
  slug: string;
  name: string;
  profile_type: "vc" | "podcaster" | "politician";
  bags_score: number;
  track_record_summary: string | null;
  avatar_url: string | null;
  created_at: string;
}

type SortKey = "score" | "wrong" | "recent";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "BAGS SCORE" },
  { key: "wrong", label: "MOST WRONG" },
  { key: "recent", label: "MOST RECENT PICK" },
];

async function getProfiles(sort: SortKey): Promise<BagsProfileRow[]> {
  const supabase = createClient();
  if (!supabase) return [];
  // "wrong" and "score" both sort by bags_score desc for now;
  // a future iteration will compute "most wrong" from worst pick returns.
  const orderCol = sort === "recent" ? "created_at" : "bags_score";
  const { data, error } = await supabase
    .from("bags_profiles")
    .select("id,slug,name,profile_type,bags_score,track_record_summary,avatar_url,created_at")
    .order(orderCol, { ascending: false });
  if (error) return [];
  return (data ?? []) as BagsProfileRow[];
}

export default async function BagsPage({ searchParams }: { searchParams: { sort?: string } }) {
  const sort = (SORTS.find((s) => s.key === searchParams.sort)?.key ?? "score") as SortKey;
  const profiles = await getProfiles(sort);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 36px" }}>
      <div className="ov-fade-in" style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>BAGS</div>
        <h1
          className="font-display"
          style={{ fontSize: 56, color: "#fff", letterSpacing: "-0.005em", lineHeight: 1, margin: 0 }}
        >
          THE PUMP MERCHANTS
        </h1>
        <p
          className="font-mono"
          style={{ fontSize: 13, color: "var(--ov-fg-dim)", marginTop: 12, letterSpacing: "0.04em", maxWidth: 640 }}
        >
          VCs, podcasters, and politicians who load you up. Track the picks. Fade the conviction.
        </p>
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid var(--ov-hairline)" }}>
        {SORTS.map((s) => {
          const active = s.key === sort;
          return (
            <Link
              key={s.key}
              href={`/bags?sort=${s.key}`}
              className={`ov-nav-link ${active ? "active" : ""}`}
              style={{ padding: "12px 18px", textDecoration: "none" }}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      {profiles.length === 0 ? (
        <div
          className="ov-card"
          style={{ textAlign: "center", padding: 48, color: "var(--ov-fg-dim)" }}
        >
          <div className="eyebrow" style={{ marginBottom: 10 }}>NO PROFILES YET</div>
          <div className="font-mono" style={{ fontSize: 12 }}>
            Configure Supabase and run the seed to populate the bags catalog.
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
          {profiles.map((p) => (
            <BagsProfileCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              profileType={p.profile_type}
              bagsScore={Number(p.bags_score) || 0}
              trackRecordSummary={p.track_record_summary}
              avatarUrl={p.avatar_url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
