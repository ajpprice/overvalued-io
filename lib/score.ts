export function scoreColor(score: number): { color: string; label: string; className: string } {
  if (score > 70) {
    return { color: "#ef4444", label: "OVERVALUED", className: "text-bear" };
  }
  if (score >= 40) {
    return { color: "#f59e0b", label: "WATCH", className: "text-amber" };
  }
  return { color: "#9ca3af", label: "CONTESTED", className: "text-muted" };
}

export function computeBearScore(upvotes: number, downvotes: number, totalVotes: number): number {
  return ((upvotes - downvotes) / (upvotes + downvotes + 1)) * Math.log(totalVotes + 1);
}
