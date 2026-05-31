import * as React from 'react';
import { LogoMark } from './LogoMark';

export interface LogoFullProps {
  scale?: number;
  showSub?: boolean;
  className?: string;
}

/**
 * OVERVALUED · Full lockup (icon + ▼ wordmark + tagline).
 * Use as the canonical brand mark in nav, headers, hero.
 */
export function LogoFull({ scale = 1, showSub = true, className }: LogoFullProps) {
  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 * scale }}>
      <LogoMark size={36 * scale} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 * scale, lineHeight: 1 }}>
        <div
          className="font-mono"
          style={{
            color: '#fff',
            fontSize: 18 * scale,
            fontWeight: 700,
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'baseline',
            gap: 8 * scale,
          }}
        >
          <span style={{ color: '#E63946' }}>▼</span>
          <span>OVERVALUED</span>
        </div>
        {showSub && (
          <div
            className="font-mono"
            style={{ color: '#7A7A7A', fontSize: 8 * scale, letterSpacing: '0.22em' }}
          >
            SHORT WHAT YOU HATE
          </div>
        )}
      </div>
    </div>
  );
}
