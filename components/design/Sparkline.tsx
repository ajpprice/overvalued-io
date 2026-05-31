import * as React from 'react';

export interface SparklineProps {
  width?: number;
  height?: number;
  /** Deterministic seed for the descending zigzag pattern. */
  seed?: number;
  color?: string;
}

/**
 * Deterministic descending sparkline. No real data — purely decorative
 * for cards and headers. For real series, replace with a data-driven chart.
 */
export function Sparkline({ width = 120, height = 32, seed = 1, color = '#E63946' }: SparklineProps) {
  const pts: string[] = [];
  let y = 6;
  for (let i = 0; i <= 12; i++) {
    const x = (i * width) / 12;
    const noise = ((seed * (i + 1)) % 7) - 2;
    y += 2 + noise * 0.4;
    if (y > height - 4) y = height - 4;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5" />
      <line x1="0" y1={height - 1} x2={width} y2={height - 1} stroke="#1A1A20" strokeWidth="1" />
    </svg>
  );
}
