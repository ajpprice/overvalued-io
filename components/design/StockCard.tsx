"use client";
import * as React from 'react';
import { BearBadge } from './BearBadge';
import { Sparkline } from './Sparkline';
import { CAT_LABEL, StockData } from './types';

export interface StockCardProps {
  data: StockData;
  /** Deterministic seed for the sparkline. */
  seed?: number;
  onShort?: (ticker: string) => void;
}

/**
 * OVERVALUED · Stock card.
 * Header row: ticker / mkt / name + Bear badge.
 * Body: price + change + descending sparkline.
 * Footer: 3-stat strip (Overvalued, Short Int, Trustpilot) + SHORT button.
 *
 * `data.cat === 'undervalued'` flips the sparkline green and suppresses
 * the red accent on the OVERVALUED stat.
 */
export function StockCard({ data, seed = 1, onShort }: StockCardProps) {
  const isUnder = data.cat === 'undervalued';
  return (
    <div className="ov-card" style={{ padding: 0 }}>
      <div style={{ padding: '18px 18px 14px' }}>
        <div className="row between center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="font-display" style={{ fontSize: 26, color: '#fff' }}>{data.ticker}</div>
              <div className="label">{data.mkt}</div>
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--ov-fg-dim)', letterSpacing: '0.04em' }}>
              {data.name}
            </div>
          </div>
          <BearBadge score={data.score} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="font-mono" style={{ fontSize: 28, color: '#fff', fontWeight: 700, letterSpacing: '0.01em', lineHeight: 1 }}>
              {data.price}
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: data.chg.startsWith('-') ? 'var(--ov-red)' : '#fff', marginTop: 4, letterSpacing: '0.05em' }}>
              {data.chg} TODAY
            </div>
          </div>
          <Sparkline seed={seed} color={isUnder ? '#8AE6B4' : '#E63946'} />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <span className={`ov-tag cat-${data.cat}`}>{CAT_LABEL[data.cat]}</span>
          {data.note && <span className="ov-tag cat-valuation" style={{ borderStyle: 'dashed' }}>{data.note}</span>}
        </div>
      </div>

      <div className="ov-hr" />

      <div style={{ padding: '12px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <Stat label="OVERVALUED" value={data.over} accent={!isUnder} />
        <Stat label="SHORT INT" value={data.shortInt} />
        <Stat label="TRUSTPILOT" value={data.trust} />
      </div>

      <div className="ov-hr" />
      <button
        className="ov-btn ov-btn-dark"
        onClick={() => onShort?.(data.ticker)}
        style={{ width: '100%', justifyContent: 'space-between', padding: '14px 16px', border: 0 }}
      >
        <span>SHORT {data.ticker}</span>
        <span style={{ color: 'var(--ov-red)' }}>▼</span>
      </button>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className="label">{label}</div>
      <div className="font-mono" style={{ fontSize: 13, color: accent ? 'var(--ov-red)' : '#fff', fontWeight: 500, letterSpacing: '0.02em' }}>
        {value}
      </div>
    </div>
  );
}