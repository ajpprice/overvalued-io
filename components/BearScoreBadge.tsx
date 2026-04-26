import { scoreColor } from "@/lib/score";

export default function BearScoreBadge({ score, large = false }: { score: number; large?: boolean }) {
  const { label, className } = scoreColor(score);
  const display = Number.isFinite(score) ? score.toFixed(1) : "—";
  return (
    <div className={`flex items-baseline gap-3 ${large ? "" : ""}`}>
      <div className={`ticker font-bold ${large ? "text-6xl" : "text-2xl"} ${className}`}>{display}</div>
      <div className={`uppercase tracking-widest text-xs ${className}`}>{label}</div>
    </div>
  );
}
