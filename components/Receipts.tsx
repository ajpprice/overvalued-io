import * as React from "react";

export interface ReceiptsProps {
  topTheses: { id: string; title: string; body: string }[];
}

export default function Receipts({ topTheses }: ReceiptsProps) {
  return (
    <div className="ov-card">
      <div className="eyebrow" style={{ marginBottom: 14 }}>THE RECEIPTS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {topTheses.length === 0 && (
          <div className="font-mono" style={{ fontSize: 12, color: "var(--ov-fg-dim)" }}>
            No theses yet. Be the first to bring receipts.
          </div>
        )}
        {topTheses.map((t) => (
          <blockquote
            key={t.id}
            style={{
              margin: 0,
              padding: "10px 14px",
              borderLeft: "2px solid var(--ov-red)",
              background: "var(--ov-surface-2)",
            }}
          >
            <div className="font-mono" style={{ fontSize: 12, color: "#fff", fontWeight: 700, marginBottom: 6, letterSpacing: "0.02em" }}>
              {t.title}
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: "var(--ov-fg-dim)", lineHeight: 1.55 }}>
              {t.body.length > 220 ? t.body.slice(0, 220) + "…" : t.body}
            </div>
          </blockquote>
        ))}
      </div>

      <div className="ov-hr" style={{ margin: "16px 0" }} />

      <div className="eyebrow" style={{ marginBottom: 8 }}>EXTERNAL SIGNALS</div>
      <div className="font-mono" style={{ fontSize: 11, color: "var(--ov-fg-mute)", lineHeight: 1.6, letterSpacing: "0.04em" }}>
        TRUSTPILOT INTEGRATION COMING SOON
        <br />
        SOCIAL SENTIMENT FEED COMING SOON
      </div>
    </div>
  );
}
