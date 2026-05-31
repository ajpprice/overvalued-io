"use client";
import * as React from 'react';

export interface BrokerButtonProps {
  name: string;
  sub: string;
  badge?: string;
  onClick?: () => void;
}

/**
 * OVERVALUED · Broker button.
 * Full-width, squared, dark. Functional, not decorative.
 * Used inside the SHORT IT panel on stock + bags-profile pages.
 */
export function BrokerButton({ name, sub, badge, onClick }: BrokerButtonProps) {
  return (
    <button
      className="ov-btn ov-btn-dark"
      onClick={onClick}
      style={{ width: '100%', justifyContent: 'space-between', padding: '14px 16px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
        <div className="font-mono" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>{name}</div>
        <div className="font-mono" style={{ fontSize: 9, color: 'var(--ov-fg-dim)', letterSpacing: '0.18em', fontWeight: 400 }}>{sub}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {badge && <span className="font-mono" style={{ fontSize: 9, color: 'var(--ov-red)', letterSpacing: '0.2em' }}>{badge}</span>}
        <span style={{ color: 'var(--ov-red)', fontSize: 14 }}>→</span>
      </div>
    </button>
  );
}