import { BearBadge } from "@/components/design/BearBadge";

export default function BearScoreBadge({
  score,
  size = "md",
  large,
}: {
  score: number;
  size?: "md" | "xl";
  large?: boolean;
}) {
  const s = large || size === "xl" ? "xl" : "md";
  const safe = Number.isFinite(score) ? Math.round(score) : 0;
  return <BearBadge score={safe} size={s} />;
}

export { BearBadge };
