import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";

export interface ThesisCardData {
  id: string;
  ticker: string;
  title: string;
  body: string;
  key_risks: string[];
  target_price: number | null;
  time_horizon: string | null;
  upvotes: number;
  downvotes: number;
  created_at: string;
  author_reputation?: number | null;
}

export default function ThesisCard({ thesis, truncated = false }: { thesis: ThesisCardData; truncated?: boolean }) {
  const score = thesis.upvotes - thesis.downvotes;
  const age = (() => {
    try {
      return formatDistanceToNow(new Date(thesis.created_at), { addSuffix: true });
    } catch {
      return "";
    }
  })();

  return (
    <article className="ov-card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <Link
          href={`/stock/${thesis.ticker}`}
          className="font-mono"
          style={{ color: "var(--ov-red)", fontWeight: 700, letterSpacing: "0.04em", fontSize: 12 }}
        >
          ${thesis.ticker}
        </Link>
        <span className="font-mono" style={{ fontSize: 10, color: "var(--ov-fg-mute)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          {age}
        </span>
      </div>
      <h3
        className="font-display"
        style={{ fontSize: 22, color: "#fff", lineHeight: 1.1, marginBottom: 10, letterSpacing: "-0.005em" }}
      >
        {thesis.title.toUpperCase()}
      </h3>
      <div
        className="font-mono"
        style={{ fontSize: 12, color: "var(--ov-fg-dim)", lineHeight: 1.6, letterSpacing: "0.02em" }}
      >
        <div className={truncated ? "line-clamp-3" : ""}>
          <ReactMarkdown>{thesis.body}</ReactMarkdown>
        </div>
      </div>
      {thesis.key_risks?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {thesis.key_risks.map((r) => (
            <span key={r} className="ov-tag" style={{ color: "var(--ov-fg-dim)" }}>
              RISK · {r}
            </span>
          ))}
        </div>
      )}
      <div
        className="font-mono"
        style={{
          display: "flex",
          gap: 18,
          marginTop: 14,
          paddingTop: 10,
          borderTop: "1px solid var(--ov-hairline)",
          fontSize: 11,
          color: "var(--ov-fg-dim)",
          letterSpacing: "0.1em",
        }}
      >
        <span>▲ {thesis.upvotes}</span>
        <span>▼ {thesis.downvotes}</span>
        <span>NET {score >= 0 ? "+" : ""}{score}</span>
        {thesis.target_price != null && <span>PT ${thesis.target_price}</span>}
        {thesis.time_horizon && <span>{thesis.time_horizon.toUpperCase()}</span>}
      </div>
    </article>
  );
}
