export function scoreColor(score: number): { color: string; label: string; className: string } {
  if (score > 70) {
    return { color: "#E63946", label: "OVERVALUED", className: "text-bear" };
  }
  if (score >= 40) {
    return { color: "#f59e0b", label: "WATCH", className: "text-amber" };
  }
  return { color: "#9ca3af", label: "CONTESTED", className: "text-muted" };
}

export function computeBearScore(upvotes: number, downvotes: number, totalVotes: number): number {
  return ((upvotes - downvotes) / (upvotes + downvotes + 1)) * Math.log(totalVotes + 1);
}

export function bagsScoreLabel(score: number): string {
  if (score >= 90) return "SERIAL BAG-HOLDER";
  if (score >= 75) return "FREQUENT BAG-HOLDER";
  if (score >= 50) return "MIXED RECORD";
  return "OCCASIONAL HIT";
}

export const CATEGORY_LABEL: Record<string, string> = {
  valuation: "Valuation",
  consumer_hate: "Consumer Hate",
  brand_decay: "Brand Decay",
  bags: "Bags",
  structural_decay: "Structural Decay",
  never_profitable: "Never Profitable",
  undervalued: "Undervalued · DCF",
};
