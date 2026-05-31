import * as React from 'react';

export interface LogoStampProps {
  scale?: number;
  opacity?: number;
}

/**
 * OVERVALUED · Stamp (secondary "rejected" mark).
 * Auditor-style struck wordmark. Use on report covers, merch, watermarks.
 */
export function LogoStamp({ scale = 1, opacity = 1 }: LogoStampProps) {
  return (
    <div
      style={{
        display: 'inline-block',
        transform: 'rotate(-8deg)',
        border: `${4 * scale}px solid #E63946`,
        padding: `${8 * scale}px ${16 * scale}px ${5 * scale}px`,
        position: 'relative',
        opacity,
      }}
    >
      <div
        className="font-display"
        style={{
          color: '#E63946',
          fontSize: 56 * scale,
          lineHeight: 0.85,
          letterSpacing: '-0.01em',
        }}
      >
        OVERVALUED
      </div>
      <div
        className="font-mono"
        style={{
          color: '#E63946',
          fontSize: 7 * scale,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginTop: 3 * scale,
          textAlign: 'right',
        }}
      >
        REJ. 05·2026 / NO BID
      </div>
      <div
        style={{
          position: 'absolute',
          left: -4 * scale,
          right: -4 * scale,
          top: '50%',
          height: 3 * scale,
          background: '#E63946',
          transform: 'translateY(-50%) rotate(2deg)',
        }}
      />
    </div>
  );
}
