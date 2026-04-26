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
    <article className="border border-border bg-panel p-5 rounded-none">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <Link href={`/stock/${thesis.ticker}`} className="ticker text-bear font-bold text-sm">
          ${thesis.ticker}
        </Link>
        <span className="text-xs text-muted">{age}</span>
      </div>
      <h3 className="headline text-xl font-semibold mb-3 leading-snug">{thesis.title}</h3>
      <div className={`prose prose-invert prose-sm max-w-none text-ink/90 ${truncated ? "line-clamp-3" : ""}`}>
        <ReactMarkdown>{thesis.body}</ReactMarkdown>
      </div>
      {thesis.key_risks?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {thesis.key_risks.map((r) => (
            <span key={r} className="text-[10px] uppercase tracking-wider border border-border px-2 py-1 text-muted">
              risk: {r}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border text-xs text-muted ticker">
        <span>↑ {thesis.upvotes}</span>
        <span>↓ {thesis.downvotes}</span>
        <span>net {score >= 0 ? "+" : ""}{score}</span>
        {thesis.target_price != null && <span>PT ${thesis.target_price}</span>}
        {thesis.time_horizon && <span>{thesis.time_horizon}</span>}
        {thesis.author_reputation != null && <span>rep {thesis.author_reputation}</span>}
      </div>
    </article>
  );
}
