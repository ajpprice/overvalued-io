import Link from "next/link";

export const dynamic = "force-static";

type Tab = "1m" | "3m" | "1y";

const TABS: { key: Tab; label: string }[] = [
  { key: "1m", label: "1M" },
  { key: "3m", label: "3M" },
  { key: "1y", label: "1Y" },
];

export default function LeaderboardPage({ searchParams }: { searchParams: { range?: string } }) {
  const active = (TABS.find((t) => t.key === searchParams.range)?.key ?? "3m") as Tab;

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 36px" }}>
      <div className="ov-fade-in" style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>LEADERBOARD</div>
        <h1
          className="font-display"
          style={{ fontSize: 56, color: "#fff", letterSpacing: "-0.005em", lineHeight: 1, margin: 0 }}
        >
          THE BEST BEARS
        </h1>
        <p
          className="font-mono"
          style={{
            fontSize: 13,
            color: "var(--ov-fg-dim)",
            marginTop: 12,
            letterSpacing: "0.04em",
            maxWidth: 640,
          }}
        >
          Ranked by prediction accuracy across resolved theses. The ones who called it before the chart did.
        </p>
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid var(--ov-hairline)" }}>
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <Link
              key={t.key}
              href={`/leaderboard?range=${t.key}`}
              className={`ov-nav-link ${isActive ? "active" : ""}`}
              style={{ padding: "12px 22px", textDecoration: "none" }}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Column header for visual structure */}
      <div className="ov-card" style={{ padding: 0 }}>
        <table className="ov-tbl">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>USERNAME</th>
              <th style={{ textAlign: "right" }}>REPUTATION</th>
              <th style={{ textAlign: "right" }}>WIN RATE</th>
              <th>BEST CALL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ padding: 0 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "72px 24px",
                    gap: 14,
                    background: "var(--ov-surface-2)",
                  }}
                >
                  <div className="eyebrow" style={{ color: "var(--ov-red)" }}>EMPTY</div>
                  <div
                    className="font-display"
                    style={{ fontSize: 32, color: "#fff", letterSpacing: "-0.005em", textAlign: "center" }}
                  >
                    LEADERBOARD ACTIVATES WHEN THESES RESOLVE
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 12,
                      color: "var(--ov-fg-dim)",
                      letterSpacing: "0.04em",
                      lineHeight: 1.6,
                      maxWidth: 520,
                      textAlign: "center",
                    }}
                  >
                    Theses need a <code>resolved_outcome</code> of <code>correct</code> or <code>incorrect</code> to
                    count toward accuracy. No outcomes resolved yet for the {active.toUpperCase()} window.
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
