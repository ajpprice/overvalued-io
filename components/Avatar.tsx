import * as React from "react";

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const PALETTE = [
  "#E63946",
  "#FF8C42",
  "#C77DFF",
  "#FFD23F",
  "#4ECDC4",
  "#FF5E5B",
  "#8AE6B4",
];

export default function Avatar({
  name,
  src,
  size = 56,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const bg = PALETTE[hashCode(name) % PALETTE.length];
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ display: "block", objectFit: "cover", border: "1px solid var(--ov-hairline-2)" }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        background: bg,
        color: "#0D0D0D",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: size * 0.4,
        letterSpacing: "-0.02em",
        border: "1px solid var(--ov-hairline-2)",
      }}
      aria-label={name}
    >
      {initials || "?"}
    </div>
  );
}
