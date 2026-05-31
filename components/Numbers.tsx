import * as React from "react";

export interface NumbersProps {
  currentPrice: number | null;
  valuationDiscountPct: number | null;
  shortInterestPct: number | null;
  insiderSelling3mUsd: number | null;
  trustpilotScore: number | null;
  redditSentiment: number | null;
}

function fmtMoney(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function fmtBigMoney(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}

function Stars({ value }: { value: number | null }) {
  if (value == null) return <span style={{ color: "var(--ov-fg-dim)" }}>—</span>;
  const rounded = Math.round(value);
  return (
    <span className="font-mono" style={{ color: "#fff", letterSpacing: "0.12em" }}>
      {"★".repeat(rounded)}
      <span style={{ color: "var(--ov-fg-mute)" }}>{"★".repeat(Math.max(0, 5 - rounded))}</span>
      <span style={{ color: "var(--ov-fg-dim)", marginLeft: 8, fontSize: 11 }}>{value.toFixed(1)}/5</span>
    </span>
  );
}

function SentimentBar({ value }: { value: number | null }) {
  if (value == null) return <span style={{ color: "var(--ov-fg-dim)" }}>—</span>;
  const clamped = Math.max(-1, Math.min(1, value));
  const pct = ((clamped + 1) / 2) * 100;
  const color = clamped < 0 ? "var(--ov-red)" : "var(--ov-cat-undervalued)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 120, height: 6, background: "#1A1A20", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${pct}%`,
            height: "100%",
            background: color,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -2,
            width: 1,
            height: 10,
            background: "var(--ov-fg-mute)",
          }}
        />
      </div>
      <span className="font-mono" style={{ fontSize: 11, color: "#fff" }}>
        {clamped > 0 ? "+" : ""}
        {clamped.toFixed(2)}
      </span>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid var(--ov-hairline)",
      }}
    >
      <div className="label">{label}</div>
      <div className="font-mono" style={{ fontSize: 13, color: "#fff", letterSpacing: "0.02em" }}>
        {children}
      </div>
    </div>
  );
}

export default function Numbers(props: NumbersProps) {
  const intrinsic =
    props.currentPrice != null && props.valuationDiscountPct != null
      ? props.currentPrice * (1 + props.valuationDiscountPct / 100)
      : null;
  const overPct = props.valuationDiscountPct;

  return (
    <div className="ov-card">
      <div className="eyebrow" style={{ marginBottom: 14 }}>THE NUMBERS</div>
      <Row label="CURRENT PRICE">{fmtMoney(props.currentPrice)}</Row>
      <Row label="INTRINSIC VALUE">{fmtMoney(intrinsic)}</Row>
      <Row label="OVERVALUED">
        <span style={{ color: overPct != null && overPct > 0 ? "var(--ov-red)" : "#fff" }}>
          {overPct != null ? `${overPct.toFixed(0)}%` : "—"}
        </span>
      </Row>
      <Row label="SHORT INTEREST">
        {props.shortInterestPct != null ? `${props.shortInterestPct.toFixed(1)}%` : "—"}
      </Row>
      <Row label="INSIDER SELLING 3M">{fmtBigMoney(props.insiderSelling3mUsd)}</Row>
      <Row label="TRUSTPILOT">
        <Stars value={props.trustpilotScore} />
      </Row>
      <Row label="REDDIT SENTIMENT">
        <SentimentBar value={props.redditSentiment} />
      </Row>
    </div>
  );
}
