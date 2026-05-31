"use client";
import * as React from 'react';
import { BrokerButton } from './BrokerButton';

export interface ShortItPanelProps {
  ticker: string;
  /** Optional headline blurb above the broker list. */
  blurb?: string;
  brokers?: Array<{ name: string; sub: string; badge?: string; href?: string }>;
}

const DEFAULT_BROKERS = [
  { name: 'KRAKEN xSTOCKS', sub: 'CRYPTO-COLLATERAL · 0.05% FEE', badge: 'DEFI' },
  { name: 'IG',             sub: 'CFD · UK + EU · 1× MIN MARGIN' },
  { name: 'SAXO',           sub: 'EQUITY SHORT · INST GRADE',     badge: 'PRO' },
  { name: 'ETORO',          sub: 'COPY-SHORT · RETAIL FRIENDLY' },
];

/**
 * OVERVALUED · SHORT IT panel.
 * The most important UI element on the stock page.
 * 2px red top border is part of the brand — do not remove.
 */
export function ShortItPanel({ ticker, blurb, brokers = DEFAULT_BROKERS }: ShortItPanelProps) {
  return (
    <div className="ov-short-it">
      <div className="ov-short-it-head">
        <span className="font-display" style={{ fontSize: 22, letterSpacing: '0.04em' }}>SHORT IT</span>
        <span className="font-mono" style={{ fontSize: 10, color: 'var(--ov-red)', letterSpacing: '0.22em' }}>
          {brokers.length} BROKERS
        </span>
      </div>
      {blurb && (
        <div className="font-mono" style={{ fontSize: 11, color: 'var(--ov-fg-dim)', lineHeight: 1.5, marginBottom: 14 }}>
          {blurb}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {brokers.map(b => (
          <BrokerButton key={b.name} {...b} onClick={() => b.href && (window.location.href = b.href)} />
        ))}
      </div>
      <div className="ov-hr" style={{ margin: '16px 0 12px' }} />
      <div className="font-mono" style={{ fontSize: 9, color: 'var(--ov-fg-mute)', letterSpacing: '0.18em', lineHeight: 1.6 }}>
        ⚠ {ticker}: SHORT SELLING UNCAPPED LOSS · BORROW FEES APPLY · SQUEEZE RISK · NOT ADVICE
      </div>
    </div>
  );
}