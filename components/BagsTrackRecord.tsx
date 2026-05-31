import * as React from "react";

export interface BagsPick {
  id: string;
  ticker_or_name: string;
  pick_date: string | null;
  pick_price: number | null;
  current_price: number | null;
  return_pct: number | null;
  notes?: string | null;
}

function fmt(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function fmtDate(d: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return d;
  }
}

export default function BagsTrackRecord({ picks }: { picks: BagsPick[] }) {
  return (
    <table className="ov-tbl">
      <thead>
        <tr>
          <th>PICK</th>
          <th>DATE</th>
          <th style={{ textAlign: "right" }}>PICK $</th>
          <th style={{ textAlign: "right" }}>NOW $</th>
          <th style={{ textAlign: "right" }}>RETURN</th>
        </tr>
      </thead>
      <tbody>
        {picks.length === 0 && (
          <tr>
            <td colSpan={5} style={{ color: "var(--ov-fg-dim)", textAlign: "center" }}>No picks on record.</td>
          </tr>
        )}
        {picks.map((p) => {
          // Positive return = pump worked = bad for bear framing → RED. Negative = neutral fg.
          const cls = p.return_pct != null && p.return_pct > 0 ? "num red" : "num";
          return (
            <tr key={p.id}>
              <td style={{ color: "#fff", fontWeight: 500 }}>{p.ticker_or_name}</td>
              <td style={{ color: "var(--ov-fg-dim)" }}>{fmtDate(p.pick_date)}</td>
              <td className="num">{fmt(p.pick_price)}</td>
              <td className="num">{fmt(p.current_price)}</td>
              <td className={cls}>
                {p.return_pct != null ? `${p.return_pct > 0 ? "+" : ""}${p.return_pct.toFixed(1)}%` : "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
