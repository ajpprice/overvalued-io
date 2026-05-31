"use client";
import * as React from 'react';
import { LogoFull } from './LogoFull';

export interface NavProps {
  active?: 'STOCKS' | 'BAGS' | 'THESES' | 'WATCHLIST' | 'LEADERBOARD';
  mobile?: boolean;
  onNav?: (link: string) => void;
}

/**
 * OVERVALUED · Top nav.
 * Desktop: logo + 5 links + sign-in CTA. Mobile: logo + hamburger.
 */
export function Nav({ active = 'STOCKS', mobile = false, onNav }: NavProps) {
  if (mobile) {
    return (
      <div className="ov-nav" style={{ padding: '14px 18px' }}>
        <LogoFull scale={0.75} showSub={false} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ width: 22, height: 2, background: '#fff' }} />
          <div style={{ width: 22, height: 2, background: '#fff' }} />
          <div style={{ width: 22, height: 2, background: '#fff' }} />
        </div>
      </div>
    );
  }
  const links: NavProps['active'][] = ['STOCKS', 'BAGS', 'THESES', 'WATCHLIST', 'LEADERBOARD'];
  return (
    <div className="ov-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <LogoFull scale={0.9} />
        <div style={{ display: 'flex', gap: 28 }}>
          {links.map(l => (
            <span
              key={l}
              className={`ov-nav-link ${active === l ? 'active' : ''}`}
              onClick={() => onNav?.(l!)}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span className="font-mono" style={{ fontSize: 10, color: 'var(--ov-fg-dim)', letterSpacing: '0.2em' }}>
          BEAR FEED · 14:22 ET
        </span>
        <button className="ov-btn ov-btn-primary">SIGN IN ▼</button>
      </div>
    </div>
  );
}