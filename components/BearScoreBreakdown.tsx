import * as React from "react";

export interface BreakdownProps {
  community: number;
  valuation: number;
  shortInterest: number;
  sentiment: number;
  total: number;
}

const PARTS = [
  { key: "community",     label: "COMMUNITY",      weight: 0.4,  color: "#E63946" },
  { key: "valuation",     label: "VALUATION",      weight: 0.25, color: "#FF8C42" },
  { key: "shortInterest", label: "SHORT INTEREST", weight: 0.15, color: "#C77DFF" },
  { key: "sentiment",     label: "SENTIMENT",      weight: 0.2,  color: "#4ECDC4" },
] as const;

export default function BearScoreBreakdown(props: BreakdownProps) {
  const contribs = PARTS.map((p) => {
    const raw = (props as any)[p.key] as number;
    return { ...p, raw, contrib: (Number.isFinite(raw) ? raw : 0) * p.weight };
  });
  const totalContrib = contribs.reduce((acc, c) => acc + c.contrib, 0) || 1;

  return (
    <div className="ov-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div className="eyebrow">BEAR SCORE BREAKDOWN</div>
        <div className="font-mono" style={{ fontSize: 12, color: "var(--ov-fg-dim)", letterSpacing: "0.18em" }}>
          TOTAL {Math.round(props.total)}/100
        </div>
      </div>

      <div className="ov-meter" style={{ height: 14, display: "flex" }}>
        {contribs.map((c) => (
          <span
            key={c.key}
            style={{
              display: "block",
              height: "100%",
              width: `${(c.contrib / totalContrib) * 100}%`,
              background: c.color,
            }}
          />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 14 }}>
        {contribs.map((c) => (
          <div key={c.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, background: c.color, display: "inline-block" }} />
              <span className="label">{c.label}</span>
            </div>
            <div className="font-mono" style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>
              {Math.round(c.raw || 0)}
              <span style={{ color: "var(--ov-fg-mute)", marginLeft: 6, fontSize: 10 }}>
                · {Math.round(c.weight * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
