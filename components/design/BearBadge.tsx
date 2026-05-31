import * as React from 'react';

export interface BearBadgeProps {
  score: number;
  /** 'md' = inline pill. 'xl' = 140px circle, pulses if score ≥ 85. */
  size?: 'md' | 'xl';
}

/**
 * OVERVALUED · Bear Score badge.
 * Pulses on scores ≥ 85 when size='xl'.
 */
export function BearBadge({ score, size = 'md' }: BearBadgeProps) {
  if (size === 'xl') {
    const pulsing = score >= 85;
    return (
      <div
        className={pulsing ? 'animate-ov-pulse' : ''}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 140,
          height: 140,
          background:
            'radial-gradient(circle at 50% 30%, #FF4858 0%, #E63946 40%, #7A1620 100%)',
          border: '2px solid #2A0A0E',
          boxShadow:
            '0 0 0 4px rgba(230,57,70,0.08), 0 0 60px rgba(230,57,70,0.25)',
          color: '#fff',
        }}
      >
        <div
          className="font-display"
          style={{ fontSize: 64, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          {score}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: 9,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            marginTop: 6,
            opacity: 0.9,
          }}
        >
          BEAR&nbsp;SCORE
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 4,
        padding: '6px 10px',
        background: 'linear-gradient(180deg, #E63946 0%, #9C1E2A 100%)',
        color: '#fff',
        border: '1px solid #2A0A0E',
      }}
      className="font-mono"
    >
      <span
        style={{
          fontSize: 8,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: 0.85,
        }}
      >
        BEAR
      </span>
      <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 700, letterSpacing: '0.02em' }}>
        {score}
      </span>
    </div>
  );
}
